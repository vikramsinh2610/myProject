const { parse } = require('../../utils/productive-period-helper');

class SheltiaPromoterTarget {
  constructor({
    _id = null,
    promoterId,
    targetIv,
    productivePeriodYear,
    productivePeriodMonth,
    productivePeriod = 0,
  }) {
    this._id = _id || `${promoterId}-${parse(productivePeriodYear, productivePeriodMonth)}`;
    this.promoterId = promoterId;
    this.productivePeriod = productivePeriod || parse(productivePeriodYear, productivePeriodMonth);
    this.targetIv = targetIv;
    this.productivePeriodYear = productivePeriodYear;
    this.productivePeriodMonth = productivePeriodMonth;
  }
}

module.exports = SheltiaPromoterTarget;
