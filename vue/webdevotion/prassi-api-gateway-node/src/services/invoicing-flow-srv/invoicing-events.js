const events = {
  CONFIRM_INVOICE: 'confirm-invoice',
  UNCONFIRM_INVOICE: 'unconfirm-invoice',
  OPEN: 'open',
  ERROR: 'error',
  ROLLBACKED: 'rollbacked',
  ERROR_CLOSING: 'error-closing',
  ERROR_PREVIEW: 'error-preview',
  CLOSE: 'close',
  PROCESS: 'process',
  PROCESS_CLOSE: 'process-close',
  PROCESS_PREVIEW: 'process-preview',
};

module.exports = {
  events,
};
