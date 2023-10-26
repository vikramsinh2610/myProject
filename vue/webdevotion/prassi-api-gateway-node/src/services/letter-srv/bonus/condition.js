const Target = require('./target');

class Condition {
  constructor({ targets }) {
    /** @type{Array<Target>} */
    this.targets = targets;
  }

  static getJSONSchema() {
    return {
      type: 'object',
      required: ['targets'],
      properties: {
        targets: {
          type: 'array',
          items: Target.getJSONSchema(),
        },
      },
    };
  }
}

module.exports = Condition;
