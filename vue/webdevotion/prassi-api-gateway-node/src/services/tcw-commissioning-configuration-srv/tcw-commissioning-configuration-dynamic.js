const { v4: uuid } = require('uuid');

class TcwCommissioningConfigurationDynamic {
  constructor({
    _id = uuid(),
    config,
  }) {
    this._id = _id;
    this.config = config;
  }
}

module.exports = TcwCommissioningConfigurationDynamic;
