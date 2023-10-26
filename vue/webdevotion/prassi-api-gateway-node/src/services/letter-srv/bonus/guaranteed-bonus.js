const Bonus = require('./bonus');
const Absorbability = require('./absorbability');

class GuaranteedBonus extends Bonus {
  constructor({ amount, paymentTime, absorbability }) {
    super({
      amount,
      type: 'guaranteed',
      paymentTime,
    });
    /** @type{Absorbability} */
    this.absorbability = absorbability;
  }

  static getJSONSchema() {
    const bonusSchema = super.getJSONSchema();
    return {
      type: 'object',
      description: 'Guaranteed Bonus',
      required: [...bonusSchema.required, 'absorbability'],
      properties: {
        ...bonusSchema.properties,
        type: {
          type: 'string',
          enum: ['guaranteed'],
        },
        absorbability: Absorbability.getJSONSchema(),
      },
    };
  }
}

module.exports = GuaranteedBonus;
