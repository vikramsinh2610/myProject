const { parse } = require("../../utils/productive-period-helper");

class DossierInsurer {
  constructor({ _id = null, dossierId, productivePeriodYear, productivePeriodMonth, networkNodeId, promoterId }) {
    this._id = _id || DossierInsurer.buildId(dossierId, productivePeriodYear, productivePeriodMonth);
    this.dossierId = dossierId;
    this.productivePeriodYear = productivePeriodYear;
    this.productivePeriodMonth = productivePeriodMonth;
    this.networkNodeId = networkNodeId;
    this.promoterId = promoterId;
  }

  static buildId(dossierId, productivePeriodYear, productivePeriodMonth) {
    if (
      !Number.isInteger(Number.parseInt(productivePeriodYear, 10)) ||
      !Number.isInteger(Number.parseInt(productivePeriodMonth, 10))
    ) {
      throw new TypeError('not integer year / month');
    }
    return `${dossierId}-${parse(productivePeriodYear, productivePeriodMonth)}`;
  }
}

module.exports = DossierInsurer;
