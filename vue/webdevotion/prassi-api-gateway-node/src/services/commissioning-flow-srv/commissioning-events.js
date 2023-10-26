const events = {
  ADD_DOSSIER_INSTALLMENT: 'add-practice-installment',
  REMOVE_DOSSIER_INSTALLMENT: 'remove-practice-installment',
  PROCESS: 'process',
  CONFIRM: 'confirm',
  ROLLBACK_ERROR: 'rollback-error',
  ROLLBACK: 'rollback',
  ROLLBACK_CLOSE: 'rollback-close',
  COMPLETED_ROLLBACK: 'completed-rollback',
  COMPLETED_ROLLBACK_CLOSE: 'completed-rollback-close',
  COMPLETED_ROLLBACK_ERROR: 'completed-rollback-error',
  OPEN_ERROR: 'open-error',
  CLOSE: 'close',
  RE_OPEN: 're-open',
  RESET: 'reset',
  START_ROLLBACK: 'start-rollback',
  START_ROLLBACK_CLOSE: 'start-rollback-close',
  COMPLETED_PREPARE_ROLLBACK: 'complete-rollback-error',
};

module.exports = {
  events,
};
