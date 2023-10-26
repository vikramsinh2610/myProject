class BonusLetterAdditionalData {
  constructor({ letterId, targetAmount, absorbability, targetPercentage, expireDate, accruedAmount, kpi = [] }) {
    this.letterId = letterId;
    this.targetAmount = targetAmount;
    this.absorbability = absorbability;
    this.targetPercentage = targetPercentage;
    this.accruedAmount = accruedAmount;
    this.expireDate = expireDate;
    this.kpi = kpi;
  }
}

module.exports = BonusLetterAdditionalData;
