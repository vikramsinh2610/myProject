const KPI = require('./kpi');

class Target {
  constructor({ kpi, targetValue, weightPercentage }) {
    /** @type{KPI} */
    this.kpi = kpi;
    this.targetValue = targetValue;
    this.weightPercentage = weightPercentage;
  }

  static getJSONSchema() {
    return {
      type: 'object',
      required: ['kpi', 'targetValue', 'weightPercentage'],
      properties: {
        kpi: KPI.getJSONSchema(),
        targetValue: {
          type: 'integer',
        },
        weightPercentage: {
          type: 'integer',
          minimum: 0,
          maximum: 10000,
        },
      },
    };
  }
}

module.exports = Target;
