// eslint-disable-next-line no-unused-vars
const Absorbability = require('./absorbability');

class ComputedBonus {
  constructor({
    absorbability,
    targetAmount,
    type,
    targetPercentage,
    expireDate,
    accruedAmount,
    targetComplete,
    kpi = [],
    invoiceDescription = null,
  }) {
    /** @type{Absorbability} */
    this.absorbability = absorbability;
    this.accruedAmount = accruedAmount;
    this.targetAmount = targetAmount;
    this.targetComplete = targetComplete;
    this.type = type;
    this.targetPercentage = targetPercentage;
    this.expireDate = expireDate;
    this.kpi = kpi;
    this.invoiceDescription = invoiceDescription;
  }
}

module.exports = ComputedBonus;
