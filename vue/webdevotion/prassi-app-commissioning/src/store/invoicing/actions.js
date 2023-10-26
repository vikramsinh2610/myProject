import Vue from 'vue';
import constants from '../../constants';

export const fetchInvoicings = (store) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing?skip=${store.state.invoicings.skip}`,
    receive: 'receiveInvoicings',
  });

export const fetchInvoicing = (store, invoicingId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}`,
    receive: 'receiveInvoicing',
  });

export const importInvoicing = (store, { invoicingId, body }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}/import`,
    action: 'post',
    body,
  });

export const rollback = (store, { invoicingId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}/rollback`,
    action: 'post',
  });

export const openInvoicing = (store, { invoicingId, issueDate, dueDate }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}?issueDate=${issueDate}&dueDate=${dueDate}`,
    action: 'put',
    receive: 'receiveInvoicing',
  });

export const reopenInvoicing = (store, invoicingId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}/re-open`,
    action: 'post',
    receive: 'receiveInvoicing',
  });

export const fetchInvoices = (store, invoicingId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}/invoices`,
    receive: 'receiveInvoices',
  });

export const fetchInvoicesConfirmed = (store, invoicingId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}/invoices?filterByConfirmed=true`,
    receive: 'receiveInvoicesConfirmed',
  });

export const fetchInvoicesUnconfirmed = (store, invoicingId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}/invoices?filterByConfirmed=false`,
    receive: 'receiveInvoicesUnconfirmed',
  });

export const fetchInvoice = (store, invoiceId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoices/${invoiceId}`,
    receive: 'receiveInvoice',
  });

export const setInvoiceConfirm = (store, { invoicingId, invoiceId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}/confirm-invoice?invoiceId=${invoiceId}`,
    action: 'post',
    receive: 'receiveInvoicing',
  });

export const setInvoiceRemove = (store, { invoicingId, invoiceId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}/unconfirm-invoice?invoiceId=${invoiceId}`,
    action: 'post',
    receive: 'receiveInvoicing',
  });

export const setInvoiceNoteAccounted = (store, { invoiceId, noteId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoices/${invoiceId}/accounting-notes/${noteId}/account`,
    action: 'post',
  });

export const setInvoiceNoteUnaccounted = (store, { invoiceId, noteId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoices/${invoiceId}/accounting-notes/${noteId}/unaccount`,
    action: 'post',
  });

export const addInvoiceNote = (store, { promoterId, note }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/accounting-notes`,
    action: 'post',
    body: note,
    receive: 'receiveNote',
  });

export const deleteInvoiceNote = (store, { promoterId, noteId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/accounting-notes/${noteId}`,
    action: 'delete',
  });

export const setInvoicingClose = (store, invoicingId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}/close`,
    action: 'post',
    receive: 'receiveInvoicing',
  });

export const setInvoicingPreview = (store, invoicingId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}/preview`,
    action: 'post',
    receive: 'receiveInvoicing',
  });

export const fetchDocuments = (store, invoicingId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}/documents?skip=${store.state.documents.skip}&count=${
      constants.skipDefault
    }${
      store.state.filter.fullTextSearch
        ? `&fullTextSearch=${store.state.filter.fullTextSearch}`
        : ''
    }`,
    receive: 'receiveDocuments',
  });

export const fetchPreviewDocuments = (store, invoicingId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}/documents-preview?skip=${
      store.state.previewDocuments.skip
    }&count=${constants.skipDefault}${
      store.state.filter.fullTextSearch
        ? `&fullTextSearch=${store.state.filter.fullTextSearch}`
        : ''
    }`,
    receive: 'receivePreviewDocuments',
  });

export const fetchPromoterNotes = (store, { promoterId, year, month }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/accounting-notes?skip=0${
      year
        ? // eslint-disable-next-line prefer-template
          '&productivePeriodYear=' + year
        : ''
    }${
      month
        ? // eslint-disable-next-line prefer-template
          '&productivePeriodMonth=' + month
        : ''
    }`,
    receive: 'receivePromoterNotes',
  });

export const createInvoice = (store, { promoterId, invoice }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/invoices`,
    action: 'post',
    body: invoice,
    receive: 'receiveInvoice',
  });

export const issueInvoice = (store, { promoterId, invoiceId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/invoices/${invoiceId}/issue`,
    action: 'post',
    receive: 'receiveInvoice',
  });

export const unIssueInvoice = (store, { promoterId, invoiceId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/invoices/${invoiceId}/unissue`,
    action: 'post',
    receive: 'receiveInvoice',
  });

export const changeTaxRegime = (store, { promoterId, invoiceId, taxRegime, invoiceHeading }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/invoices/${invoiceId}/change-tax?tax=${taxRegime}`,
    action: 'post',
    body: invoiceHeading,
    receive: 'receiveInvoice',
  });

export const deleteInvoice = (store, { promoterId, invoiceId }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/promoters/${promoterId}/invoices/${invoiceId}`,
    action: 'delete',
  });

export const fetchInvoicingExcelReport = (store, invoicingId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}/invoices-export-excel`,
    receive: 'receiveInvoicingReport',
    action: 'post',
  });

export const fetchInvoicingExcelAllReport = (store, invoicingId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}/invoices-export-excel-all`,
    receive: 'receiveInvoicingReport',
    action: 'post',
  });

export const fetchInvoicingExcelAllYearReport = (store, invoicingId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}/invoices-export-excel-all-year`,
    receive: 'receiveInvoicingReport',
    action: 'post',
  });

export const fetchInvoicingExcelReportConfirmed = (store, invoicingId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}/invoices-export-excel?filterByConfirmed=true`,
    receive: 'receiveInvoicingReport',
    action: 'post',
  });

export const fetchInvoicingExcelReportFiscal = (store, invoicingId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}/invoices-export-excel-fiscal`,
    receive: 'receiveInvoicingReport',
    action: 'post',
  });

export const fetchInvoicingExcelPromotersRegistry = (store, invoicingId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}/export-excel-promoters-registry`,
    receive: 'receiveInvoicingReport',
    action: 'post',
  });

export const fetchInvoicingExcelAccountExport = (store, invoicingId) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${invoicingId}/export-excel-invoices`,
    receive: 'receiveInvoicingReport',
    action: 'post',
  });

export const fetchTcwInvoicingExcelAccountExport = (store, { period, newExportNumber }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${period}/tcw-export-excel-invoices${
      newExportNumber
        ? // eslint-disable-next-line prefer-template
          '?newExportNumber=' + newExportNumber
        : ''
    }\`,`,
    receive: 'receiveInvoicingReport',
    action: 'post',
  });

export const fetchTcwInvoicingExcelAccountExportTCA = (store, { period, newExportNumber }) =>
  Vue.prototype.$utils.getApiCall(store, {
    url: `/v1/invoicing/${period}/tcw-export-excel-invoices-tca${
      newExportNumber
        ? // eslint-disable-next-line prefer-template
          '?newExportNumber=' + newExportNumber
        : ''
    }`,
    receive: 'receiveInvoicingReport',
    action: 'post',
  });
