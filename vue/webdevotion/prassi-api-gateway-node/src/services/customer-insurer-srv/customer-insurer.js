const { parse } = require('../../utils/productive-period-helper');

class CustomerInsurer {
  constructor({ _id = null, customerId, productivePeriodYear, productivePeriodMonth, networkNodeId, promoterId }) {
    this._id = _id || CustomerInsurer.buildId(customerId, productivePeriodYear, productivePeriodMonth);
    this.customerId = customerId;
    this.productivePeriodYear = productivePeriodYear;
    this.productivePeriodMonth = productivePeriodMonth;
    this.networkNodeId = networkNodeId;
    this.promoterId = promoterId;
  }

  static buildId(customerId, productivePeriodYear, productivePeriodMonth) {
    if (
      !Number.isInteger(Number.parseInt(productivePeriodYear, 10)) ||
      !Number.isInteger(Number.parseInt(productivePeriodMonth, 10))
    ) {
      throw new TypeError('not integer year / month');
    }
    return `${customerId}-${parse(productivePeriodYear, productivePeriodMonth)}`;
  }

  static buildIdOwner(customerId, productivePeriodYear, productivePeriodMonth, ownerId) {
    if (
      !Number.isInteger(Number.parseInt(productivePeriodYear, 10)) ||
      !Number.isInteger(Number.parseInt(productivePeriodMonth, 10))
    ) {
      throw new TypeError('not integer year / month');
    }
    return `${ownerId}-${customerId}-${parse(productivePeriodYear, productivePeriodMonth)}`;
  }
}

module.exports = CustomerInsurer;
