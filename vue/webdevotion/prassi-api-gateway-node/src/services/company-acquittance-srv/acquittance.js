const { v4: uuid } = require('uuid');
const Payment = require('./payment');
const dateRegex = require('../../utils/iso-6801-date');

class Acquittance {
  constructor({
    _id = uuid(),
    status = 'none',
    companyId,
    companyName,
    documentId,
    payments,
    didCreatedDate = null,
    didConfirmedDate = null,
  }) {
    this._id = _id;
    this.status = status;
    this.companyId = companyId;
    this.companyName = companyName;
    this.documentId = documentId;
    this.didCreatedDate = didCreatedDate;
    this.didConfirmedDate = didConfirmedDate;
    /** @type{Array<Payment>} */
    this.payments = payments.map((p) => new Payment(p));
  }

  static getJSONSchema() {
    return {
      type: 'object',
      required: ['_id', 'status', 'didCreatedDate', 'companyName'],
      properties: {
        _id: {
          type: 'string',
          description: 'Payment ID',
        },
        status: {
          type: 'string',
          description: 'Status',
        },
        didCreatedDate: {
          type: 'string',
          pattern: dateRegex,
          description: 'Created date',
        },
        didConfirmedDate: {
          type: 'string',
          pattern: dateRegex,
          description: 'Confirmed date',
        },
        companyName: {
          type: 'string',
          description: 'Company name',
        },
        payments: {
          type: 'array',
          items: Payment.getJSONSchema(),
        },
      },
    };
  }
}

module.exports = Acquittance;
