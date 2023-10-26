const DocumentObject = require('./document');

const types = {
  LETTER_ATTACHMENT: 'letter-attachment',
  COMPANY_ACQUITTANCE: 'company-acquittance',
  COMPANY_ACQUITTANCE_REPORT: 'company-acquittance-report',
  COMMISSIONING_NETWORK_REPORT: 'commissioning-network-report',
  INVOICING_NETWORK_REPORT: 'invoicing-network-report',
  INVOICE: 'invoice',
  INVOICES: 'invoices',
  PROMOTERS: 'promoters',
  CUSTOMERS: 'customers',
  DOSSIERS: 'dossiers',
  INVOICE_PREVIEW: 'invoice-preview',
  INVOICE_WITH_DETAILS: 'invoice-with-details',
  INSTALLMENTS: 'installments',
  WORKFLOW: 'workflow',
  SURVEYS: 'surveys',
  SIGNED_SURVEYS: 'signed-surveys',
  SIGNED_CONSULTING: 'signed-consulting',
  USER_ATTACHMENT: 'user-attachment',
  PERSONS: 'persons',
};

/**
 * @param {DocumentObject} doc
 */
function documentToPath(doc) {
  switch (doc.type) {
    case types.LETTER_ATTACHMENT:
      return `letters/${doc.additionalData.letterId}/${doc._id}`;

    case types.COMPANY_ACQUITTANCE:
      return `company-acquittances/${doc.additionalData.companyName}-${doc.additionalData.companyId}/${doc._id}`;

    case types.COMPANY_ACQUITTANCE_REPORT:
      return `company-acquittance-reports/${doc.additionalData.acquittanceId}-${doc.createDate.toISOString()}.xlsx`;

    case types.COMMISSIONING_NETWORK_REPORT:
      return `commissioning-network-report/${doc.additionalData.commissioningId}-${doc.createDate.toISOString()}.xlsx`;

    case types.INVOICING_NETWORK_REPORT:
      return `commissioning-network-report/${doc.additionalData.invoicingId}-${doc.createDate.toISOString()}.xlsx`;

    case types.INVOICE:
      return `invoices/${doc.ownerId}/${doc._id}.pdf`;

    case types.INVOICES:
      return `invoices/${doc.ownerId}/${doc.createDate.toISOString()}.xlsx`;

    case types.PROMOTERS:
      return `promoters/${doc.ownerId}/${doc.createDate.toISOString()}.xlsx`;

    case types.CUSTOMERS:
      return `customers/${doc.ownerId}/${doc.createDate.toISOString()}.xlsx`;

    case types.DOSSIERS:
      return `dossiers/${doc.ownerId}/${doc.createDate.toISOString()}.xlsx`;

    case types.WORKFLOW:
      return `workflow/${doc._id}.${doc.additionalData.extension}`;

    case types.PERSONS:
      return `persons/${doc.ownerId}/${doc._id}.${doc.additionalData.extension}`;

    case types.SURVEYS:
      return `surveys/${doc._id}.pdf`;

    case types.SIGNED_SURVEYS:
      return `surveys/signed-${doc._id}.pdf`;

    default:
      return `generals/${doc._id}`;
  }
}

module.exports = { types, documentToPath };
