class PayoutPartition {
  constructor({ promoterId, amount, percentage, productionType }) {
    this.promoterId = promoterId;
    this.amount = amount;
    this.percentage = percentage;
    this.productionType = productionType;
  }
}

module.exports = PayoutPartition;
