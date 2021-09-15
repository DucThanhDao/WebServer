const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Device_Type = new Schema(
    {
        name: {type: String},
        read_coils: {type: String},
        write_coils: {type: String},
        read_register: {type: Array},
        write_register: {type: Array},
        watch_register: {type: Array},
        is_active: {type: Number},
        version: {type: String},
    },
    {
        _id: true,
        timestamps: true,
    }
)

module.exports = mongoose.model('Device_Type', Device_Type)
