const Device_Type = require('../models/Device_Type')

class Device_TypeController {
    // [GET] /device_type: show toàn bộ các device type có trong database
    async getDeviceTypeAll(req, res) {
        await Device_Type.find({})
            .then((device_type) => {
                let result = []
                for (var i in device_type) {
                    result.push({
                        id: device_type[i]._id,
                        name: device_type[i].name,
                        version: device_type[i].version,
                        read_register: device_type[i].read_register,
                        write_register: device_type[i].write_register,
                        watch_register: device_type[i].watch_register,
                        read_coils: device_type[i].read_coils,
                        write_coils: device_type[i].write_coils,
                    })
                }
                res.json({
                    errCode: 0,
                    errMessage: 'OK',
                    device_type: result,
                })
            })
            .catch(() => {
                res.status(500).json({
                    errCode: 1,
                    errMessage: `Can't find any device type!`,
                })
            })
    }

    // [POST] /device_type/add-new: tạo một device type mới trong database nhưng không có data cho read_register
    async postDeviceTypeAddNew(req, res) {
        const checkName = req.body.name

        let check = 0
        await Device_Type.find({})
            .then((device) => {
                for (let i = 0; i < device.length; i++) {
                    if (checkName === device[i].name) {
                        check = 1
                        break
                    }
                }
            })
            .catch(() => {
                res.status(500).json({
                    errCode: 1,
                    errMessage: `Can't find any device type!`,
                })
            })

        if (!check) {
            const device_type = new Device_Type(req.body)
            await device_type
                .save()
                .then(() => {
                    res.status(200).json({
                        errCode: 0,
                        errMessage: 'OK',
                        device_type: {
                            id: device_type._id,
                            version: device_type.version,
                            name: device_type.name,
                            read_register: device_type.read_register,
                        },
                    })
                })
                .catch(() =>
                    res.status(500).json({
                        errCode: 3,
                        errMessage: `Can't create a new device type!`,
                    })
                )
        } else {
            res.json({
                errCode: 2,
                errMessage: `Name of device type is duplicated!`,
            })
        }
    }

    // [DELETE] /:id/device_type: xóa một device type có trong database
    async deviceTypeDelete(req, res) {
        await Device_Type.findById(req.params.id)
            .then(async (device_type) => {
                await Device_Type.deleteOne({_id: req.params.id})
                    .then(() =>
                        res.json({
                            device_type: {
                                id: device_type._id,
                                name: device_type.name,
                                read_register: device_type.read_register,
                                write_register: device_type.write_register,
                                watch_register: device_type.watch_register,
                                is_active: device_type.is_active,
                            },
                            errCode: 0,
                            errMessage: `Device Type is deleted!`,
                        })
                    )
                    .catch(() =>
                        res.status(500).json({
                            errCode: 2,
                            errMessage: `Device Type isn't deleted!`,
                        })
                    )
            })
            .catch(() =>
                res.status(500).json({
                    errCode: 1,
                    errMessage: `Missing parameters or device type can't be found!`,
                })
            )
    }

    // [POST] /:id/device_type: edit một device type có trong database
    async postDeviceTypeOne(req, res) {
        await Device_Type.updateOne({_id: req.params.id}, req.body)
            .then(async () => {
                await Device_Type.findById(req.params.id)
                    .then((device_type) =>
                        res.status(200).json({
                            device_type: {
                                id: device_type._id,
                                name: device_type.name,
                                read_register: device_type.read_register,
                                write_register: device_type.write_register,
                                watch_register: device_type.watch_register,
                                is_active: device_type.is_active,
                            },
                            errCode: 0,
                            errMessage: 'OK',
                        })
                    )
                    .catch(() => {
                        res.status(500).json({
                            errCode: 2,
                            errMessage: `Can not find device type!`,
                        })
                    })
            })
            .catch(() => {
                res.status(500).json({
                    errCode: 1,
                    errMessage: `Can not update device type!`,
                })
            })
    }

    // ---------------------------------------------------------------------
    // ---------------------------------------------------------------------

    // [DELETE] /:id/device_type/delete/element: xóa một element ở vị trí cụ thể trong device type
    async deviceTypeDeleteElement(req, res, next) {
        await Device_Type.findById(req.params.id)
            .then(async (device_type) => {
                let number = req.body.number

                device_type.read_register.splice(number, 1)
                let result = await Device_Type.findByIdAndUpdate(req.params.id, {$set: device_type}, {new: true})
                res.json({
                    errCode: 0,
                    errMessage: `OK`,
                    device_type: {
                        id: result._id,
                        name: result.name,
                        read_register: result.read_register,
                        is_active: result.is_active,
                    },
                })
            })
            .catch(() => {
                res.json({
                    errCode: 1,
                    errMessage: `Can't find out device!`,
                })
            })
    }

    // [POST] /:id/device_type/add-new-params: tạo mới các element cho device type mới tạo
    async postDeviceTypeAddNewParams(req, res) {
        await Device_Type.findById(req.params.id)
            .then(async (device_type) => {
                let copyItem = device_type
                copyItem.read_register = req.body.read_register

                await Device_Type.updateOne({_id: req.params.id}, copyItem)
                    .then(() => {
                        res.status(200).json({
                            errCode: 0,
                            errMessage: 'OK',
                        })
                    })
                    .catch(() => {
                        res.json({
                            errCode: 2,
                            errMessage: `Can't update device type!`,
                        })
                    })
            })
            .catch(() => {
                res.json({
                    errCode: 1,
                    errMessage: `Can't find any device type!`,
                })
            })
    }

    // [POST] /device_type: tạo một device type mới trong database
    async postDeviceType(req, res, next) {
        const newDeviceElements = req.body.read_register
        const firstName = newDeviceElements[0].name
        const deviceTypeAdd = req.body
        const deviceTypeName = req.body.name

        let check = 0
        await Device_Type.find({})
            .then((device) => {
                for (let i = 0; i < device.length; i++) {
                    if (deviceTypeName === device[i].name) {
                        check = 1
                        break
                    }
                }
            })
            .catch(() => {
                res.status(500).json({
                    errCode: 1,
                    errMessage: `There's no data in database!`,
                })
            })

        if (!check) {
            if (newDeviceElements.length == 1) {
                postNewDeviceType(deviceTypeAdd)
            } else {
                let checkNameElement = 0
                for (var i = 1; i < newDeviceElements.length; i++) {
                    if (firstName == newDeviceElements[i].name) {
                        checkNameElement = 1
                        break
                    }
                }
                if (!checkNameElement) {
                    postNewDeviceType(deviceTypeAdd)
                } else {
                    res.status(404).json({
                        errorCode: 3,
                        errMessage: 'Name of elements is duplicated!',
                    })
                }
            }
        } else {
            res.status(500).json({
                errCode: 2,
                errMessage: `Name of device type is duplicated!`,
            })
        }

        async function postNewDeviceType(deviceTypeAdd) {
            const device_type = new Device_Type(deviceTypeAdd)
            await device_type
                .save()
                .then(() => {
                    res.status(200).json({
                        errCode: 0,
                        errMessage: 'OK',
                        device_type: {
                            id: device_type._id,
                            name: device_type.name,
                            read_register: device_type.read_register,
                        },
                    })
                })
                .catch(() =>
                    res.status(500).json({
                        errCode: 4,
                        errMessage: `Can't create a new device type!`,
                    })
                )
        }
    }

    // [GET] /:id/device_type: show một device type có trong database theo id
    async getDeviceTypeOne(req, res, next) {
        await Device_Type.findById(req.params.id)
            .then((device_type) =>
                res.json({
                    device_type: {
                        errCode: 0,
                        errMessage: `OK`,
                        id: device_type._id,
                        name: device_type.name,
                        read_register: device_type.read_register,
                        is_active: device_type.is_active,
                    },
                })
            )
            .catch(() => {
                res.status(500).json({
                    errCode: 1,
                    errMessage: `Can't find any device type!`,
                })
            })
    }

    // [POST] /:id/device_type/read_register: thêm một element vào trong một device type
    async deviceTypeAddElement(req, res, next) {
        const checkName = req.body.tagName
        const dataAdd = req.body

        await Device_Type.findById(req.params.id, async function (err, device_type) {
            if (device_type) {
                const read_register = device_type.read_register
                let check = 0

                read_register.forEach((elements) => {
                    if (elements.tagName === checkName) {
                        check = 1
                        return check
                    }
                })
                if (!check) {
                    let result = await Device_Type.findByIdAndUpdate(
                        req.params.id,
                        {$push: {read_register: dataAdd}},
                        {new: true}
                    )
                    res.json({
                        errCode: 0,
                        errMessage: `OK`,
                        device_type: {
                            id: result._id,
                            name: result.name,
                            read_register: result.read_register,
                            is_active: result.is_active,
                        },
                    })
                } else {
                    res.json({
                        errCode: 2,
                        errMessage: `Name of element is duplicated!`,
                    })
                }
            } else {
                res.json({
                    errCode: 1,
                    errMessage: `Can't find out device!`,
                })
            }
        })
    }

    // [GET] /:id/device_type/read_register: show chi tiết một read_register có trong một device type
    getread_registerDeviceType(req, res, next) {
        Device_Type.findById(req.params.id)
            .then((device_type) =>
                res.json({
                    device_type_id: device_type._id,
                    read_register: device_type.read_register,
                })
            )
            .catch(next)
    }

    // [POST] /:id/device_type/edit/element: chỉnh sửa một element ở một vị trí cụ thể
    async deviceTypeEditElement(req, res, next) {
        await Device_Type.findById(req.params.id, async function (err, device_type) {
            if (device_type) {
                const number = req.body.number
                delete req.body.number
                const checkName = req.body.tagName
                let check = 0

                device_type.read_register.forEach((elements) => {
                    if (elements.tagName == checkName) {
                        check = 1
                        return check
                    }
                })
                if (!check) {
                    device_type.read_register[number] = Object.assign({}, req.body)
                    let result = await Device_Type.findByIdAndUpdate(req.params.id, {$set: device_type}, {new: true})
                    res.json({
                        errCode: 0,
                        errMeassage: `OK`,
                        device_type: {
                            id: result._id,
                            name: result.name,
                            read_register: result.read_register,
                            is_active: result.is_active,
                        },
                    })
                } else {
                    res.json({
                        errCode: 2,
                        errMessage: `Name of element is duplicated!`,
                    })
                }
            } else {
                res.json({
                    errCode: 1,
                    errMessage: `Can't find out device!`,
                })
            }
        })
    }

    // [POST] /:id/device_type/copy: clone một device type đã có sẵn trong database
    async deviceTypeCopy(req, res) {
        await Device_Type.findById(req.params.id)
            .then(async (device_type) => {
                let dataCopy = {
                    name: req.body.name,
                    read_register: device_type.read_register,
                    write_register: device_type.write_register,
                    watch_register: device_type.watch_register,
                    read_coils: device_type.read_coils,
                    write_coils: device_type.write_coils,
                    is_active: device_type.is_active,
                }

                let new_device_type = new Device_Type(dataCopy)
                await new_device_type
                    .save()
                    .then(() => {
                        res.json({
                            errCode: 0,
                            errMessage: `OK`,
                            device_type: {
                                id: new_device_type._id,
                                name: new_device_type.name,
                                read_register: new_device_type.read_register,
                                write_register: new_device_type.write_register,
                                watch_register: new_device_type.watch_register,
                                is_active: new_device_type.is_active,
                            },
                        })
                    })
                    .catch(() =>
                        res.json({
                            errCode: 2,
                            errMessage: `Name of device is duplicated!`,
                        })
                    )
            })
            .catch(() => {
                res.json({
                    errCode: 1,
                    errMessage: `Can't find out device!`,
                })
            })
    }
}

module.exports = new Device_TypeController()
