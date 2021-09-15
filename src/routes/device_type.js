const express = require('express')
const router = express.Router()
const device_typeController = require('../app/controllers/Device_TypeController')

router.post('/device_type', device_typeController.postDeviceType)
router.get('/:id/device_type', device_typeController.getDeviceTypeOne)
router.post('/:id/device_type/read_register', device_typeController.deviceTypeAddElement)
router.get('/:id/device_type/read_register', device_typeController.getread_registerDeviceType)
router.post('/:id/device_type/delete/element', device_typeController.deviceTypeDeleteElement)
router.post('/:id/device_type/edit/element', device_typeController.deviceTypeEditElement)
router.post('/:id/device_type/copy', device_typeController.deviceTypeCopy)
router.post('/:id/device_type/add-new-params', device_typeController.postDeviceTypeAddNewParams)

router.post('/device_type/add-new', device_typeController.postDeviceTypeAddNew)
router.delete('/:id/device_type', device_typeController.deviceTypeDelete)
router.get('/device_type', device_typeController.getDeviceTypeAll)
router.post('/:id/device_type', device_typeController.postDeviceTypeOne)

module.exports = router
