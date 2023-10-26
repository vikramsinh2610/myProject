// eslint-disable-next-line max-classes-per-file
class TargetRow {
  constructor({ from, to, percentage = 0 }) {
    this.from = from;
    this.to = to;
    this.percentage = percentage;
  }
}

class RappelPas {
  constructor({ quarterTargetTableRows = [] }) {
    /** @type{Array<TargetRow>} */
    this.quarterTargetTableRows = quarterTargetTableRows.map((v) => new TargetRow(v));
  }

  static getJSONSchema() {
    return {
      type: 'object',
      required: [],
      properties: {
        quarterTargetTableRows: {
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
              percentage: {
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

module.exports = RappelPas;
