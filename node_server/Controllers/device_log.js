const Device_log = require('../models/device_log');
const moment = require('moment');

const deviceLogController = {
  getDeviceLogList: async function (req, res, next) {
    try {
      let params = req.body;
      let selectParams = [
        'device_log.id',
        'device_id',
        'device.name',
        'device_log.time',
        'device_log.status'
      ];
      let data = await Device_log.selectJoinTables('device', 'device_id', 'id',
        selectParams, 'device_log.server_id', params.id);

      data = data.map(item => ({...item, time: moment(item.time).format('YYYY-MM-DD HH:mm:ss')}));

      res.json({
        code: 200,
        message: "获取设备日志列表成功",
        data,
      })
    } catch (e) {
      res.json({code: 0, message: "操作失败", data: e})
    }
  },
}

module.exports = deviceLogController;