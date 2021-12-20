const Server = require('../models/server');

const serverController = {
  // showUser 获取用户数据并返回到页面
  getServerList: async function (req, res, next) {
    try {
      let data = await Server.selectAllColumns('status', 1);

      res.json({
        code: 200,
        message: "获取服务器列表成功",
        data,
      })
    } catch (e) {
      res.json({code: 0, message: "操作失败", data: e})
    }
  },
}

module.exports = serverController;
