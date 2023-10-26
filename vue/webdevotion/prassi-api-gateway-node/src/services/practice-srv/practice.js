class Practice {
  constructor({
    dossierId,
    practiceId,
    contractId,
    type,
    productId,
    productName,
    companyId,
    companyName,
    insuredName,
    effectDate,
    approvalDate,
    lastModifiedDate,
    createdDate,
    termDate,
    status,
    statusName,
    adequacy,
    praticeType,
    postForce,
    emitDate = new Date(),
    effectProductivePeriodYear,
    effectProductivePeriodMonth,
    termProductivePeriodYear,
    termProductivePeriodMonth,
    premiumNet,
    premiumGross,
    optionId,
    installmentsPerYear,
    insurerId = null,
    commissionSacrifice = 0,
    iv = 0,
    _id = '',
    legacyViewId = '',
    customerId,
    unique = false,
    paymentMode,
    iban,
    loading,
    recurringPremium,
    uniquePremium,
    amountPaid,
    years,
    isPayable,
    isReadonly = false,
    isSendable = false,
    customer,
  }) {
    this.dossierId = dossierId;
    this.practiceId = practiceId;
    this.contractId = contractId;
    this.type = type;
    this.productId = productId;
    this.productName = productName;
    this.companyId = companyId;
    this.companyName = companyName;
    this.insuredName = insuredName;
    this.effectDate = effectDate;
    this.approvalDate = approvalDate;
    this.lastModifiedDate = lastModifiedDate;
    this.createdDate = createdDate;
    this.effectProductivePeriodYear = effectProductivePeriodYear;
    this.effectProductivePeriodMonth = effectProductivePeriodMonth;
    this.termProductivePeriodYear = termProductivePeriodYear;
    this.termProductivePeriodMonth = termProductivePeriodMonth;
    this.termDate = termDate;
    this.adequacy = adequacy;
    this.praticeType = praticeType;
    this.postForce = postForce;
    this.status = status;
    this.statusName = statusName;
    this.emitDate = emitDate;
    this.insurerId = insurerId;
    this.premiumNet = premiumNet;
    this.premiumGross = premiumGross;
    this.optionId = optionId;
    this.installmentsPerYear = installmentsPerYear;
    this.commissionSacrifice = commissionSacrifice;
    this.iv = iv;
    this._id = _id;
    this.legacyViewId = legacyViewId;
    this.customerId = customerId;
    this.unique = unique;
    this.paymentMode = paymentMode;
    this.iban = iban;
    this.loading = loading;
    this.recurringPremium = recurringPremium;
    this.uniquePremium = uniquePremium;
    this.amountPaid = amountPaid;
    this.years = years;
    this.isPayable = isPayable;
    this.isReadonly = isReadonly;
    this.isSendable = isSendable;
    this.customer = customer;
  }
}

module.exports = Practice;
