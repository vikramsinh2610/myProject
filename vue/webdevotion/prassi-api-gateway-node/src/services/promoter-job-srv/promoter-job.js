const { parse } = require("../../utils/productive-period-helper");

class PromoterJob {
  constructor({ _id = null, promoterId, fromProductivePeriodYear, fromProductivePeriodMonth, roleId }) {
    this._id = _id || `${promoterId}-${parse(fromProductivePeriodYear, fromProductivePeriodMonth)}`;
    this.promoterId = promoterId;
    this.roleId = roleId;
    this.fromProductivePeriodYear = fromProductivePeriodYear;
    this.fromProductivePeriodMonth = fromProductivePeriodMonth;
  }
}

module.exports = PromoterJob;
