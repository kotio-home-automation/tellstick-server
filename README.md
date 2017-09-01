# Tellstick

Tellstick requires the tellstick dev library.

See documentation and installation instructions on [telldus wiki](https://developer.telldus.com/)

## Debian based systems after apt sources configuration

  `sudo apt-get install libtelldus-core-dev`

## Configuring tellstick sensors

For some reason tellstick sensor device returns a bunch of faulty sensor readings (atleast mine does) and therefore the known valid sensors must be configured within file `src/config.js`. See [My blog post](http://blog.polarcoder.net/2016/02/diy-home-automation-v2.html) for additional info.

Basically the configuration contains the id's of the known valid sensors and names of your choosing for those sensors.

## Install dependencies

  ```
  npm install
  ```

This can take a while because of the native library compilation of tellstick if your building on RPi or similar platform.

## Start the server

  `node src/index.js`

If your user doesn't have rights to tellstick's configuration file you'll have to run the command with `sudo` or as `root`.

## Test server by fetching tellstick switch or sensor data

Go to URL http://localhost:3101/tellstick/switches or http://localhost:3101/tellstick/sensors

## REST API

Kotio Tellstick server REST API works over http with JSON messages.

### Fetching tellstick sensor data

URL: `http://localhost:3101/tellstick/sensors`

Response format:

```javascript
[
  {
    "id": 124,
    "name": "Defined tellstick sensor name",
    "temperature": "26.8",
    "humidity": "42"
  }
]
```

* id is the identifier of the given sensor
* name is the configured name of the sensor
* temperature is in celsius with decimals but returned as string
* humidity is relative humidity percentage returned as string

Response is a array containing all configured sensors.

### Fetching tellstick outlet switches and switch groups

URL: `http://localhost:3101/tellstick/switches`

Response format:

```javascript
{
  "devices": [
    {
      "name": "Defined tellstick switch name",
      "id": 123,
      "switchedOn": true
    },
    {
      "name": "Other defined tellstick switch name",
      "id": 128,
      "switchedOn": false
    },
  ],
  "groups": [
    {
      "name": "Defined tellstick switch group name",
      "id": 140,
      "switchedOn": false
    },
  ]
}
```

Request response contains all individual outlet switches and switch groups separated. The format for both is the same.
* name is the defined name of the outlet switch per tellstick configuration
* id is the unique id of the outlet switch or switch group
* switchedOn indicates whether the switch outlet or group is turned on or not

### Turning tellstick outlet switch or switch group on

URL: `http://localhost:3101/tellstick/on`

Method: POST

Request body:

```javascript
[123,128]
```
Response format:

```javascript
{
  "devices": [
    {
      "name": "Defined tellstick switch name",
      "id": 123,
      "switchedOn": true
    },
    {
      "name": "Other defined tellstick switch name",
      "id": 128,
      "switchedOn": true
    },
  ],
  "groups": [
    {
      "name": "Defined tellstick switch group name",
      "id": 140,
      "switchedOn": false
    },
  ]
}
```

The request takes array of outlet switch id's or group id's as it's body and returns the same response as does the listing of switches.

The off request is similar but with different URL.

### Turning tellstick outlet switch or switch group off

URL: `http://localhost:3101/tellstick/off`

Method: POST

Request body:

```javascript
[123]
```
Response format:

```javascript
{
  "devices": [
    {
      "name": "Defined tellstick switch name",
      "id": 123,
      "switchedOn": false
    },
    {
      "name": "Other defined tellstick switch name",
      "id": 128,
      "switchedOn": true
    },
  ],
  "groups": [
    {
      "name": "Defined tellstick switch group name",
      "id": 140,
      "switchedOn": false
    },
  ]
}
```

The request takes array of outlet switch id's or group id's as it's body and returns the same response as does the listing of switches.

The on request is similar but with different URL.
