const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ModbusTCPValue = new Schema(
    {
        station: {type: String},
        siteID: {type: Number},
        slaveID: {type: Number},
        value: {type: Number},
        idValue: {type: Number},
        valueName: {type: String},
        deviceName: {type: String},
    },
    {
        _id: true,
        timestamps: true,
    }
)

module.exports = mongoose.model('ModbusTCPValue', ModbusTCPValue)
