const Account = require('../models/account');
const moment = require('moment');

const accountController = {
  loginVerify: async function (req, res, next) {
    try {
      let params = req.body;
      let data = await Account.selectSomeColumns('password', 'username', params.username);
      let password = data[0].password;

      if (password === params.password) {
        res.json({
          code: 200,
          message: "登录成功",
          data: true,
        })
      } else {
        res.json({
          code: 200,
          message: "登录失败",
          data: false,
        })
      }
    } catch (e) {
      res.json({code: 0, message: "操作失败", data: e})
    }
  },
  register: async function (req, res, next) {
    try {
      let params = req.body;
      let row = {
        username: params.username,
        password: params.password,
        register_time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      }

      await Account.insert(row);

      res.json({
        code: 200,
        message: "注册成功",
        data: true,
      })
    } catch (e) {
      res.json({code: 0, message: "操作失败", data: e})
    }
  },
}

module.exports = accountController;
