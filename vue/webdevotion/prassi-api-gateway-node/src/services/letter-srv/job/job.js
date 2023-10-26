class Job {
  constructor({ roleId }) {
    this.roleId = roleId;
  }

  static getJSONSchema() {
    return {
      type: 'object',
      required: ['roleId'],
      properties: {
        roleId: {
          type: 'string',
        },
      },
    };
  }
}

module.exports = Job;
