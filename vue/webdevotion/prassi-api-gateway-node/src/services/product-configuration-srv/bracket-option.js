module.exports = class BracketOption {
  constructor({
    fromProductivePeriodYear,
    fromProductivePeriodMonth,
    amount,
    amountPremium,
    duration,
    yearly,
    advanceYears,
  }) {
    this.fromProductivePeriodYear = fromProductivePeriodYear;
    this.fromProductivePeriodMonth = fromProductivePeriodMonth;
    this.amount = amount;
    this.amountPremium = amountPremium;
    this.duration = duration;
    this.advanceYears = advanceYears;
    this.yearly = yearly;
  }
};
