// eslint-disable-next-line max-classes-per-file
class BonusRow {
  constructor({ from, to, amount }) {
    this.from = from;
    this.to = to;
    this.amount = amount;
  }
}

class BonusPas {
  constructor({ bonusTableRows = [] }) {
    /** @type{Array<BonusRow>} */
    this.bonusTableRows = bonusTableRows.map((v) => new BonusRow(v));
  }

  static getJSONSchema() {
    return {
      type: 'object',
      required: [],
      properties: {
        bonusTableRows: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            properties: {
              from: {
                type: 'integer',
                minimum: 0,
              },
              to: {
                type: 'integer',
              },
              amount: {
                type: 'integer',
                minimum: 0,
              },
            },
          },
        },
      },
    };
  }
}

module.exports = BonusPas;
