const BonusLetter = require('./bonus/bonus-letter');
const ManagementFeeLetter = require('./management-fee/management-fee-letter');
const PrivacyLetter = require('./privacy/privacy-letter');
const JobLetter = require('./job/job-letter');
const Letter = require('./letter');

const { statuses } = require('./letter-statuses');
const { events } = require('./letter-events');

/**
 * @param {Letter|BonusLetter|ManagementFeeLetter|PrivacyLetter|JobLetter} state
 * @returns {Letter|BonusLetter|ManagementFeeLetter|PrivacyLetter|JobLetter}
 */
function initState(state) {
  return {
    ...state,
    status: statuses.WIP,
    didCreateDate: new Date(Date.now()),
    didActiveDate: undefined,
    didDeleteDate: undefined,
    didExpireDate: undefined,
  };
}

/**
 * @param {string} event
 * @param {Letter|BonusLetter|ManagementFeeLetter|PrivacyLetter|JobLetter} state
 * @returns {Letter|BonusLetter|ManagementFeeLetter|PrivacyLetter|JobLetter}
 */
function trigger(event, state) {
  switch (event) {
    case events.ACTIVATE:
      if (state.status === statuses.WIP) {
        return {
          ...state,
          status: statuses.ACTIVE,
          didActiveDate: new Date(Date.now()),
        };
      }
      break;

    case events.DELETE:
      if (state.status === statuses.WIP) {
        return {
          ...state,
          status: statuses.DELETED,
          didDeleteDate: new Date(Date.now()),
        };
      }
      break;

    case events.INACTIVATE:
      if (state.status === statuses.ACTIVE) {
        return {
          ...state,
          status: statuses.INACTIVE,
          didDeleteDate: new Date(Date.now()),
        };
      }
      break;

    case events.EXPIRES:
      if (state.status === statuses.ACTIVE) {
        return {
          ...state,
          status: statuses.EXPIRED,
          didExpireDate: new Date(Date.now()),
        };
      }
      break;

    default:
      throw new Error(`Invalid event ${event}`);
  }
  throw new Error('Invalid transaction');
}

module.exports = {
  trigger,
  initState,
};
