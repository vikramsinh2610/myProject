const Acquittance = require('./acquittance');
const { statuses } = require('./acquittance-statuses');
const { events } = require('./acquittance-events');

/**
 * @param {Acquittance} state
 * @returns {Acquittance}
 */
function initState(state) {
  return new Acquittance({
    ...state,
    status: statuses.CREATED,
    didCreatedDate: new Date(Date.now()),
  });
}

/**
 * @param {string} event
 * @param {Acquittance} state
 * @returns {Acquittance}
 */
function trigger(event, state) {
  switch (event) {
    case events.REFRESH:
      if (state.status === statuses.CREATED) {
        return new Acquittance({ ...state });
      }
      break;

    case events.UPDATE:
      return new Acquittance({
        ...state,
      });

    case events.DELETE:
      return new Acquittance({
        ...state,
        status: statuses.DELETED,
      });

    case events.CONFIRM:
      if (state.status === statuses.CREATED) {
        return new Acquittance({
          ...state,
          status: statuses.CONFIRMED,
          didConfirmedDate: new Date(Date.now()),
        });
      }
      break;

    case events.UNCONFIRM:
      if (state.status === statuses.CONFIRMED) {
        return new Acquittance({
          ...state,
          status: statuses.CREATED,
          didConfirmedDate: undefined,
        });
      }
      break;

    default:
      throw new Error(`Invalid event ${event}`);
  }
  throw new Error('Operazione non valida');
}

module.exports = {
  trigger,
  initState,
};
