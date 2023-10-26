class CommissionAdditionalData {
  constructor({ productionType, commissionType, totalIV = 0, installments = [] }) {
    this.productionType = productionType;
    this.commissionType = commissionType;
    this.totalIV = totalIV;
    this.installments = installments;
  }
}

module.exports = CommissionAdditionalData;
