const Device = require('../models/device');
const Device_log = require('../models/device_log');
const wsMap = require('../models/websocket');
const moment = require('moment');
const { nanoid } = require('nanoid');

const deviceController = {
  getDeviceList: async function (req, res, next) {
    try {
      let params = req.body;
      let data = await Device.selectAllColumns('server_id', params.id);

      data = data.map(item => ({...item, register_time: moment(item.register_time).format('YYYY-MM-DD HH:mm:ss')}));

      res.json({
        code: 200,
        message: "获取设备列表成功",
        data,
      })
    } catch (e) {
      res.json({code: 0, message: "操作失败", data: e})
    }
  },
  changeDeviceStatus: async function (req, res, next) {
    try {
      let params = req.body;
      let ws = wsMap.get(params.server_name);
      let msg = {
        type: 4,
        data: true,
      }

      if (params.status === 'online')
        await Device.update(params.id, {status: 0});
      else
        await Device.update(params.id, {status: 1});

      await recordLog(params.id, params.server_id, 3);

      res.json({
        code: 200,
        message: "设备状态切换成功",
        data: true,
      })

      ws.send(JSON.stringify(msg));
    } catch (e) {
      res.json({code: 0, message: "操作失败", data: e})
    }
  },
  updateDevice: async function (req, res, next) {
    try {
      let params = req.body;
      let ws = wsMap.get(params.server_name);
      let msg = {
        type: 4,
        data: true,
      }

      await Device.update(params.id, {name: params.name, register_time: params.register_time});
      await recordLog(params.id, params.server_id, 3);

      res.json({
        code: 200,
        message: "设备信息更新成功",
        data: true,
      })

      ws.send(JSON.stringify(msg));
    } catch (e) {
      res.json({code: 0, message: "操作失败", data: e})
    }
  },
  deleteDevice: async function (req, res, next) {
    try {
      let params = req.body;
      let ws = wsMap.get(params.server_name);
      let msg = {
        type: 3,
        data: 1,
      }

      await Device.delete(params.id);
      await recordLog(params.id, params.server_id, 2);

      res.json({
        code: 200,
        message: "删除设备成功",
        data: true,
      })

      ws.send(JSON.stringify(msg));
    } catch (e) {
      res.json({code: 0, message: "操作失败", data: e})
    }
  },
  deleteSelectedDevices: async function (req, res, next) {
    try {
      const params = req.body;
      const devices = JSON.parse(params.devices);
      let ws = wsMap.get(params.server_name);
      let msg = {
        type: 4,
        data: devices.length,
      }

      for (let id of devices) {
        await Device.delete(id);
        await recordLog(id, params.server_id, 2);
      }

      res.json({
        code: 200,
        message: "删除所选设备成功",
        data: true,
      })

      ws.send(JSON.stringify(msg));
    } catch (e) {
      res.json({code: 0, message: "操作失败", data: e})
    }
  },
  addDevice: async function (req, res, next) {
    try {
      let params = req.body;
      let ws = wsMap.get(params.server_name);
      let msg = {
        type: 2,
        data: 1,
      }
      let id = nanoid(10);
      let row = {
        id,
        server_id: params.server_id,
        name: params.name,
        status: 0,
        register_time: params.register_time,
      }

      await Device.insert(row);
      await recordLog(params.id, params.server_id, 1);

      res.json({
        code: 200,
        message: "添加设备成功",
        data: true,
      })

      ws.send(JSON.stringify(msg));
    } catch (e) {
      res.json({code: 0, message: "操作失败", data: e})
    }
  },
}

const recordLog = async (device_id, server_id, status) => {
  let time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  let row = {
    device_id,
    server_id,
    time,
    status,
  }

  await Device_log.insert(row);
}

module.exports = deviceController;
