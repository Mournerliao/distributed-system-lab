const wsMap = require('../models/websocket');

const wsController = {
  listen: function (ws, req) {
    let msg = {
      type: 1,
      data: '已与node_server成功建立WebSocket连接！',
    }

    ws.send(JSON.stringify(msg));

    ws.on('message', function(msg) {
      msg = JSON.parse(msg);
      console.log(`receive: 已与${msg.data.name}成功建立WebSocket连接！`);

      if(msg.type === 1)
        wsMap.set(msg.data.name, ws);
    });
  },
}

module.exports = wsController;
