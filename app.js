const serviceUuid = '19b10000-0000-537e-4f6c-d104768a1214';

const characteristicUuids = {
  temperature: '19b10000-2001-537e-4f6c-d104768a1214',
  humidity: '19b10000-3001-537e-4f6c-d104768a1214',
  airQuality: '19b10000-9001-537e-4f6c-d104768a1214',
};

const connectButton = document.getElementById('connect-button');

connectButton.addEventListener('click', connectToDevice);

async function connectToDevice() {
  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [serviceUuid],
    });

    device.addEventListener('gattserverdisconnected', onDisconnected);

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(serviceUuid);

    const characteristics = {};

    for (const [key, uuid] of Object.entries(characteristicUuids)) {
      characteristics[key] = await service.getCharacteristic(uuid);
    }

    startReadingData(characteristics);
  } catch (error) {
    console.error('Connection failed!', error);
    alert('Connection failed! Please try again.');
  }
}

function onDisconnected() {
  console.log('Device disconnected');
  alert('Device disconnected');
}

async function startReadingData(characteristics) {
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

async function readFloatCharacteristic(characteristic) {
  const value = await characteristic.readValue();
  return value.getFloat32(0, true);
}

async function readUintCharacteristic(characteristic) {
  const value = await characteristic.readValue();
  return value.getUint8(0);
}

function updateDisplay(data) {
  document.getElementById('temperature-value').textContent = `${data.temperature.toFixed(1)} °C`;
  document.getElementById('humidity-value').textContent = `${data.humidity} %`;
  document.getElementById('air-quality-value').textContent = data.airQuality.toFixed(1);
}

function provideInsights(data) {
  const insights = [];

  if (data.airQuality >= 100) {
    insights.push('Air quality is poor. Stay indoors and consider using an air purifier.');
  } else if (data.airQuality >= 50) {
    insights.push('Air quality is moderate. Limit prolonged outdoor activities.');
  } else {
    insights.push('Air quality is good. Safe for outdoor activities.');
  }

  if (data.humidity > 60) {
    insights.push('High humidity levels detected. May trigger asthma symptoms.');
  } else if (data.humidity < 30) {
    insights.push('Low humidity levels detected. Dry air may cause irritation.');
  }

  displayInsights(insights);
}

function displayInsights(insights) {
  const insightsList = document.getElementById('insights-list');
  insightsList.innerHTML = '';

  insights.forEach((insight) => {
    const listItem = document.createElement('li');
    listItem.textContent = insight;
    insightsList.appendChild(listItem);
  });
}