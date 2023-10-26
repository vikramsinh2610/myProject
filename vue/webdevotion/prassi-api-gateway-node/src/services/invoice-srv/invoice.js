const { v4: uuid } = require('uuid');
const AccountingNoteEntry = require('./accounting-note-entry');
const InvoiceTaxEntry = require('./invoice-tax-entry');

class Invoice {
  constructor({
    _id = uuid(),
    promoterId,
    serialNumber,
    promoterDisplayName,
    promoterRoleId,
    promoterNetworkPath,
    productivePeriodYear,
    productivePeriodMonth,
    dueDate,
    issueDate,
    taxRegimeType,
    taxes = [],
    accountingNotes = [],
    paymentDate = null,
    number = 'ND',
    previewNumber = 'ND',
    createDate = new Date(Date.now()),
    issued = false,
    preview = false,
    documentId = null,
    documentPreviewId = null,
    documentWithDetailsId = null,
    grossAmount = 0,
    amount = 0,
    directCommissionsAmount = 0,
    indirectCommissionsAmount = 0,
    otherAmount = 0,
    commissioning = false,
    totalIV = 0,
    trustDate = new Date(Date.now()),
    heading = {},
  }) {
    this._id = _id;
    this.promoterId = promoterId;
    this.serialNumber = serialNumber;
    this.promoterDisplayName = promoterDisplayName;
    this.promoterRoleId = promoterRoleId;
    this.promoterNetworkPath = promoterNetworkPath;
    this.productivePeriodYear = productivePeriodYear;
    this.productivePeriodMonth = productivePeriodMonth;
    this.number = number;
    this.previewNumber = previewNumber;
    this.createDate = createDate;
    this.accountingNotes = accountingNotes.map((e) => new AccountingNoteEntry(e));
    this.taxes = taxes.map((t) => new InvoiceTaxEntry(t));
    this.paymentDate = paymentDate;
    this.dueDate = dueDate;
    this.issueDate = issueDate;
    this.issued = issued;
    this.preview = preview;
    this.documentId = documentId;
    this.documentPreviewId = documentPreviewId;
    this.documentWithDetailsId = documentWithDetailsId;
    this.grossAmount = grossAmount;
    this.amount = amount;
    this.taxRegimeType = taxRegimeType;
    this.directCommissionsAmount = directCommissionsAmount;
    this.indirectCommissionsAmount = indirectCommissionsAmount;
    this.otherAmount = otherAmount;
    this.commissioning = commissioning;
    this.totalIV = totalIV;
    this.trustDate = trustDate;
    this.heading = heading;
  }
}

module.exports = Invoice;
