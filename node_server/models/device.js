const Base = require('./base');

class Device extends Base {
  constructor(props = 'device'){
    super(props);
  }
}

module.exports = new Device();
