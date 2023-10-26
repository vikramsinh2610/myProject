class Absorbability {
  constructor({ indirectProductionPercentage, directProductionPercentage }) {
    this.indirectProductionPercentage = indirectProductionPercentage;
    this.directProductionPercentage = directProductionPercentage;
  }

  static getJSONSchema() {
    return {
      type: 'object',
      required: ['directProductionPercentage', 'indirectProductionPercentage'],
      properties: {
        directProductionPercentage: {
          description: 'Direct production percentage, with 2 decimals as integer',
          type: 'integer',
          minimum: 0,
          maximum: 10000,
        },
        indirectProductionPercentage: {
          description: 'Indirect production percentage, with 2 decimals as integer',
          type: 'integer',
          minimum: 0,
          maximum: 10000,
        },
      },
    };
  }
}

module.exports = Absorbability;
