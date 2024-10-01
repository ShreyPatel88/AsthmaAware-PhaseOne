// app.js

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
  alert('Settings saved successfully!');
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
        label: 'Temperature (°C)',
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
  alert('Settings saved successfully!');
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
        label: 'Temperature (°C)',
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
    // Check for Bluetooth availability
    const isAvailable = await navigator.bluetooth.getAvailability();
    if (!isAvailable) {
      alert('Bluetooth not available on this device/browser.');
      return;
    }

    // Request the BLE device
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [serviceUuid],
    });

    device.addEventListener('gattserverdisconnected', onDisconnected);

    // Connect to GATT server
    // Connect to GATT server
    const server = await device.gatt.connect();

    // Get primary service

    // Get primary service
    const service = await server.getPrimaryService(serviceUuid);

    // Get characteristics
    // Get characteristics
    const characteristics = {};

    for (const [key, uuid] of Object.entries(characteristicUuids)) {
      characteristics[key] = await service.getCharacteristic(uuid);
    }

    // Initialize charts
    initializeCharts();

    // Start reading data
    // Initialize charts
    initializeCharts();

    // Start reading data
    startReadingData(characteristics);
  } catch (error) {
    console.error('Connection failed!', error);
    alert('Connection failed! Please try again.');
  }
}

// Handle device disconnection
// Handle device disconnection
function onDisconnected() {
  console.log('Device disconnected');
  alert('Device disconnected');
}

// Start reading data from characteristics
// Start reading data from characteristics
async function startReadingData(characteristics) {
  // Request notification permission
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
      if (permission !== 'granted') {
        alert('Notifications are disabled. You will not receive alerts for critical readings.');
      }
    });
  }

  // Read data periodically
  // Request notification permission
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
      if (permission !== 'granted') {
        alert('Notifications are disabled. You will not receive alerts for critical readings.');
      }
    });
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
    } catch (error) {
      console.error('Error reading data:', error);
    }
  }, 1000);
}

// Read float value from characteristic
// Read float value from characteristic
async function readFloatCharacteristic(characteristic) {
  const value = await characteristic.readValue();
  return value.getFloat32(0, true);
}

// Read unsigned integer value from characteristic
// Read unsigned integer value from characteristic
async function readUintCharacteristic(characteristic) {
  const value = await characteristic.readValue();
  return value.getUint8(0);
}

// Update display and charts
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
  document.getElementById('temperature-value').textContent = `${data.temperature.toFixed(1)} °C`;
  document.getElementById('humidity-value').textContent = `${data.humidity} %`;
  document.getElementById('air-quality-value').textContent = data.airQuality.toFixed(1);
}

// Provide insights and send notifications
// Provide insights and send notifications
function provideInsights(data) {
  const insights = [];
  const criticalAlerts = [];

  // Air Quality Index Analysis
  if (data.airQuality >= userSettings.airQualityThreshold) {
    const message = 'Air quality is poor. Stay indoors and consider using an air purifier.';
    insights.push(message);
    criticalAlerts.push(message);
  const criticalAlerts = [];

  // Air Quality Index Analysis
  if (data.airQuality >= userSettings.airQualityThreshold) {
    const message = 'Air quality is poor. Stay indoors and consider using an air purifier.';
    insights.push(message);
    criticalAlerts.push(message);
  } else if (data.airQuality >= 50) {
    insights.push('Air quality is moderate. Limit prolonged outdoor activities.');
  } else {
    insights.push('Air quality is good. Safe for outdoor activities.');
  }

  // Humidity Analysis
  if (data.humidity > userSettings.humidityHighThreshold) {
    const message = 'High humidity levels detected. May trigger asthma symptoms.';
    insights.push(message);
    criticalAlerts.push(message);
  } else if (data.humidity < userSettings.humidityLowThreshold) {
    const message = 'Low humidity levels detected. Dry air may cause irritation.';
    insights.push(message);
    criticalAlerts.push(message);
  // Humidity Analysis
  if (data.humidity > userSettings.humidityHighThreshold) {
    const message = 'High humidity levels detected. May trigger asthma symptoms.';
    insights.push(message);
    criticalAlerts.push(message);
  } else if (data.humidity < userSettings.humidityLowThreshold) {
    const message = 'Low humidity levels detected. Dry air may cause irritation.';
    insights.push(message);
    criticalAlerts.push(message);
  }

  displayInsights(insights);

  // Send notifications for critical alerts
  criticalAlerts.forEach(alertMessage => {
    sendNotification(alertMessage);
  });

  // Send notifications for critical alerts
  criticalAlerts.forEach(alertMessage => {
    sendNotification(alertMessage);
  });
}

// Display insights in the UI
// Display insights in the UI
function displayInsights(insights) {
  const insightsList = document.getElementById('insights-list');
  insightsList.innerHTML = '';

  insights.forEach((insight) => {
    const listItem = document.createElement('li');
    listItem.textContent = insight;
    insightsList.appendChild(listItem);
  });
}