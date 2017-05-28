const telldus = require('telldus')

const configuredSensors = [
  {
    name: 'Parveke',
    id: 136
  },
  {
    name: 'Olohuone',
    id: 135
  }
]

function sensorData(cb) {
  telldus.getSensors((err, sensors) => {
    if (err) {
      console.error('Error: ' + err);
      return null
    } else {
      const sensorIds = configuredSensors.map(s => s.id)
      const knownSensors = sensors.filter(s => sensorIds.includes(s.id))
      const sdata = knownSensors.map(parseSensorData)
      cb(sdata)
    }
  })
}

const parseSensorData = sensor => {
  if (sensor.model === 'temperaturehumidity') {
    return parseHumiditySensorData(sensor)
  } else {
    return parseTemperatureSensorData(sensor)
  }
}

const parseTemperatureSensorData = sensor => {
  const name = configuredSensors.find(s => s.id === sensor.id).name
  const temperature = sensor.data.find(d => d.type === 'TEMPERATURE').value

  return {
    id: sensor.id,
    name: name,
    temperature: temperature
  }
}

const parseHumiditySensorData = sensor => {
  const name = configuredSensors.find(s => s.id === sensor.id).name
  const temperature = sensor.data.find(d => d.type === 'TEMPERATURE').value
  const humidity = sensor.data.find(d => d.type === 'HUMIDITY').value

  return {
    id: sensor.id,
    name: name,
    temperature: temperature,
    humidity: humidity
  }
}

module.exports = {
  sensors: sensorData
}
