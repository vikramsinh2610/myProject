const Letter = require("../letter");
const BonusPas = require('./bonus-pas');
const { types } = require("../letter-types");

class BonusPasLetter extends Letter {
  constructor({
    _id,
    status,
    promoterId,
    promoterSerialNumber,
    promoterDisplayName,
    bonusPas,
    fromProductivePeriodYear,
    fromProductivePeriodMonth,
    toProductivePeriodYear,
    toProductivePeriodMonth,
    description = '',
    attachmentIds = [],
    signatureDate = null,
    didActiveDate = null,
    didCreateDate = null,
    didDeleteDate = null,
    didExpireDate = null,
    willExpireDate = null,
    invoiceDescription = null,
  }) {
    const type = types.BONUS_PAS;
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
    this.bonusPas = new BonusPas(bonusPas);
    this.invoiceDescription = invoiceDescription;
  }

  static getJSONSchema() {
    const basic = super.getJSONSchema();
    return {
      type: 'object',
      required: [...basic.required, 'commissioning'],
      description: 'Commissioning Letter',
      properties: {
        ...basic.properties,
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
        invoiceDescription: {
          type: 'string',
        },
        bonusPas: BonusPas.getJSONSchema(),
      },
    };
  }
}

module.exports = BonusPasLetter;
