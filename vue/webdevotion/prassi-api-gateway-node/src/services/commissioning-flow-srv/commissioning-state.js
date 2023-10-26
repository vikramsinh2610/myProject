// eslint-disable-next-line max-classes-per-file
const productivePeriodHelper = require("../../utils/productive-period-helper");
const PracticeCommissionReference = require('./practice-installment-reference');

class Result {
  constructor({ promoterId, totalAmount = 0, details = {}, roleId }) {
    this.promoterId = promoterId;
    this.details = details;
    this.totalAmount = totalAmount;
    this.roleId = roleId;
  }
}

class CommissioningState {
  constructor({
    productivePeriodYear,
    productivePeriodMonth,
    status = '',
    installments = [],
    didOpenedDate = null,
    didProcessDate = null,
    didConfirmedDate = null,
    didClosedDate = null,
    entryFeeIds = [],
    income = 0,
    outcome = 0,
    margin = 0,
    results = [],
  }) {
    this.productivePeriodYear = productivePeriodYear;
    this.productivePeriodMonth = productivePeriodMonth;
    this.status = status;
    /** @type {Array<PracticeCommissionReference>} */
    this.installments = installments;
    this.entryFeeIds = entryFeeIds;
    this.didOpenedDate = didOpenedDate;
    this.didProcessDate = didProcessDate;
    this.didConfirmedDate = didConfirmedDate;
    this.didClosedDate = didClosedDate;
    this.income = income;
    this.outcome = outcome;
    this.margin = margin;
    /** @type {Array<Result>} */
    this.results = results.map((r) => new Result(r));
    this._id = CommissioningState.buildId(productivePeriodYear, productivePeriodMonth);
  }

  static buildId(productivePeriodYear, productivePeriodMonth) {
    return `${productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth)}`;
  }
}

module.exports = CommissioningState;
