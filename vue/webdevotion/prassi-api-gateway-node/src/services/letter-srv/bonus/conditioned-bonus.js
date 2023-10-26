const Bonus = require('./bonus');
const Condition = require('./condition');

class ConditionedBonus extends Bonus {
  constructor({ amount, paymentTime, conditions, maxRecoveryPercentage = 10000, productivePeriodPaymentDelay = 0 }) {
    super({
      amount,
      type: 'conditioned',
      paymentTime,
    });
    /** @type{Array<Condition>} */
    this.conditions = conditions;
    this.maxRecoveryPercentage = maxRecoveryPercentage;
    this.productivePeriodPaymentDelay = productivePeriodPaymentDelay;
  }

  static getJSONSchema() {
    const bonusSchema = super.getJSONSchema();
    return {
      type: 'object',
      description: 'Conditioned Bonus',
      required: [...bonusSchema.required, 'conditions'],
      properties: {
        ...bonusSchema.properties,
        type: {
          type: 'string',
          enum: ['conditioned'],
        },
        conditions: {
          type: 'array',
          items: Condition.getJSONSchema(),
        },
        maxRecoveryPercentage: {
          type: 'integer',
          minimum: 0,
          maximum: 10000,
        },
        productivePeriodPaymentDelay: {
          type: 'integer',
          minimum: 0,
          maximum: 3,
        },
      },
    };
  }
}

module.exports = ConditionedBonus;
