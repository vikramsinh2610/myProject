module.exports = class AdvanceOption {
  constructor({
    fromProductivePeriodYear,
    fromProductivePeriodMonth,
    advanceYears,
    advancePremium,
    yearly,
    yearlyPremium,
  }) {
    this.fromProductivePeriodYear = fromProductivePeriodYear;
    this.fromProductivePeriodMonth = fromProductivePeriodMonth;
    this.advanceYears = advanceYears;
    this.advancePremium = advancePremium;
    this.yearly = yearly;
    this.yearlyPremium = yearlyPremium;
  }
};
