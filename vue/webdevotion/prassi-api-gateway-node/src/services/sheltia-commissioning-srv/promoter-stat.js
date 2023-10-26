const { parse } = require('../../utils/productive-period-helper');

class PromoterStat {
  constructor({
    _id = null,
    promoterId,
    productivePeriodYear,
    productivePeriodMonth,
    totalIv,
    totalIvDirect,
    totalIvIndirect,
    totalAmount,
    totalAmountDirect,
    totalAmountIndirect,
    percentage,
  }) {
    this._id = _id || `${promoterId}-${parse(productivePeriodYear, productivePeriodMonth)}`;
    this.promoterId = promoterId;
    this.productivePeriodYear = productivePeriodYear;
    this.productivePeriodMonth = productivePeriodMonth;
    this.totalIv = totalIv;
    this.totalIvDirect = totalIvDirect;
    this.totalIvIndirect = totalIvIndirect;
    this.totalAmount = totalAmount;
    this.totalAmountDirect = totalAmountDirect;
    this.totalAmountIndirect = totalAmountIndirect;
    this.percentage = percentage;
  }
}

module.exports = PromoterStat;
