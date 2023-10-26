const { kpiTypeEnum } = require('./kpi-type-enum');

class KPI {
  constructor({ _id, value = 0, options = {}, type = kpiTypeEnum.CURRENCY }) {
    this._id = _id;
    this.value = value;
    this.type = type;
    this.options = options;
  }

  static getJSONSchema() {
    return {
      type: 'object',
      required: ['_id'],
      properties: {
        _id: {
          type: 'string',
        },
        value: {
          type: 'integer',
        },
        type: {
          type: 'string',
          enum: Object.values(kpiTypeEnum),
        },
        options: {
          type: 'object',
          additionalProperties: true,
        },
      },
    };
  }
}

module.exports = KPI;
