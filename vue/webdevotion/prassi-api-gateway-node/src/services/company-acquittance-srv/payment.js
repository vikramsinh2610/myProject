const { v4: uuid } = require('uuid');
const { types } = require('./payment-types');

class Payment {
  constructor({
    _id = '',
    type,
    practiceId = '',
    contractId,
    premiumNet,
    premiumGross,
    installment,
    payin,
    oldPayin = -1,
    installmentDate,
    productivePeriodYear,
    productivePeriodMonth,
    ok = false,
    calculatedPayin = -1,
    oldCalculatedPayin = -1,
    status = 'non elaborata',
    manuallyModified = false,
    notFoundBase = false,
    notFoundPractice = false,
    alreadyConfirmed = false,
    alreadyPaid = false,
    errorPayin = false,
    incomePracticeId = null,
    select = null,
  }) {
    this._id = _id || uuid();
    this.type = type;
    this.practiceId = practiceId;
    this.contractId = contractId;
    this.premiumNet = premiumNet;
    this.premiumGross = premiumGross;
    this.installment = installment;
    this.payin = payin;
    this.oldPayin = oldPayin;
    this.installmentDate = installmentDate;
    this.productivePeriodYear = productivePeriodYear;
    this.productivePeriodMonth = productivePeriodMonth;
    this.ok = ok;
    this.oldCalculatedPayin = oldCalculatedPayin;
    this.calculatedPayin = calculatedPayin;
    this.status = status;
    this.manuallyModified = manuallyModified;
    this.notFoundBase = notFoundBase;
    this.notFoundPractice = notFoundPractice;
    this.alreadyConfirmed = alreadyConfirmed;
    this.alreadyPaid = alreadyPaid;
    this.errorPayin = errorPayin;
    this.incomePracticeId = incomePracticeId;
    this.select = select;
  }

  static getJSONSchema() {
    return {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          description: 'ID of payment',
        },
        type: {
          type: 'string',
          enum: Object.values(types),
          description: 'Type of payment',
        },
        practiceId: {
          type: 'string',
          description: 'ID of practice',
        },
        contractId: {
          type: 'string',
          description: 'ID of contract',
        },
        premiumNet: {
          type: 'integer',
          description: 'Practice net premium',
        },
        premiumGross: {
          type: 'integer',
          description: 'Practice gross premium',
        },
        installment: {
          type: 'integer',
          description: 'Installment number',
        },
        payin: {
          type: 'integer',
          description: 'Payment payin',
        },
        oldPayin: {
          type: 'integer',
          description: 'Payment payin',
        },
        installmentDate: {
          type: 'string',
          description: 'Date of payment',
        },
        productivePeriodYear: {
          type: 'integer',
          description: 'Productive period year of installment',
        },
        productivePeriodMonth: {
          type: 'integer',
          description: 'Productive period month of installment',
        },
        ok: {
          type: 'boolean',
          description: 'Is payment ok?',
        },
        calculatedPayin: {
          type: 'integer',
          description: 'Calculated payin of installment',
        },
        oldCalculatedPayin: {
          type: 'integer',
          description: 'Calculated payin of installment',
        },
        status: {
          type: 'string',
          description: 'Status description',
        },
        manuallyModified: {
          type: 'boolean',
          description: 'Is payment ok?',
        },
        notFoundBase: {
          type: 'boolean',
          description: 'Is payment ok?',
        },
        notFoundPractice: {
          type: 'boolean',
          description: 'Is payment ok?',
        },
        alreadyConfirmed: {
          type: 'boolean',
          description: 'Is payment ok?',
        },
        alreadyPaid: {
          type: 'boolean',
          description: 'Is payment ok?',
        },
        errorPayin: {
          type: 'boolean',
          description: 'Is payment ok?',
        },
        incomePracticeId: {
          type: 'string',
          description: 'Linked income practice id',
        },
        select: {
          type: 'string',
        },
      },
    };
  }
}

module.exports = Payment;
