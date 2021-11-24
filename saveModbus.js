const ModbusTCPValue = require('./src/app/models/ModebusTCPValue')

// -------------- SETUP MQTT ------------------
const mqtt = require('mqtt')
require('dotenv').config()
const options = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
}
const client = mqtt.connect('mqtt://127.0.0.1:1885', options)

client.on('connect', function () {
    client.subscribe('vungtaudata')
    // client.subscribe('nhatrangdata')
    console.log('Connect MQTT Broker')
})

saveModbus()
function saveModbus() {
    client.on('message', function (topic, message) {
        try {
            let data = JSON.parse(message.toString())
            console.log(data)
            data.forEach((item) => {
                dataInsert = {
                    station: 'Vung Tau',
                    deviceName: item.NameDevice,
                    value: item.Value,
                    valueName: item.TagName,
                }
                postNewValue(dataInsert)
            })
        } catch {
            console.log('Error to read data!')
        }
    })
    deleteValue()
}

async function postNewValue(dataInsert) {
    const newValue = new ModbusTCPValue(dataInsert)
    await newValue
        .save()
        .then(() => {
            console.log('OK')
            idSaved = JSON.stringify(dataInsert.idValue)
            client.publish('valueSaved', idSaved)
        })
        .catch(() => {
            console.log('Not saved!')
        })
}

async function deleteValue() {
    setInterval(async function () {
        await ModbusTCPValue.deleteMany()
            .then(() => {
                console.log('Deleted!')
            })
            .catch(() => {
                console.log('Error!')
            })
    }, 1000)
}

module.exports = saveModbus
