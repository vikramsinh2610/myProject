const CommissioningState = require('./commissioning-state');
const PracticeInstallmentReference = require('./practice-installment-reference');
const { statuses } = require('./commissioning-statuses');
const { events } = require('./commissioning-events');

/**
 * @param {CommissioningState|object} state
 * @returns {CommissioningState}
 */
function initState(state) {
  const { productivePeriodYear, productivePeriodMonth } = state;
  return new CommissioningState({
    productivePeriodYear,
    productivePeriodMonth,
    status: statuses.OPENED,
    didOpenedDate: new Date(Date.now()),
  });
}

/**
 * @param {string} event
 * @param {CommissioningState} state
 * @param {Array<PracticeInstallmentReference>} payload
 * @returns {CommissioningState}
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function trigger(event, state, payload = []) {
  switch (event) {
    case events.REMOVE_DOSSIER_INSTALLMENT:
      if (state.status === statuses.OPENED) {
        const filter = (installments, installment) =>
          installments.filter(
            (i) =>
              !(
                i.practiceId === installment.practiceId &&
                i.dossierId === installment.dossierId &&
                i.installment === installment.installment
              ),
          );
        let filtered = state.installments;
        payload.forEach((installment) => {
          filtered = filter(filtered, installment);
        });

        return {
          ...state,
          installments: filtered,
        };
      }
      break;

    case events.ADD_DOSSIER_INSTALLMENT:
      if (state.status === statuses.OPENED) {
        const newItems = [];
        payload.forEach((installment) => {
          if (
            state.installments.findIndex(
              (installments) =>
                installments.practiceId === installment.practiceId &&
                installments.dossierId === installment.dossierId &&
                installments.installment === installment.installment,
            ) === -1
          ) {
            newItems.push(installment);
          }
        });
        return {
          ...state,
          installments: [...state.installments, ...newItems],
        };
      }
      break;

    case events.CONFIRM:
      if (state.status === statuses.PROCESSING || state.status === statuses.ROLLBACKING) {
        return {
          ...state,
          status: statuses.CONFIRMED,
          didConfirmedDate: new Date(Date.now()),
        };
      }
      break;

    case events.PROCESS:
      if (state.status === statuses.OPENED) {
        return {
          ...state,
          status: statuses.PROCESSING,
          didProcessDate: new Date(Date.now()),
        };
      }
      break;

    case events.RESET:
      if (state.status === statuses.OPENED_ERROR) {
        return {
          ...state,
          status: statuses.PROCESSING,
          didProcessDate: new Date(Date.now()),
        };
      }
      break;

    case events.START_ROLLBACK:
      if (state.status === statuses.CONFIRMED) {
        return {
          ...state,
          status: statuses.ROLLBACK_STARTED,
          didProcessDate: new Date(Date.now()),
        };
      }
      break;

    case events.START_ROLLBACK_CLOSE:
      if (state.status === statuses.CLOSED) {
        return {
          ...state,
          status: statuses.ROLLBACK_CLOSE_STARTED,
          didProcessDate: new Date(Date.now()),
        };
      }
      break;

    case events.ROLLBACK_ERROR:
      if (state.status === statuses.PROCESSING) {
        return {
          ...state,
          status: statuses.ROLLBACKING_ERROR,
          didConfirmedDate: undefined,
        };
      }
      break;

    case events.COMPLETED_ROLLBACK_ERROR:
      if (state.status === statuses.ROLLBACKING_ERROR) {
        return {
          ...state,
          status: statuses.OPENED_ERROR,
          didConfirmedDate: undefined,
        };
      }
      break;

    case events.COMPLETED_PREPARE_ROLLBACK:
      if (state.status === statuses.PROCESSING) {
        return {
          ...state,
          status: statuses.OPENED_ERROR,
          didConfirmedDate: undefined,
        };
      }
      break;

    case events.OPEN_ERROR:
      if (state.status === statuses.OPENED_ERROR) {
        return {
          ...state,
          status: statuses.OPENED,
          didConfirmedDate: undefined,
        };
      }
      break;

    case events.ROLLBACK:
      if (
        state.status === statuses.ROLLBACK_STARTED ||
        state.status === statuses.OPENED_ERROR ||
        state.status === statuses.OPENED
      ) {
        return {
          ...state,
          status: statuses.ROLLBACKING,
          didConfirmedDate: undefined,
        };
      }
      break;

    case events.ROLLBACK_CLOSE:
      if ( state.status === statuses.ROLLBACK_CLOSE_STARTED) {
        return {
          ...state,
          status: statuses.ROLLBACKING,
          didConfirmedDate: undefined,
        };
      }
      break;

    case events.COMPLETED_ROLLBACK:
      if (state.status === statuses.ROLLBACKING) {
        return {
          ...state,
          status: statuses.OPENED,
          didConfirmedDate: undefined,
        };
      }
      break;

    case events.COMPLETED_ROLLBACK_CLOSE:
      if (state.status === statuses.ROLLBACKING) {
        return {
          ...state,
          status: statuses.CONFIRMED,
        };
      }
      break;

    case events.CLOSE:
      if (state.status === statuses.CONFIRMED) {
        return {
          ...state,
          status: statuses.CLOSED,
          didClosedDate: new Date(Date.now()),
        };
      }
      break;

    case events.RE_OPEN:
      if (state.status === statuses.CLOSED) {
        return {
          ...state,
          status: statuses.OPENED,
          didConfirmedDate: undefined,
        };
      }
      break;

    default:
      throw new Error(`Evento non valido ${event}`);
  }
  throw new Error('Operazione non permessa');
}

module.exports = {
  trigger,
  initState,
};
