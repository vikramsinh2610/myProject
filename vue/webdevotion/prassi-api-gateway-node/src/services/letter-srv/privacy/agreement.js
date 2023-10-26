class Agreement {
  constructor({ name, content, agree }) {
    this.name = name;
    this.content = content;
    this.agree = agree;
  }

  static getJSONSchema() {
    return {
      type: 'object',
      required: ['name', 'content', 'agree'],
      properties: {
        name: {
          type: 'string',
        },
        content: {
          type: 'string',
        },
        agree: {
          type: 'boolean',
        },
      },
    };
  }
}

module.exports = Agreement;
