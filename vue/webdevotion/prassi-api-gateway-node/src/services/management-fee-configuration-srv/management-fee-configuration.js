const { parse } = require('../../utils/productive-period-helper');

class ManagementFeeConfiguration {
  constructor({
    _id = '',
    roleId,
    fromProductivePeriodYear,
    fromProductivePeriodMonth,
    fromProductivePeriod = 0,
    percentage,
  }) {
    this._id = _id || `${roleId}-${parse(fromProductivePeriodYear, fromProductivePeriodMonth)}`;
    this.roleId = roleId;
    this.fromProductivePeriodYear = fromProductivePeriodYear;
    this.fromProductivePeriodMonth = fromProductivePeriodMonth;
    this.fromProductivePeriod = fromProductivePeriod || parse(fromProductivePeriodYear, fromProductivePeriodMonth);
    this.percentage = percentage;
  }
}

module.exports = ManagementFeeConfiguration;
