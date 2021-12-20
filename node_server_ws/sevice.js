const os = require('os');
const WebSocket = require('ws');
const {
  selfInfo,
  heartbeat,
  device_increment,
  device_decrement,
  device_update,
} = require('./ws_message');
const {REGISTER_URL, NODE_SERVER_URL} = require('./config');

let serverName = '';
let registerWsStatus = 0;

const serverOnline = name => {
  const registerWs = new WebSocket(`${REGISTER_URL}${name}`);
  const nodeServerWs = new WebSocket(NODE_SERVER_URL);

  serverName = name;

  establishConnection(registerWs, nodeServerWs);
  listenRegister(registerWs);
  listenNodeServer(registerWs, nodeServerWs);
  sendHeartBeatToRegister(registerWs);
}

const establishConnection = (registerWs, nodeServerWs) => {
  selfInfo.data.name = serverName;
  selfInfo.data.ip_address = getIpAddress();

  registerWs.on('open', function open() {
    registerWsStatus = 1;
    registerWs.send(JSON.stringify(selfInfo));
  });

  nodeServerWs.on('open', function open() {
    nodeServerWs.send(JSON.stringify(selfInfo));
  });
}

const listenRegister = (registerWs, nodeServerWs) => {
  registerWs.on('close', function close() {
    registerWsStatus = 0;
    nodeServerWs.close();
    console.log('error: 与register之间的连接已断开！');
    console.log('error: 与node_server之间的连接已断开！');
  })

  registerWs.on('message', function message(msg) {
    console.log(`receive: ${msg}`);
  });
}

const listenNodeServer = (registerWs, nodeServerWs) => {
  nodeServerWs.on('close', function close() {
    console.log('error: 与node_server之间的连接已断开！');
  })

  nodeServerWs.on('message', function message(msg) {
    msg = JSON.parse(msg);

    if(msg.type === 1) {
      console.log(`receive: ${msg.data}`);
    }
    if(msg.type === 2) {
      device_increment.data.name = serverName;
      device_increment.data.device_increment = msg.data;

      console.log(`receive: 设备增加${msg.data}台！`);
      registerWs.send(JSON.stringify(device_increment));
      console.log(`send: 向register发送设备增加信息 ...`);
    }
    if(msg.type === 3) {
      device_decrement.data.name = serverName;
      device_decrement.data.device_decrement = msg.data;

      console.log(`receive: 设备减少${msg.data}台！`);
      registerWs.send(JSON.stringify(device_decrement));
      console.log(`send: 向register发送设备减少信息 ...`);
    }
    if(msg.type === 4) {
      device_update.data.name = serverName;
      console.log(`receive: 设备状态更新`);
      registerWs.send(JSON.stringify(device_update));
      console.log(`send: 向register发送设备状态更新信息 ...`);
    }
  });
}

const sendHeartBeatToRegister = ws => {
  heartbeat.data.name = serverName;

  if(registerWsStatus) {
    // 发送心跳
    setInterval(() => {
      ws.send(JSON.stringify(heartbeat));
      console.log('send: 向register发送heartbeat ...');
    }, 60000);
  }
}

const getIpAddress = () => {
  const interfaces = os.networkInterfaces();

  for (const devName in interfaces) {
    const iface = interfaces[devName];

    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];

      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}

module.exports = serverOnline;