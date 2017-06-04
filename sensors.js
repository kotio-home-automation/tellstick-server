const telldus = require('telldus')
const conf = require('./config')


function sensorData(cb) {
  telldus.getSensors((err, sensors) => {
    if (err) {
      console.error('Error while fetching tellstick sensors:', err);
      return null
    } else {
      const sensorIds = configuredSensors.map(s => s.id)
      const knownSensors = sensors.filter(s => sensorIds.includes(s.id))
      const data = knownSensors.map(parseSensorData)
      cb(data)
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
  const name = conf.configuredSensors.find(s => s.id === sensor.id).name
  const temperature = sensor.data.find(d => d.type === 'TEMPERATURE').value

  return {
    id: sensor.id,
    name: name,
    temperature: temperature
  }
}

const parseHumiditySensorData = sensor => {
  const name = conf.configuredSensors.find(s => s.id === sensor.id).name
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
