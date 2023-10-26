module.exports = class Option {
  constructor({ _id, fromYear, toYear, fromPremiumAmount, toPremiumAmount, fixedAmount, percentage, retrocessionFee }) {
    this._id = _id;
    this.fromYear = fromYear;
    this.toYear = toYear;
    this.fromPremiumAmount = fromPremiumAmount;
    this.toPremiumAmount = toPremiumAmount;
    this.fixedAmount = fixedAmount;
    this.percentage = percentage;
    this.retrocessionFee = retrocessionFee;
  }
};
