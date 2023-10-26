const Letter = require("../letter");
const ConditionedBonus = require('./conditioned-bonus');
const GuaranteedBonus = require('./guaranteed-bonus');
const GuaranteedVariableBonus = require('./guaranteed-variable-bonus');
const { paymentFrequencyEnum } = require('./payment-frequency-enum');
const { types } = require("../letter-types");

class BonusLetter extends Letter {
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
    type = types.NONE,
    paymentFrequency,
    description = '',
    signatureDate = null,
    attachmentIds = [],
    guaranteedBonuses = [],
    guaranteedVariableBonuses = [],
    conditionedBonuses = [],
    cumulateConditionedBonuses = true,
    didActiveDate = null,
    didCreateDate = null,
    didDeleteDate = null,
    didExpireDate = null,
    willExpireDate = null,
    invoiceDescription = null,
  }) {
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
    this.paymentFrequency = paymentFrequency;
    /** @type{Array<GuaranteedBonus>} */
    this.guaranteedBonuses = guaranteedBonuses;
    /** @type{Array<ConditionedBonus>} */
    this.conditionedBonuses = conditionedBonuses;
    /** @type{Array<GuaranteedVariableBonus>} */
    this.guaranteedVariableBonuses = guaranteedVariableBonuses;
    this.cumulateConditionedBonuses = cumulateConditionedBonuses;
    this.fromProductivePeriodYear = fromProductivePeriodYear;
    this.fromProductivePeriodMonth = fromProductivePeriodMonth;
    this.toProductivePeriodYear = toProductivePeriodYear;
    this.toProductivePeriodMonth = toProductivePeriodMonth;
    this.invoiceDescription = invoiceDescription;
  }

  static getJSONSchema() {
    const basic = super.getJSONSchema();
    return {
      type: 'object',
      required: [...basic.required, 'guaranteedBonuses', 'conditionedBonuses', 'paymentFrequency'],
      description: 'Bonus Letter',
      properties: {
        ...basic.properties,
        guaranteedBonuses: {
          type: 'array',
          items: GuaranteedBonus.getJSONSchema(),
        },
        cumulateConditionedBonuses: {
          default: false,
          type: 'boolean',
        },
        conditionedBonuses: {
          type: 'array',
          items: ConditionedBonus.getJSONSchema(),
        },
        guaranteedVariableBonuses: {
          type: 'array',
          items: GuaranteedVariableBonus.getJSONSchema(),
        },
        paymentFrequency: {
          type: 'string',
          enum: Object.values(paymentFrequencyEnum),
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
        invoiceDescription: {
          type: 'string',
        },
      },
    };
  }
}

module.exports = BonusLetter;
