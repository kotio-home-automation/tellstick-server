const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Promise = require('bluebird')
const tellstickSensors = require('./sensors')
const tellstickSwitches = require('./switches')
const port = 3101

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.listen(port)

console.log(`Tellstick HTTP server running on ${port}`)

app.get('/tellstick/sensors', function(req, res) {
  tellstickSensors.sensors()
    .then(response => res.json(response))
    .catch(e => res.status(500).json(e))
})

app.get('/tellstick/switches', function(req, res) {
  tellstickSwitches.list()
    .then(response => res.json(response))
    .catch(e => res.status(500).json(e))
})

app.post('/tellstick/on', function(req, res) {
  tellstickSwitches.turnOn(req.body)
    .then(response => res.json(response))
    .catch(e => res.status(500).json(e))
})

app.post('/tellstick/off', function(req, res) {
  tellstickSwitches.turnOff(req.body)
    .then(response => res.json(response))
    .catch(e => res.status(500).json(e))
})
