// app.js

// Add these variables at the top of the file
let lastNotificationTime = {};
const notificationCooldown = 300000; // 5 minutes in milliseconds

// UUIDs for the BLE service and characteristics
const serviceUuid = '19b10000-0000-537e-4f6c-d104768a1214';

const characteristicUuids = {
  temperature: '19b10000-2001-537e-4f6c-d104768a1214',
  humidity: '19b10000-3001-537e-4f6c-d104768a1214',
  airQuality: '19b10000-9001-537e-4f6c-d104768a1214',
};

// Elements from the DOM
const connectButton = document.getElementById('connect-button');

// Event listener for the connect button
connectButton.addEventListener('click', connectToDevice);

// User settings object
let userSettings = {
  airQualityThreshold: 100,
  humidityHighThreshold: 60,
  humidityLowThreshold: 30,
};

// Load settings from localStorage
function loadSettings() {
  const savedSettings = localStorage.getItem('userSettings');
  if (savedSettings) {
    userSettings = JSON.parse(savedSettings);
  }
}

// Save settings to localStorage
function saveSettings() {
  localStorage.setItem('userSettings', JSON.stringify(userSettings));
}

// Initialize settings form fields
function initializeSettingsForm() {
  document.getElementById('airQualityThreshold').value = userSettings.airQualityThreshold;
  document.getElementById('humidityHighThreshold').value = userSettings.humidityHighThreshold;
  document.getElementById('humidityLowThreshold').value = userSettings.humidityLowThreshold;
}

// Handle settings form submission
document.getElementById('settings-form').addEventListener('submit', function(event) {
  event.preventDefault();
  userSettings.airQualityThreshold = parseFloat(document.getElementById('airQualityThreshold').value);
  userSettings.humidityHighThreshold = parseFloat(document.getElementById('humidityHighThreshold').value);
  userSettings.humidityLowThreshold = parseFloat(document.getElementById('humidityLowThreshold').value);
  saveSettings();
  showAlert('Settings saved successfully!', 'success');
});

// Load settings on page load
window.addEventListener('DOMContentLoaded', (event) => {
  loadSettings();
  initializeSettingsForm();
});

// Chart instances and data arrays
let temperatureChart, humidityChart, airQualityChart;
let temperatureData = [];
let humidityData = [];
let airQualityData = [];
let timeLabels = [];

// Initialize charts
function initializeCharts() {
  const ctxTemp = document.getElementById('temperature-chart').getContext('2d');
  const ctxHum = document.getElementById('humidity-chart').getContext('2d');
  const ctxAQI = document.getElementById('air-quality-chart').getContext('2d');

  temperatureChart = new Chart(ctxTemp, {
    type: 'line',
    data: {
      labels: timeLabels,
      datasets: [{
        label: 'Temperature (°F)', // Changed from °C to °F
        data: temperatureData,
        borderColor: 'rgb(255, 99, 132)',
        fill: false,
        tension: 0.1,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  humidityChart = new Chart(ctxHum, {
    type: 'line',
    data: {
      labels: timeLabels,
      datasets: [{
        label: 'Humidity (%)',
        data: humidityData,
        borderColor: 'rgb(54, 162, 235)',
        fill: false,
        tension: 0.1,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  airQualityChart = new Chart(ctxAQI, {
    type: 'line',
    data: {
      labels: timeLabels,
      datasets: [{
        label: 'Air Quality Index',
        data: airQualityData,
        borderColor: 'rgb(75, 192, 192)',
        fill: false,
        tension: 0.1,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// Connect to the BLE device
async function connectToDevice() {
  try {
    // Check for Bluetooth availability
    const isAvailable = await navigator.bluetooth.getAvailability();
    if (!isAvailable) {
      alert('Bluetooth not available on this device/browser.');
      return;
    }

    // Request the BLE device
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'N' }], // Adjust the name prefix as needed
      optionalServices: [serviceUuid],
    });

    device.addEventListener('gattserverdisconnected', onDisconnected);

    // Connect to GATT server
    const server = await device.gatt.connect();

    // Get primary service
    const service = await server.getPrimaryService(serviceUuid);

    // Get characteristics
    const characteristics = {};

    for (const [key, uuid] of Object.entries(characteristicUuids)) {
      characteristics[key] = await service.getCharacteristic(uuid);
    }

    // Initialize charts
    initializeCharts();

    // Start reading data
    startReadingData(characteristics);

    showAlert('Device connected successfully!', 'success');
  } catch (error) {
    console.error('Connection failed!', error);
    showAlert('Connection failed! Please try again.', 'danger');
  }
}

// Handle device disconnection
function onDisconnected() {
  console.log('Device disconnected');
  showAlert('Device disconnected', 'warning');
}

// Start reading data from characteristics
async function startReadingData(characteristics) {
  // Request notification permission
  if ('Notification' in window) {
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notifications are disabled. You will not receive alerts for critical readings.');
      }
    }
  } else {
    console.log('This browser does not support notifications.');
  }

  // Read data periodically
  setInterval(async () => {
    try {
      const temperature = await readFloatCharacteristic(characteristics.temperature);
      const humidity = await readUintCharacteristic(characteristics.humidity);
      const airQuality = await readFloatCharacteristic(characteristics.airQuality);

      const data = { temperature, humidity, airQuality };
      updateDisplay(data);
      provideInsights(data);
      saveDataPoint(data);
    } catch (error) {
      console.error('Error reading data:', error);
    }
  }, 1000);
}

// Read float value from characteristic and convert to Fahrenheit
async function readFloatCharacteristic(characteristic) {
  const value = await characteristic.readValue();
  const celsius = value.getFloat32(0, true);
  return (celsius * 9/5) + 32; // Convert Celsius to Fahrenheit
}

// Read unsigned integer value from characteristic
async function readUintCharacteristic(characteristic) {
  const value = await characteristic.readValue();
  return value.getUint8(0);
}

// Update display and charts
function updateDisplay(data) {
  const currentTime = new Date().toLocaleTimeString();

  // Update data arrays
  temperatureData.push(data.temperature);
  humidityData.push(data.humidity);
  airQualityData.push(data.airQuality);
  timeLabels.push(currentTime);

  // Limit data arrays to the last 20 points
  const maxDataPoints = 20;
  if (temperatureData.length > maxDataPoints) {
    temperatureData.shift();
    humidityData.shift();
    airQualityData.shift();
    timeLabels.shift();
  }

  // Update charts
  temperatureChart.update();
  humidityChart.update();
  airQualityChart.update();

  // Update text values
  document.getElementById('temperature-value').textContent = `${data.temperature.toFixed(1)} °F`;
  document.getElementById('humidity-value').textContent = `${data.humidity} %`;
  document.getElementById('air-quality-value').textContent = data.airQuality.toFixed(1);
}

// Provide insights and send notifications
function provideInsights(data) {
  const insights = [];
  const criticalAlerts = [];

  // Air Quality Index Analysis
  if (data.airQuality >= userSettings.airQualityThreshold) {
    const message = 'Air quality is poor. Stay indoors and consider using an air purifier.';
    insights.push(message);
    criticalAlerts.push({ type: 'airQuality', message });
  } else if (data.airQuality >= 50) {
    insights.push('Air quality is moderate. Limit prolonged outdoor activities.');
  } else {
    insights.push('Air quality is good. Enjoy your day!');
  }

  // Humidity Analysis
  if (data.humidity > userSettings.humidityHighThreshold) {
    const message = 'High humidity detected. Possible increase in allergens.';
    insights.push(message);
    criticalAlerts.push({ type: 'humidity', message });
  } else if (data.humidity < userSettings.humidityLowThreshold) {
    const message = 'Low humidity detected. Dry air may cause irritation.';
    insights.push(message);
    criticalAlerts.push({ type: 'humidity', message });
  }

  // Temperature Analysis
  if (data.temperature > 86) {
    const message = 'High temperature detected. Stay hydrated.';
    insights.push(message);
    criticalAlerts.push({ type: 'temperature', message });
  } else if (data.temperature < 50) {
    const message = 'Low temperature detected. Keep warm to avoid triggers.';
    insights.push(message);
    criticalAlerts.push({ type: 'temperature', message });
  }

  displayInsights(insights);

  // Send notifications for critical alerts with cooldown
  criticalAlerts.forEach(alert => {
    sendNotificationWithCooldown(alert.type, alert.message);
  });
}

// Display insights in the UI
function displayInsights(insights) {
  const insightsList = document.getElementById('insights-list');
  insightsList.innerHTML = '';

  insights.forEach((insight) => {
    const listItem = document.createElement('li');
    listItem.textContent = insight;
    listItem.classList.add('list-group-item');
    insightsList.appendChild(listItem);
  });
}

// Send browser notification
function sendNotification(message) {
  if ('Notification' in window && Notification.permission === 'granted') {
    // For Android compatibility
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(function(registration) {
        registration.showNotification('Asthma Aware Alert', {
          body: message,
          icon: 'icon.png', // Replace with the path to your icon image
          vibrate: [200, 100, 200], // Vibration pattern for mobile devices
          tag: 'asthma-alert' // Prevents duplicate notifications
        });
      });
    } else {
      // Fallback for browsers that don't support service workers
      new Notification('Asthma Aware Alert', {
        body: message,
        icon: 'icon.png' // Replace with the path to your icon image
      });
    }
  }
}

// Add this new function for notifications with cooldown
function sendNotificationWithCooldown(type, message) {
  const now = Date.now();
  if (!lastNotificationTime[type] || (now - lastNotificationTime[type] > notificationCooldown)) {
    sendNotification(message);
    lastNotificationTime[type] = now;
  }
}

// Show alert messages using Bootstrap alerts
function showAlert(message, type = 'success') {
  const alertContainer = document.getElementById('alert-container');
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.role = 'alert';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  `;
  alertContainer.appendChild(alertDiv);

  // Automatically remove the alert after 5 seconds
  setTimeout(() => {
    $(alertDiv).alert('close');
  }, 5000);
}

// Save data point to localStorage
function saveDataPoint(data) {
  let historicalData = JSON.parse(localStorage.getItem('historicalData')) || [];
  historicalData.push({
    timestamp: new Date().toISOString(),
    temperature: data.temperature,
    humidity: data.humidity,
    airQuality: data.airQuality,
  });
  localStorage.setItem('historicalData', JSON.stringify(historicalData));
}