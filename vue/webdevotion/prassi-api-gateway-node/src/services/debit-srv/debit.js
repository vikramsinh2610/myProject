const { v4: uuid } = require('uuid');

class Debit {
  constructor({
    _id = uuid(),
    createDate = new Date(Date.now()),
    promoterId,
    debitAmount,
    origin,
    settledAmount = 0,
    settled = false,
    maxRecoveryPercentage = 10000,
  }) {
    this._id = _id;
    this.createDate = createDate;
    this.promoterId = promoterId;
    this.debitAmount = debitAmount;
    this.settledAmount = settledAmount;
    this.settled = settled;
    this.origin = origin;
    this.maxRecoveryPercentage = maxRecoveryPercentage;
  }
}

module.exports = Debit;
