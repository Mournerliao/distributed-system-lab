const selfInfo = {
  type: 1,
  data: {
    name: '',
    ip_address: null,
  }
}

const heartbeat = {
  type: 2,
  data: {
    name: '',
    heartbeat: true,
  }
}

const device_increment = {
  type: 3,
  data: {
    name: '',
    device_increment: null,
  }
}

const device_decrement = {
  type: 4,
  data: {
    name: '',
    device_decrement: null,
  }
}

const device_update = {
  type: 5,
  data: {
    name: '',
    device_update: true,
  }
}

module.exports = {selfInfo, heartbeat, device_increment, device_decrement, device_update};