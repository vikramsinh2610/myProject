class Job {
  constructor({ roleId }) {
    this.roleId = roleId;
  }

  static getJSONSchema() {
    return {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          fromProductivePeriodYear: {
            type: 'integer',
            minimum: 2010,
            maximum: 2100,
          },
          fromProductivePeriodMonth: {
            type: 'integer',
            minimum: 1,
            maximum: 12,
          },
          roleId: {
            type: 'string',
          },
          state: {
            type: 'string',
          },
          date: {
            type: 'string',
          },
        },
      },
    };
  }
}

module.exports = Job;
