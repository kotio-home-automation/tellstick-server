const telldus = require('telldus')

function list(cb) {
  telldus.getDevices((err, switches) => {
    if (err) {
      console.log('Error while fetching tellstick switches:', err)
      return null
    } else {
      const individualSwitches = switches.filter(deviceFilter).map(parseSwitchData)
      const switchGroups = switches.filter(groupFilter).map(parseSwitchData)
      const data = groupSwitches(individualSwitches, switchGroups)
      cb(data)
    }
  })
}

function turnOn(devices, cb) {
  devices.map(deviceId => {
    telldus.turnOn(deviceId, (err, status) => {
      if (err) {
        console.error(`Error switching on device ${deviceId}:`, err)
      }
    })
  })
}

function turnOff(devices, cb) {
  devices.map(deviceId => {
    telldus.turnOff(deviceId, (err) => {
      if (err) {
        console.error(`Error switching off device ${deviceId}:`, err)
      }
    })
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
