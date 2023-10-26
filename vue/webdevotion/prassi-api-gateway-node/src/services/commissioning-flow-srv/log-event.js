const { v4: uuid } = require('uuid');

class LogEvent {
  constructor({
    _id = uuid(),
    description,
    idCommissioning = '',
    idInvoicing = '',
    createDate = new Date(Date.now()),
  }) {
    this._id = _id;
    this.description = description;
    this.idCommissioning = idCommissioning;
    this.idInvoicing = idInvoicing;
    this.createDate = createDate;
  }
}

module.exports = LogEvent;
