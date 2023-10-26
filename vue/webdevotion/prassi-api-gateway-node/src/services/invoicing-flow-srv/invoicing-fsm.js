const InvoicingState = require('./invoicing-state');
const { statuses } = require('./invoicing-statuses');
const { events } = require('./invoicing-events');

/**
 * @param {InvoicingState|object} state
 * @returns {InvoicingState}
 */
function initState(state) {
  const { productivePeriodYear, productivePeriodMonth, invoices, issueDate, dueDate } = state;
  return new InvoicingState({
    productivePeriodYear,
    productivePeriodMonth,
    invoices,
    status: statuses.PROCESSING,
    didOpenedDate: new Date(Date.now()),
    issueDate,
    dueDate,
  });
}

/**
 * @param {string} event
 * @param {InvoicingState} state
 * @param {object} payoload
 * @param {object} [payoload.invoiceId]
 * @returns {InvoicingState}
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function trigger(event, state, { invoiceId = '' }) {
  switch (event) {
    case events.UNCONFIRM_INVOICE:
      if (state.status === statuses.OPENED) {
        const invoice = state.invoices.find((i) => i._id === invoiceId);
        if (invoice) {
          invoice.confirmed = false;
        }
        return state;
      }
      break;

    case events.CONFIRM_INVOICE:
      if (state.status === statuses.OPENED) {
          const invoice = state.invoices.find((i) => i._id === invoiceId);
          if (invoice) {
            invoice.confirmed = true;
          }
          return state;
        }
      break;

    case events.OPEN:
      if (state.status === statuses.PROCESSING || state.status === statuses.PREVIEW_PROCESSING) {
        return {
          ...state,
          status: statuses.OPENED,
        };
      }
      break;

    case events.ERROR:
      if (state.status === statuses.PROCESSING) {
        return {
          ...state,
          status: statuses.OPENED_ERROR,
        };
      }
      break;

    case events.ERROR_PREVIEW:
      if (state.status === statuses.PREVIEW_PROCESSING) {
        return {
          ...state,
          status: statuses.PREVIEW_ERROR,
        };
      }
      break;

    case events.ERROR_CLOSING:
      if (state.status === statuses.CLOSE_PROCESSING) {
        return {
          ...state,
          status: statuses.CLOSING_ERROR,
        };
      }
      break;

    case events.PROCESS_CLOSE:
      if (state.status === statuses.OPENED) {
        return {
          ...state,
          status: statuses.CLOSE_PROCESSING,
        };
      }
      break;

    case events.PROCESS:
      if (state.status === statuses.OPENED || state.status === statuses.OPENED_ERROR) {
        return {
          ...state,
          status: statuses.PROCESSING,
        };
      }
      break;

    case events.ROLLBACKED:
      if (state.status === statuses.PROCESSING) {
        return {
          ...state,
          invoices: [],
          documentIds: [],
          documentIdsPreview: [],
          stats: { gross: 0, net: 0, tax: 0, promoterNumber: 0 },
          status: statuses.PROCESSING,
        };
      }
      break;

    case events.PROCESS_PREVIEW:
      if (state.status === statuses.OPENED || state.status === statuses.PREVIEW_ERROR) {
        return {
          ...state,
          status: statuses.PREVIEW_PROCESSING,
        };
      }
      break;

    case events.CLOSE:
      if (state.status === statuses.CLOSE_PROCESSING) {
        return {
          ...state,
          status: statuses.CLOSED,
          didClosedDate: new Date(Date.now()),
        };
      }
      break;

    default:
      throw new Error(`Evento non valido ${event}`);
  }
  throw new Error('Operazione non valida');
}

module.exports = {
  trigger,
  initState,
};
