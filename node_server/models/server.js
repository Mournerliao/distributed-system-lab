const Base = require('./base');

class Server extends Base {
  constructor(props = 'server'){
    super(props);
  }
}

module.exports = new Server();
