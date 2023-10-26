/* eslint global-require: 0 */

const logger = require('../services/logger-srv')();

const root = (fastify, opts, next) => {
  // eslint-disable-next-line security/detect-non-literal-require, import/no-dynamic-require
  const r = (path, uri) => fastify.register(require(path), { prefix: uri });

  // EXCEL-UPLOAD

  r('./excel-upload/dossiers.js', '/excel-upload/dossiers');
  r('./excel-upload/dossier-statues.js', '/excel-upload/dossier-statuses');

  // USERS

  r('./users/login', '/users/login');
  r('./users/verify-token', '/users/verifytoken');
  r('./users/verify-2-factor', '/users/verify2fact');
  r('./users/reset-qr-code', '/users/reset-qr-code');
  r('./users/recover-qr-code', '/users/recover-qr-code');
  r('./users/recover-password', '/users/recover-password');
  r('./users/upload-attachment', '/users/upload/:userId');
  r('./users/list-attachment', '/users/attachment/:userId');
  r('./users/add-document', '/users/attachment/:userId/:attachmentId');
  r('./users/delete-document', '/users/attachment/:userId/:attachmentId');

  // PROMOTERS

  r('./promoters/get', '/promoters/:promoterId');
  r('./promoters/roles', '/promoters/roleIds');
  r('./promoters/getrole', '/promoters/role/:roleId');
  r('./promoters/addrole', '/promoters/role');
  r('./promoters/deleterole', '/promoters/role/:roleId');
  r('./promoters/list', '/promoters');
  r('./promoters/list-period', '/promoters/period');
  r('./promoters/company-profile/get', '/promoters/:promoterId/company-profile');
  r('./promoters/company-profile/update', '/promoters/:promoterId/company-profile');
  // Letters
  r('./promoters/letters/get', '/promoters/:promoterId/letters/:letterId');
  r('./promoters/letters/list', '/promoters/:promoterId/letters');
  r('./promoters/letters/add', '/promoters/:promoterId/letters');
  r('./promoters/letters/update', '/promoters/:promoterId/letters/:letterId');
  r('./promoters/letters/delete', '/promoters/:promoterId/letters/:letterId/delete');
  r('./promoters/letters/copy', '/promoters/:promoterId/letters/:letterId/copy');
  r('./promoters/letters/activate', '/promoters/:promoterId/letters/:letterId/active');
  r('./promoters/letters/inactivate', '/promoters/:promoterId/letters/:letterId/inactivate');
  r('./promoters/letters/settings', '/promoters/:promoterId/letters/settings');
  r(
    './promoters/letters/attachments/presigned-upload',
    '/promoters/:promoterId/letters/:letterId/attachments/presigned-upload',
  );
  r('./promoters/letters/attachments/list', '/promoters/:promoterId/letters/:letterId/attachments');
  r('./promoters/letters/attachments/add', '/promoters/:promoterId/letters/:letterId/attachments/:attachmentId');
  // Documents
  r('./promoters/documents/list.js', '/promoters/:promoterId/documents');
  r('./promoters/downloads/list.js', '/promoters/:promoterId/downloads');
  r('./promoters/promoters-export-excel', '/promoters/promoters-excel-report');

  // Invoices
  r('./promoters/invoices/create', '/promoters/:promoterId/invoices');
  r('./promoters/invoices/list', '/promoters/:promoterId/invoices');
  r('./promoters/invoices/delete', '/promoters/:promoterId/invoices/:invoiceId');
  r('./promoters/invoices/issue', '/promoters/:promoterId/invoices/:invoiceId/issue');
  r('./promoters/invoices/unissue', '/promoters/:promoterId/invoices/:invoiceId/unissue');
  r('./promoters/invoices/change-tax', '/promoters/:promoterId/invoices/:invoiceId/change-tax');
  // Accounting notes
  r('./promoters/accounting-notes/list', '/promoters/:promoterId/accounting-notes');
  r('./promoters/accounting-notes/list-types', '/promoters/accounting-notes/list-types');
  r('./promoters/accounting-notes/add', '/promoters/:promoterId/accounting-notes');
  r('./promoters/accounting-notes/delete', '/promoters/:promoterId/accounting-notes/:id');
  // Targets
  r('./promoters/targets/add', '/promoters/:promoterId/targets');
  r('./promoters/targets/get', '/promoters/:promoterId/targets');
  r('./promoters/targets/list', '/promoters/:promoterId/targets/:productivePeriodYear');
  r('./promoters/targets/update', '/promoters/:promoterId/targets/:productivePeriodYear');
  // Jobs
  r('./promoters/jobs/list', '/promoters/:promoterId/jobs');
  r('./promoters/jobs/update', '/promoters/:promoterId/jobs');
  r('./promoters/branches', '/promoters/:promoterId/branches');

  // LETTERS

  r('./letters/list', '/letters');
  r('./letters/types', '/letters/types');

  // Menu Permissions
  r('./menu-permissions/list', '/menu-permissions');
  r('./menu-permissions/list-configurations', '/menu-permissions-configurations');
  r('./menu-permissions/list-promoters', '/menu-permissions-configurations-users');
  r('./menu-permissions/menu-ids', '/menu-ids');
  r('./menu-permissions/update', '/menu-permissions-configurations');
  r('./menu-permissions/delete', '/menu-permissions-configurations/:menuPermissionsId');

  // COMPANIES

  r('./companies/list', '/companies');
  r('./companies/acquittances/add', '/companies/:companyId/acquittances/:documentId');
  r('./companies/acquittances/presigned-upload', '/companies/:companyId/acquittances/presigned-upload');

  // ACQUITTANCES

  r('./acquittances/refresh', '/acquittances/:acquittanceId/refresh');
  r('./acquittances/confirm', '/acquittances/:acquittanceId/confirm');
  r('./acquittances/unconfirm', '/acquittances/:acquittanceId/unconfirm');
  r('./acquittances/delete', '/acquittances/:acquittanceId/delete');
  r('./acquittances/update', '/acquittances/:acquittanceId/update');
  r('./acquittances/create-report', '/acquittances/:acquittanceId/create-report');
  r('./acquittances/list', '/acquittances');
  r('./acquittances/get', '/acquittances/:acquittanceId');
  r('./acquittances/select-excel-value', '/acquittances/:acquittanceId/select-excel-value');
  r('./acquittances/select-calculated-value', '/acquittances/:acquittanceId/select-calculated-value');

  // DOCUMENTS

  r('./documents/invoice-detail-presigned-download', '/documents/invoice/:invoiceId/presigned-download');
  r('./documents/presigned-download', '/documents/:documentId/presigned-download');
  r('./documents/delete', '/documents/:documentId');
  r('./documents/export-presigned-download', '/documents/:exportId/export-presigned-download');

  // COMMISSIONING

  r('./commissioning/list', '/commissioning');
  r('./commissioning/get', '/commissioning/:commissioningId');
  r('./commissioning/open', '/commissioning/:commissioningId');
  r('./commissioning/close', '/commissioning/:commissioningId/close');
  r('./commissioning/add-installment', '/commissioning/:commissioningId/add-installment');
  r('./commissioning/remove-installment', '/commissioning/:commissioningId/remove-installment');
  r('./commissioning/rollback', '/commissioning/:commissioningId/rollback');
  r('./commissioning/rollback-close', '/commissioning/:commissioningId/rollback-close');
  r('./commissioning/reset', '/commissioning/:commissioningId/reset');
  r('./commissioning/confirm', '/commissioning/:commissioningId/confirm');
  r('./commissioning/confirm-static', '/commissioning/:commissioningId/confirm-static');
  r('./commissioning/reopen', '/commissioning/:commissioningId/reopen');
  r('./commissioning/reopenerror', '/commissioning/:commissioningId/reopenerror');
  r('./commissioning/installments-pg', '/commissioning/:commissioningId/installments-pg');
  r('./commissioning/result', '/commissioning/:commissioningId/result');
  r('./commissioning/result-export-excel', '/commissioning/:commissioningId/result-excel-report');
  r(
    './commissioning/result-export-excel-installments',
    '/commissioning/:commissioningId/result-excel-installments-report',
  );
  r('./commissioning/log-events', '/log-events');
  r('./commissioning/sync', '/commissioning/:commissioningId/sync');
  // Practices
  r('./commissioning/practices/add', '/commissioning/practices/:practiceId');
  r('./commissioning/contracts/add', '/commissioning/contracts/:contractId');
  r('./commissioning/practices/update', '/commissioning/practices/:practiceId');
  r('./commissioning/practices/remove', '/commissioning/practices/:practiceId');
  // Management fee
  r('./commissioning/management-fees/list', '/commissioning/:commissioningId/management-fees');

  // SERVICES
  r('./services/seed', '/services/seed');
  r('./services/indexing', '/services/indexing');

  // PRODUCT CONFIGURATION
  r('./product-configurations/list', '/product-configurations');
  r('./product-configurations/get', '/product-configurations/:productId');
  r('./product-configurations/add', '/product-configurations/:productId');
  r('./product-configurations/copy', '/product-configurations/:productId/copy');
  r('./product-configurations/delete', '/product-configurations/:productId');
  r('./product-configurations/download', '/product-configurations/download');
  r('./product-configurations/upload', '/product-configurations/upload');
  r('./product-configurations/upload-numbers', '/product-configurations/upload-numbers');
  r('./product-configurations/download-numbers', '/product-configurations/download-numbers');
  r('./numbers/upload-sepa', '/numbers/upload-sepa');
  r('./numbers/download-sepa', '/numbers/download-sepa');
  // SIGNALER
  r('./product-configurations/signaler/list', '/product-configurations/signaler');
  r('./product-configurations/signaler/get', '/product-configurations/signaler/:productId');
  r('./product-configurations/signaler/add', '/product-configurations/signaler/:productId');
  r('./product-configurations/signaler/delete', '/product-configurations/signaler/:productId');
  // DOSSIER INSURER
  r('./dossier-insurer/list', '/dossier-insurer');
  r('./dossier-insurer/add', '/dossier-insurer'); // /:dossierInsurerId
  r('./dossier-insurer/delete', '/dossier-insurer/:dossierInsurerId');
  r('./dossier-insurer/sync', '/dossier-insurer/sync');

  // MANAGEMENT FEE CONFIGURATION
  r('./management-fee-configurations/list', '/management-fee-configurations');
  r('./management-fee-configurations/get', '/management-fee-configurations/:managementFeeId');
  r('./management-fee-configurations/add', '/management-fee-configurations/:managementFeeId');
  r('./management-fee-configurations/delete', '/management-fee-configurations/:managementFeeId');

  // SHELTIA COMMISSIONING CONFIGURATION
  r('./sheltia-commissioning-configurations/list', '/sheltia-commissioning-configurations');
  r('./sheltia-commissioning-configurations/get', '/sheltia-commissioning-configurations/:commissioningId');
  r('./sheltia-commissioning-configurations/add', '/sheltia-commissioning-configurations/:commissioningId');
  r('./sheltia-commissioning-configurations/delete', '/sheltia-commissioning-configurations/:commissioningId');

  // TCW COMMISSIONING CONFIGURATION
  r('./tcw-commissioning-configurations/list', '/tcw-commissioning-configurations');
  r('./tcw-commissioning-configurations/get', '/tcw-commissioning-configurations/:commissioningId');
  r('./tcw-commissioning-configurations/add', '/tcw-commissioning-configurations/add/:commissioningId');
  r('./tcw-commissioning-configurations/update', '/tcw-commissioning-configurations/:commissioningId');
  r('./tcw-commissioning-configurations/delete', '/tcw-commissioning-configurations/:commissioningId');

  // TCW COMMISSIONING CONFIGURATION DYNAMIC
  r('./tcw-commissioning-configurations-dynamic/list', '/tcw-commissioning-configurations-dynamic');
  r('./tcw-commissioning-configurations-dynamic/get', '/tcw-commissioning-configurations-dynamic/:commissioningId');
  r('./tcw-commissioning-configurations-dynamic/add', '/tcw-commissioning-configuration-dynamics/add/:commissioningId');
  r('./tcw-commissioning-configurations-dynamic/update', '/tcw-commissioning-configurations-dynamic/:commissioningId');
  r('./tcw-commissioning-configurations-dynamic/delete', '/tcw-commissioning-configurations-dynamic/:commissioningId');

  // ADJUSTED PREMIUM CONFIGURATION
  r('./adjusted-premium-configurations/list', '/adjusted-premium-configurations');
  r('./adjusted-premium-configurations/get', '/adjusted-premium-configurations/:adjustedPremiumId');
  r('./adjusted-premium-configurations/add', '/adjusted-premium-configurations/:adjustedPremiumId');
  r('./adjusted-premium-configurations/delete', '/adjusted-premium-configurations/:adjustedPremiumId');

  // INVOICING
  r('./invoicing/list', '/invoicing');
  r('./invoicing/get', '/invoicing/:invoicingId');
  r('./invoicing/open', '/invoicing/:invoicingId');
  r('./invoicing/import', '/invoicing/:invoicingId/import');
  r('./invoicing/rollback', '/invoicing/:invoicingId/rollback');
  r('./invoicing/confirm-invoice', '/invoicing/:invoicingId/confirm-invoice');
  r('./invoicing/unconfirm-invoice', '/invoicing/:invoicingId/unconfirm-invoice');
  r('./invoicing/close', '/invoicing/:invoicingId/close');
  r('./invoicing/preview', '/invoicing/:invoicingId/preview');
  r('./invoicing/preview-static', '/invoicing/:invoicingId/preview-static');
  r('./invoicing/re-open', '/invoicing/:invoicingId/re-open');
  r('./invoicing/re-open-static', '/invoicing/:invoicingId/re-open-static');
  // Invoices
  r('./invoicing/invoices/list', '/invoicing/:invoicingId/invoices');
  r('./invoicing/invoices/invoices-export-excel', '/invoicing/:invoicingId/invoices-export-excel');
  r('./invoicing/invoices/invoices-export-excel-all', '/invoicing/:invoicingId/invoices-export-excel-all');
  r('./invoicing/invoices/invoices-export-excel-all-year', '/invoicing/:invoicingId/invoices-export-excel-all-year');
  r('./invoicing/invoices/invoices-export-excel-fiscal', '/invoicing/:invoicingId/invoices-export-excel-fiscal');
  r('./invoices/get', '/invoices/:invoiceId');
  r('./invoices/get-headings', '/invoices/headings');
  r('./invoices/accounting-notes/account', '/invoices/:invoiceId/accounting-notes/:accountingNoteId/account');
  r('./invoices/accounting-notes/unaccount', '/invoices/:invoiceId/accounting-notes/:accountingNoteId/unaccount');
  // Documents
  r('./invoicing/documents/list', '/invoicing/:invoicingId/documents');
  r('./invoicing/documents/list-preview', '/invoicing/:invoicingId/documents-preview');
  r('./invoicing/documents/zip', '/invoicing/:invoicingId/zip');
  // Export
  r('./invoicing/export-excel-promoters-registry', '/invoicing/:invoicingId/export-excel-promoters-registry');
  r('./invoicing/export-excel-invoices', '/invoicing/:invoicingId/export-excel-invoices');
  r('./invoicing/get-tcw-export-number', '/invoicing/:invoicingId/get-tcw-export-number');
  r('./invoicing/get-tcw-export-number-tca', '/invoicing/:invoicingId/get-tcw-export-number-tca');
  r('./invoicing/tcw-export-excel-invoices', '/invoicing/:invoicingId/tcw-export-excel-invoices');
  r('./invoicing/tcw-export-excel-invoices-tca', '/invoicing/:invoicingId/tcw-export-excel-invoices-tca');
  r('./invoicing/advisory-fee/export-csv-invoices', '/advisory-fee/export-csv-invoices');
  r('./invoicing/advisory-fee/export-csv-promoters-registry', '/advisory-fee/export-csv-promoters-registry');

  // COUNTABILITY
  r('./countability/transactions', '/transactions');
  r('./countability/transactions', '/countability/transactions');
  r('./countability/forecast', '/countability/forecast');
  r('./products/list', '/products');
  r('./countability/export-excel-installments', '/countability/export-excel-installments');

  // DOSSIERS
  r('./dossiers/sync-fix', '/dossiers/sync-fix');
  r('./dossiers/sync-practice', '/dossiers/update-dossier');
  r('./dossiers/proposals/summary', '/proposals/summary');
  r('./dossiers/proposals/export', '/proposals/export');
  r('./dossiers/proposals/list', '/proposals');
  r('./dossiers/package/summary', '/package/summary');
  r('./dossiers/package/export', '/package/export');
  r('./dossiers/package/list', '/package');
  r('./dossiers/overdue/summary', '/overdue/summary');
  r('./dossiers/overdue/export', '/overdue/export');
  r('./dossiers/overdue/list-pg', '/overdue');
  r('./dossiers/installments/summary-pg', '/installments/summary-pg');
  r('./dossiers/installments/export', '/installments/export');
  r('./dossiers/installments/list-pg', '/installments-pg');
  r('./dossiers/installments/installment-confirm', '/installment/:practiceId/confirmed');
  r('./dossiers/installments/installment-pay', '/installment/:practiceId/paid');
  r('./dossiers/installments/installment-update-payin', '/installment/:practiceId/update-payin');
  r('./dossiers/installments/installment-unconfirm', '/installment/:practiceId/unconfirmed');
  r('./dossiers/installments/installment-unpay', '/installment/:practiceId/unpaid');
  r('./dossiers/contracts/summary', '/contracts/summary');
  r('./dossiers/contracts/export', '/contracts/export');
  r('./dossiers/contracts/list', '/contracts');
  r('./dossiers/production/summary', '/production/summary');
  r('./dossiers/production/export', '/production/export');
  r('./dossiers/production/sheltia-export', '/production/sheltia-export');
  r('./dossiers/production/list', '/production');
  r('./dossiers/negative/summary', '/negative/summary');
  r('./dossiers/negative/export', '/negative/export');
  r('./dossiers/negative/list', '/negative');
  r('./dossiers/sync-customer', '/dossiers/sync-customer');
  r('./network/list', '/network/list');
  r('./network/list-period', '/network/list-period');
  r('./network/tree', '/network/tree');
  r('./network/create', '/network/create');
  r('./network/create-copy', '/network/create-copy');
  r('./network/save-node', '/network/:nodeId/save');
  r('./network/move-node-customer', '/network/:nodeTargetId/move-customer/:nodeDestinationId');
  r('./network/create-node', '/network/:nodeId/create');
  r('./network/delete-node', '/network/:nodeId/delete');
  r('./network/order-node', '/network/:nodeId/order');
  r('./network/move-node', '/network/:sourceNodeId/move');
  r('./network/sync-network-flat', '/network/sync');

  // PERSONS

  r('./persons/list', '/persons');
  r('./persons/list-unified', '/persons-unified');
  r('./persons/list-select', '/persons-select');
  r('./persons/list-persons-filter', '/persons-filter');
  r('./persons/list-documents', '/persons-documents');
  r('./persons/list-persons', '/persons-persons');
  r('./persons/list-relations', '/persons-relations');
  r('./persons/list-companies', '/persons-companies');
  r('./persons/list-dossiers', '/persons-dossiers');
  r('./persons/delete-documents', '/persons-documents/:documentId');
  r('./persons/delete-persons', '/persons-persons/:personId');
  r('./persons/delete-companies', '/persons-companies/:personId');
  r('./persons/update-documents', '/persons-documents/:documentId');
  r('./persons/update-persons', '/persons-persons');
  r('./persons/update-persons-legal', '/persons-persons-legal');
  r('./persons/update-companies', '/persons-companies');
  r('./persons/summary', '/persons/summary');
  r('./persons/sync', '/persons/sync');
  r('./persons/sync-cards', '/persons/sync-cards');
  r('./persons/get', '/persons/:personId');
  r('./persons/get-precontactual-person', '/persons-precontractual/:precontractualId');
  r('./persons/get-precontactual-person-by-id', '/persons-precontractual-id/:personId');
  r('./persons/get-last-identity-card', '/last-identity-card/:customerId');
  r('./persons/get-by-person-id', '/persons-id/:personId');
  r('./persons/delete', '/persons/:personId');
  r('./persons/update', '/persons');
  r('./persons/create', '/persons');
  r('./person-owner/list', '/person-owner');
  r('./person-owner/add', '/person-owner');
  r('./person-owner/delete', '/person-owner/:customerInsurerId');

  // PRECONTRACTUAL

  r('./precontractual/list', '/precontractual');
  r('./precontractual/get', '/precontractual/:precontractualId');
  r('./precontractual/get-related', '/precontractual-related/:customerId');
  r('./precontractual/create', '/precontractual/:customerId');
  r('./precontractual/get-summary', '/precontractual/:personId/summary');
  r('./precontractual/update', '/precontractual');
  r('./precontractual/delete', '/precontractual/:precontractualId');
  r('./precontractual/get-identity-card', '/precontractual/identity-card/:precontractualId');
  r('./precontractual/update-identity-card', '/precontractual/update-identity-card');
  r('./precontractual/sign-pdf-documents', '/precontractual/sign-pdf-documents/:precontractualId');
  r('./precontractual/sign-pdf-documents-company', '/precontractual/sign-pdf-documents-company/:precontractualId');
  r('./precontractual/update-sign-pdf-documents', '/precontractual/update-sign-pdf-documents/:precontractualId');
  r('./precontractual/global-precontractual-list', '/precontractual-list');

  // CUSTOMERS

  r('./customers/list', '/customers');
  r('./customers/list-identity-cards', '/customers-identity-cards');
  r('./customers/list-simple', '/customers-simple');
  r('./customers/summary', '/customers/summary');
  r('./customers/summary-identity-cards', '/customers/summary-identity-cards');
  r('./customer-insurer/list', '/customer-insurer');
  r('./customer-insurer/add', '/customer-insurer');
  r('./customer-insurer/delete', '/customer-insurer/:customerInsurerId');
  r('./customers/get', '/customers/:customerId');
  r('./customers/delete', '/customers/:customerId');
  r('./customers/create', '/customers');
  r('./customers/sync', '/customers/sync');
  r('./customers/sync-person', '/customers/update-person');
  r('./customers/sync-fix', '/customers/sync-fix');
  r('./customers/export-customers', '/customers/export-customers');
  r('./customers/export-customers-identity-cards', '/customers/export-customers-identity-cards');

  // SURVEY

  r('./survey/question/list', '/survey/questions');
  r('./survey/question/add', '/survey/questions');
  r('./survey/question/delete', '/survey/questions/:questionId');
  r('./survey/question/get', '/survey/questions/:questionId');
  r('./survey/survey/list', '/survey');
  r('./survey/survey/add', '/survey');
  r('./survey/survey/delete', '/survey/:surveyId');
  r('./survey/survey/get', '/survey/:surveyId');
  r('./survey/survey/extra-questions', '/survey/extra-questions');
  r('./survey/result/list', '/survey/result');
  r('./survey/result/count', '/survey/result/count');
  r('./survey/result/add', '/survey/result');
  r('./survey/result/update', '/survey/result/:resultId');
  r('./survey/result/confirm', '/survey/result/:resultId/confirm');
  r('./survey/result/publish', '/survey/result/:resultId/publish');
  r('./survey/result/unpublish', '/survey/result/:resultId/unpublish');
  r('./survey/result/unconfirm', '/survey/result/:resultId/unconfirm');
  r('./survey/result/delete', '/survey/result/:surveyResultId');
  r('./survey/result/get', '/survey/result/:surveyResultId');
  r('./survey/list-sections', '/survey/sections');
  r('./survey/list-buckets', '/survey/buckets');
  r('./survey/list-types', '/survey/types');
  r('./survey/list-response-types', '/survey/response-types');
  r('./survey/result/survey-to-html', '/survey/survey-to-html/:surveyResultId');
  r('./survey/result/survey-to-pdf', '/survey/survey-to-pdf/:surveyResultId');
  r('./survey/result/sign-pdf', '/survey/sign-pdf/:surveyResultId');
  r('./survey/result/update-pdf-signature', '/survey/update-pdf-signature/:surveyResultId');
  r('./survey/result/matching-products', '/survey/matching-products/:surveyResultId');
  r('./survey/result/inquiry-list', '/survey/result/inquiry-list/:customerId');
  r('./survey/result/global-inquiry-list', '/survey/result/inquiry-list');
  r('./survey/result/inquiry-list-new', '/survey/result/inquiry-list-new/:customerId');
  r('./survey/result/global-inquiry-list-new', '/survey/result/inquiry-list-new');

  // CONSULTING
  r('./consulting/get', '/consulting/:resultId');
  r('./consulting/update', '/consulting/:resultId');
  r('./consulting/create-pdf', '/consulting/:resultId/create-pdf');
  r('./consulting/update-pdf-signature', '/consulting/:resultId/update-pdf-signature');
  r('./consulting/list', '/consulting/list/:customerId');
  r('./consulting/global-consulting-list', '/consulting-list');

  // DOCUMENTS ONBOARDING
  r('./survey/onboarding/scheda-anagrafica-to-html', '/survey/scheda-anagrafica-to-html/:surveyResultId');
  r('./survey/onboarding/scheda-valutazione-to-html', '/survey/scheda-valutazione-to-html/:surveyResultId');
  r('./survey/onboarding/ricevuta-cod-etico-to-html', '/survey/ricevuta-cod-etico-to-html/:surveyResultId');
  r('./survey/onboarding/ricevuta-info-sicurezza-to-html', '/survey/ricevuta-info-sicurezza-to-html/:surveyResultId');
  r('./survey/onboarding/autocert-per-fisica-to-html', '/survey/autocert-per-fisica-to-html/:surveyResultId');
  r('./survey/onboarding/autocert-per-giuridica-to-html', '/survey/autocert-per-giuridica-to-html/:surveyResultId');
  r('./survey/onboarding/collaboratori-occasionali-to-html', '/survey/col-occasionali-to-html/:surveyResultId');
  r('./survey/onboarding/atto-nomina-to-html', '/survey/atto-nomina-to-html/:surveyResultId');

  r('./survey/onboarding/scheda-anagrafica-to-pdf', '/survey/scheda-anagrafica-to-pdf/:surveyResultId');
  r('./survey/onboarding/scheda-valutazione-to-pdf', '/survey/scheda-valutazione-to-pdf/:surveyResultId');
  r('./survey/onboarding/ricevuta-cod-etico-to-pdf', '/survey/ricevuta-cod-etico-to-pdf/:surveyResultId');
  r('./survey/onboarding/ricevuta-info-sicurezza-to-pdf', '/survey/ricevuta-info-sicurezza-to-pdf/:surveyResultId');
  r('./survey/onboarding/autocert-per-fisica-to-pdf', '/survey/autocert-per-fisica-to-pdf/:surveyResultId');
  r('./survey/onboarding/autocert-per-giuridica-to-pdf', '/survey/autocert-per-giuridica-to-pdf/:surveyResultId');
  r('./survey/onboarding/collaboratori-occasionali-to-pdf', '/survey/col-occasionali-to-pdf/:surveyResultId');
  r('./survey/onboarding/atto-nomina-to-pdf', '/survey/atto-nomina-to-pdf/:surveyResultId');

  // WORKFLOW
  r('./workflow/list', '/workflow');
  r('./workflow/get', '/workflow/:workflowId');
  r('./workflow/next-state', '/workflow/next');
  r('./workflow/upload-attachment', '/workflow/upload/:entityId');
  r('./workflow/list-attachment', '/workflow/attachment/:entityId');
  r('./workflow/add-document', '/workflow/attachment/:entityId/:attachmentId');
  r('./workflow/delete-document', '/workflow/attachment/:entityId/:attachmentId');

  logger.trace('API registered');
  next();
};

module.exports = root;
