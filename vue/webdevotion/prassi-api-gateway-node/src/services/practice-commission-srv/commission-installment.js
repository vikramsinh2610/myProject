const productivePeriodHelper = require('../../utils/productive-period-helper');

class PracticeFee {
  constructor({
    dossierId,
    practiceType,
    practiceBaseType = null,
    practiceId,
    contractId,
    productId,
    productName,
    companyId,
    companyName,
    customerId = null,
    insuredName = null,
    effectDate,
    termDate,
    insurerId,
    premiumNet,
    premiumGross,
    optionId,
    createDate,
    installment,
    payin,
    margin,
    payout,
    advance,
    forecast,
    paidToNetwork,
    dueDate,
    commissionType,
    installmentsPerYear,
    productivePeriodYear,
    productivePeriodMonth,
    // Disable ESLint to allow extra property
    productivePeriod = 0, // eslint-disable-line no-unused-vars
    commissioningProductivePeriodYear,
    commissioningProductivePeriodMonth,
    // Disable ESLint to allow extra property
    commissioningProductivePeriod = 0, // eslint-disable-line no-unused-vars
    confirmed = false,
    paymentDate = null,
    reminder = 0,
    _id = null,
    iv = 0,
    legacyPraticaIncassoId = null,
    commissioningId = null,
    postForce = null,
  }) {
    this.dossierId = dossierId;
    this.practiceType = practiceType;
    this.practiceBaseType = practiceBaseType === null ? practiceType : practiceBaseType;
    this.practiceId = practiceId;
    this.contractId = contractId;
    this.productId = productId;
    this.productName = productName;
    this.companyId = companyId;
    this.companyName = companyName;
    this.customerId = customerId;
    this.insuredName = insuredName;
    this.effectDate = effectDate;
    this.termDate = termDate;
    this.insurerId = insurerId;
    this.premiumNet = premiumNet;
    this.premiumGross = premiumGross;
    this.optionId = optionId;
    this.createDate = createDate;
    this.installment = installment;
    this.productivePeriodYear = productivePeriodYear;
    this.productivePeriodMonth = productivePeriodMonth;
    this.commissioningProductivePeriodYear = commissioningProductivePeriodYear;
    this.commissioningProductivePeriodMonth = commissioningProductivePeriodMonth;
    this.payin = payin;
    this.margin = margin;
    this.payout = payout;
    this.advance = advance;
    this.forecast = forecast;
    this.paidToNetwork = paidToNetwork;
    this.reminder = reminder;
    this.dueDate = dueDate;
    this.confirmed = confirmed;
    this.paymentDate = paymentDate;
    this.commissionType = commissionType;
    this.installmentsPerYear = installmentsPerYear;
    this._id = _id || `${practiceId}-${installment}`;
    this.iv = iv;
    this.legacyPraticaIncassoId = legacyPraticaIncassoId;
    this.commissioningId = commissioningId;
    this.postForce = postForce;

    this.productivePeriod = productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth);
    this.commissioningProductivePeriod = productivePeriodHelper.parse(
      commissioningProductivePeriodYear,
      commissioningProductivePeriodMonth,
    );
  }
}

module.exports = PracticeFee;
