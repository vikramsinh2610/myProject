const Letter = require("../letter");
const Agreement = require('./agreement');
const { types } = require("../letter-types");

class PrivacyLetter extends Letter {
  constructor({
    _id,
    status,
    promoterId,
    promoterSerialNumber,
    promoterDisplayName,
    description = '',
    signatureDate = null,
    attachmentIds = [],
    agreements = [],
    didActiveDate = null,
    didCreateDate = null,
    didDeleteDate = null,
    didExpireDate = null,
    willExpireDate = null,
  }) {
    const type = types.PRIVACY;
    super({
      _id,
      status,
      promoterId,
      promoterSerialNumber,
      promoterDisplayName,
      type,
      description,
      signatureDate,
      attachmentIds,
      didActiveDate,
      didCreateDate,
      didDeleteDate,
      didExpireDate,
      willExpireDate,
    });
    this.agreements = agreements;
  }

  static getJSONSchema() {
    const basic = super.getJSONSchema();
    return {
      type: 'object',
      required: [...basic.required, 'agreements'],
      description: 'Bonus Letter',
      properties: {
        ...basic.properties,
        agreements: {
          type: 'array',
          items: Agreement.getJSONSchema(),
        },
      },
    };
  }
}

module.exports = PrivacyLetter;
