const { paymentTimeEnum } = require('./payment-time-enum');

class Bonus {
  constructor({ amount, type, paymentTime }) {
    this.amount = amount;
    this.type = type;
    this.paymentTime = paymentTime;
  }

  static getJSONSchema() {
    return {
      type: 'object',
      description: 'Bonus',
      required: ['amount', 'type', 'paymentTime'],
      properties: {
        amount: {
          type: 'integer',
        },
        type: {
          type: 'string',
          enum: ['guaranteed', 'conditioned'],
        },
        paymentTime: {
          type: 'string',
          enum: Object.values(paymentTimeEnum),
        },
      },
    };
  }
}

module.exports = Bonus;
