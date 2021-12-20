const configs = {
  mysql: {
    host: '112.124.39.72',
    port: '3306',
    user: 'root',
    password: 'Xcm1115Ljy0625',  // 自己设置的密码
    database: 'distributed_system_lab' // 数据库的名字
  },
  // 打印错误
  log: {
    error (message) {
      console.log('[knex error]', message)
    }
  }
}

module.exports = configs
