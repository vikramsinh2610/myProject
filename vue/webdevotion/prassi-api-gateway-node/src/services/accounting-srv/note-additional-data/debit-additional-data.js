class DebitAdditionalData {
  constructor({ letterId, accruedAmount, supplyPercentage = 10000, supplyPart = 1, supplyParentId = null }) {
    this.letterId = letterId;
    this.accruedAmount = accruedAmount;
    this.supplyPercentage = supplyPercentage;
    this.supplyPart = supplyPart;
    this.supplyParentId = supplyParentId;
  }
}

module.exports = DebitAdditionalData;
