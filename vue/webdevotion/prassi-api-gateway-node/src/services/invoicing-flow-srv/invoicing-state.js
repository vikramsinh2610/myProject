const productivePeriodHelper = require("../../utils/productive-period-helper");

class InvoicingState {
  constructor({
    productivePeriodYear,
    productivePeriodMonth,
    invoices,
    status = '',
    didOpenedDate = null,
    didClosedDate = null,
    documentIds = [],
    documentIdsPreview = [],
    documentIdsWithDetail = [],
    stats = { gross: 0, net: 0, tax: 0, promoterNumber: 0 },
    issueDate = null,
    dueDate = null,
  }) {
    this.productivePeriodYear = productivePeriodYear;
    this.productivePeriodMonth = productivePeriodMonth;
    this.status = status;
    /** @type{Array} */
    this.invoices = invoices;
    this.didOpenedDate = didOpenedDate;
    this.didClosedDate = didClosedDate;
    this._id = InvoicingState.buildId(productivePeriodYear, productivePeriodMonth);
    this.documentIds = documentIds;
    this.documentIdsPreview = documentIdsPreview;
    this.documentIdsWithDetail = documentIdsWithDetail;
    this.stats = stats;
    this.issueDate = issueDate;
    this.dueDate = dueDate;
  }

  static buildId(productivePeriodYear, productivePeriodMonth) {
    return `${productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth)}`;
  }
}

module.exports = InvoicingState;
