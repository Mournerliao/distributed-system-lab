const Base = require('./base');

class Account extends Base {
  constructor(props = 'account'){
    super(props);
  }
}

module.exports = new Account();
