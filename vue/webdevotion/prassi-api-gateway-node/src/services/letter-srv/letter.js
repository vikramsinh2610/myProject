const { statuses } = require('./letter-statuses');
const regexDate = require('../../utils/iso-6801-date');
const { types } = require('./letter-types');

class Letter {
  constructor({
    _id,
    status,
    promoterId,
    promoterSerialNumber,
    promoterDisplayName,
    type = types.NONE,
    description = '',
    signatureDate = new Date(Date.now()),
    attachmentIds = [],
    didActiveDate = null,
    didCreateDate = null,
    didDeleteDate = null,
    didExpireDate = null,
    willExpireDate = null,
  }) {
    this._id = _id;
    this.status = status;
    this.promoterId = promoterId;
    this.promoterSerialNumber = promoterSerialNumber;
    this.promoterDisplayName = promoterDisplayName;
    this.type = type;
    this.description = description;
    this.signatureDate = signatureDate;
    this.attachmentIds = attachmentIds;
    this.didActiveDate = didActiveDate;
    this.didCreateDate = didCreateDate;
    this.didDeleteDate = didDeleteDate;
    this.didExpireDate = didExpireDate;
    this.willExpireDate = willExpireDate;
  }

  static getJSONSchema() {
    return {
      type: 'object',
      required: [
        '_id',
        'status',
        'promoterId',
        'promoterSerialNumber',
        'promoterDisplayName',
        'type',
        'description',
        'signatureDate',
        'attachmentIds',
      ],
      properties: {
        _id: {
          type: 'string',
        },
        type: {
          type: 'string',
          enum: Object.values(types),
        },
        status: {
          type: 'string',
          enum: Object.values(statuses),
          description: 'Status of the letter',
        },
        promoterId: {
          type: 'string',
          description: 'Promoter ID',
        },
        promoterSerialNumber: {
          type: 'string',
          description: 'Promoter Serial Number',
        },
        promoterDisplayName: {
          type: 'string',
          description: 'Promoter full name',
        },
        description: {
          type: 'string',
        },
        signatureDate: {
          type: 'string',
          pattern: regexDate,
        },
        attachmentIds: {
          type: 'array',
          description: 'Attachements ID',
          items: {
            type: 'string',
          },
        },
        didActiveDate: {
          type: 'string',
          pattern: regexDate,
        },
        didCreateDate: {
          type: 'string',
          pattern: regexDate,
        },
        didDeleteDate: {
          type: 'string',
          pattern: regexDate,
        },
        didExpireDate: {
          type: 'string',
          pattern: regexDate,
        },
        willExpireDate: {
          type: 'string',
          pattern: regexDate,
        },
      },
    };
  }
}

module.exports = Letter;
