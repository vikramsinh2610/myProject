// eslint-disable-next-line max-classes-per-file
class Row {
  constructor({ from, to, percentage = 0 }) {
    this.from = from;
    this.to = to;
    this.percentage = percentage;
  }
}

class RappelPa {
  constructor({ quarterTargetTableRows = [], rappelPaType = 'all' }) {
    /** @type{Array<Row>} */
    this.quarterTargetTableRows = quarterTargetTableRows.map((r) => new Row(r));
    this.rappelPaType = rappelPaType;
  }

  static getJSONSchema() {
    return {
      type: 'object',
      required: [],
      properties: {
        rappelPaType: {
          type: 'string',
        },
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

module.exports = RappelPa;
