const telldus = require('telldus')
const conf = require('./config')

const Promise = require('bluebird')
const getSensors = Promise.promisify(telldus.getSensors)

function sensorData() {
  return getSensors()
    .then(sensors => {
      const sensorIds = conf.configuredSensors.map(s => s.id)
      const knownSensors = sensors.filter(s => sensorIds.includes(s.id))
      return knownSensors.map(parseSensorData)
    })
    .catch(e => {
      console.error('Error while listing sensors:', e)
      throw e
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
