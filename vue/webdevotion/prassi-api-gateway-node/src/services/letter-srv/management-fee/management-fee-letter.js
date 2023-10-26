const Letter = require("../letter");
const { types } = require("../letter-types");

class ManagementFeeLetter extends Letter {
  constructor({
    _id,
    status,
    promoterId,
    promoterSerialNumber,
    promoterDisplayName,
    fromProductivePeriodYear,
    fromProductivePeriodMonth,
    toProductivePeriodYear,
    toProductivePeriodMonth,
    description = '',
    signatureDate = null,
    attachmentIds = [],
    thresholdAmount,
    paymentDelayMonths,
    didActiveDate = null,
    didCreateDate = null,
    didDeleteDate = null,
    didExpireDate = null,
    willExpireDate = null,
  }) {
    const type = types.MANAGEMENT_FEE;
    super({
      _id,
      status,
      promoterId,
      promoterSerialNumber,
      promoterDisplayName,
      type,
      description,
      signatureDate,
      attachmentIds,
      didActiveDate,
      didCreateDate,
      didDeleteDate,
      didExpireDate,
      willExpireDate,
    });
    this.fromProductivePeriodYear = fromProductivePeriodYear;
    this.fromProductivePeriodMonth = fromProductivePeriodMonth;
    this.toProductivePeriodYear = toProductivePeriodYear;
    this.toProductivePeriodMonth = toProductivePeriodMonth;
    this.thresholdAmount = thresholdAmount;
    this.paymentDelayMonths = paymentDelayMonths;
  }

  static getJSONSchema() {
    const basic = super.getJSONSchema();
    return {
      type: 'object',
      required: [...basic.required, 'thresholdAmount', 'paymentDelayMonths'],
      description: 'Bonus Letter',
      properties: {
        ...basic.properties,
        thresholdAmount: {
          type: 'integer',
        },
        paymentDelayMonths: {
          type: 'integer',
          minimum: 0,
          maximum: 3,
        },
        fromProductivePeriodYear: {
          type: 'integer',
          minimum: 2010,
          maximum: 2100,
        },
        fromProductivePeriodMonth: {
          type: 'integer',
          minimum: 1,
          maximum: 12,
        },
        toProductivePeriodYear: {
          type: 'integer',
          minimum: 2010,
          maximum: 2100,
        },
        toProductivePeriodMonth: {
          type: 'integer',
          minimum: 1,
          maximum: 12,
        },
      },
    };
  }
}

module.exports = ManagementFeeLetter;
