const telldus = require('telldus')
const Promise = require('bluebird')

const turnOnDevice = Promise.promisify(telldus.turnOn)
const turnOffDevice = Promise.promisify(telldus.turnOff)
const getDevices = Promise.promisify(telldus.getDevices)

function list() {
  return getDevices()
    .then(switches => {
      const individualSwitches = switches.filter(deviceFilter).map(parseSwitchData)
      const switchGroups = switches.filter(groupFilter).map(parseSwitchData)
      return groupSwitches(individualSwitches, switchGroups)
    })
    .catch(e => {
      console.error('Error while listing telldus switches: ', e)
      throw e
    })
}

function turnOn(devices, cb) {
  const devicesToTurnOn = devices.map(device => turnOnDevice(device))
  const turnOnStatus = Promise.all(devicesToTurnOn)
  return turnOnStatus
    .then(() => list())
    .catch(e => {
      console.error('Error while turning on telldus switch: ', e)
      throw e
    })
}

function turnOff(devices, cb) {
  const devicesToTurnOff = devices.map(device => turnOffDevice(device))
  const turnOffStatus = Promise.all(devicesToTurnOff)
  return turnOffStatus
    .then(() => list())
    .catch(e => {
      console.error('Error while turning off telldus switch: ', e)
      throw e
    })
}

const parseSwitchData = tdSwitch => {
  if (controllableSwitch(tdSwitch)) {
    return {
      name: tdSwitch.name,
      id: tdSwitch.id,
      switchedOn: tdSwitch.status.name === 'ON' ? true : false
    }
  } else {
    return null
  }
}

const controllableSwitch = tdSwitch => tdSwitch.methods.includes('TURNON') && tdSwitch.methods.includes('TURNOFF')

const deviceFilter = tdSwitch => tdSwitch.type === 'DEVICE'

const groupFilter = tdSwitch => tdSwitch.type === 'GROUP'

const groupSwitches = (individualSwitches, switchGroups) => {
  return {
    devices: individualSwitches,
    groups: switchGroups
  }
}

module.exports = {
  list: list,
  turnOn: turnOn,
  turnOff: turnOff
}
