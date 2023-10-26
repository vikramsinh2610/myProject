const Bonus = require('./bonus');
const Absorbability = require('./absorbability');

class GuaranteedVariableBonus extends Bonus {
  constructor({ amount, paymentTime, absorbability, variableBonus }) {
    super({
      amount,
      type: 'guaranteed',
      paymentTime,
    });
    /** @type{Absorbability} */
    this.absorbability = absorbability;
    this.variableBonus = variableBonus;
  }

  static getJSONSchema() {
    const bonusSchema = super.getJSONSchema();
    return {
      type: 'object',
      description: 'Guaranteed Variable Bonus',
      required: [...bonusSchema.required],
      properties: {
        ...bonusSchema.properties,
        type: {
          type: 'string',
          enum: ['guaranteed'],
        },
        absorbability: Absorbability.getJSONSchema(),
        variableBonus: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            properties: {
              adjustedPercentage: {
                type: 'integer',
                minimum: 0,
              },
              formula: {
                type: 'string',
              },
            },
          },
        },
      },
    };
  }
}

module.exports = GuaranteedVariableBonus;
