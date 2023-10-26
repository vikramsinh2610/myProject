const { v4: uuid } = require('uuid');
const { parse } = require('../../utils/productive-period-helper');

class ManagementFee {
  constructor({
    _id = uuid(),
    practiceId,
    dossierId,
    contractId,
    productId,
    productName,
    companyId,
    companyName,
    productivePeriodYear,
    productivePeriodMonth,
    productivePeriod = null,
    fund,
    amount,
    insurerId,
  }) {
    this._id = _id;
    this.practiceId = practiceId;
    this.dossierId = dossierId;
    this.contractId = contractId;
    this.productId = productId;
    this.productName = productName;
    this.companyId = companyId;
    this.companyName = companyName;
    this.productivePeriodYear = productivePeriodYear;
    this.productivePeriodMonth = productivePeriodMonth;
    this.productivePeriod = productivePeriod || parse(productivePeriodYear, productivePeriodMonth);
    this.fund = fund;
    this.amount = amount;
    this.insurerId = insurerId;
  }
}

module.exports = ManagementFee;
