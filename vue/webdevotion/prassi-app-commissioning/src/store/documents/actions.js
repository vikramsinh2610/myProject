import Vue from 'vue';

export const fetchDocumentUrl = (store, documentId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/documents/${documentId}/presigned-download`,
    receive: 'receiveDocument',
  });

export const fetchInvoiceDetailUrl = (store, invoiceId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/documents/invoice/${invoiceId}/presigned-download`,
    receive: 'receiveDocument',
  });

// eslint-disable-next-line sonarjs/no-identical-functions
export const fetchDocument = (store, documentId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/documents/${documentId}/presigned-download`,
    receive: 'receiveDocument',
  });

export const fetchInvoiceZipUrl = (store, { invoicingId, type, preview, withDetails = false }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}/zip?type=${type}&preview=${preview}&withDetails=${withDetails}`,
    receive: 'receiveDocument',
  });

export const fetchExportUrl = (store, exportId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/documents/${exportId}/export-presigned-download`,
    receive: 'receiveDocument',
  });
