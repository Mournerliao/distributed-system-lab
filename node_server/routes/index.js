const express = require('express');
const router = express.Router();
const accountController = require('../Controllers/account');
const serverController = require('../Controllers/server');
const deviceController = require('../Controllers/device');
const deviceLogController = require('../Controllers/device_log');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/get_account', accountController.loginVerify);
router.post('/register', accountController.register);
router.get('/get_server_list', serverController.getServerList);
router.post('/get_device_list', deviceController.getDeviceList);
router.post('/change_device_status', deviceController.changeDeviceStatus);
router.post('/delete_device', deviceController.deleteDevice);
router.post('/delete_selected_devices', deviceController.deleteSelectedDevices);
router.post('/update_device', deviceController.updateDevice);
router.post('/add_device', deviceController.addDevice);
router.post('/get_device_log_list', deviceLogController.getDeviceLogList);

module.exports = router;
