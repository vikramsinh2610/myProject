// @ts-nocheck
const Mongo = require('mongodb');
const LogEvent = require('../../services/commissioning-flow-srv/log-event');
const logRepository = require('../../services/commissioning-flow-srv/log-repository');
const config = require('../../config');
const logger = require('../../services/logger-srv')();
const CustomerService = require('../../services/customer-srv');

// eslint-disable-next-line consistent-return
process.on('message', async (msg) => {
  logger.info('workerlib message');

  const db = await Mongo.connect(config.mongodb.url, {
    useNewUrlParser: config.mongodb.useNewUrlParser,
  }).then(async (client) => client.db());

  const customerService = new CustomerService(db);

  // eslint-disable-next-line sonarjs/no-small-switch
  switch (msg.action) {
    case 'exportCustomersExcel':
      logger.error('Forked process for exportCustomersExcel');

      customerService
        .exportCustomers(
          msg.myRoleId,
          msg.myUserId,
          msg.productivePeriodYear,
          msg.productivePeriodMonth,
          msg.edition,
          msg.exportId,
          msg.searchCustomer,
          msg.promoterId,
          msg.birthday,
          msg.contactType,
          msg.status,
          msg.networkId,
          msg.type,
          msg.fromProductivePeriodYear,
          msg.fromProductivePeriodMonth,
          msg.toProductivePeriodYear,
          msg.toProductivePeriodMonth,
        )
        .then((state) => {
          logger.error('export customers done');
          logRepository.insert(
            db,
            new LogEvent({
              description: `FINE export customers`,
            }),
          );
          // @ts-ignore
          return process.send(state);
        })
        .catch((error) => {
          logger.error('export customers error');
          logger.error(error);
          logRepository.insert(
            db,
            new LogEvent({
              idCommissioning: msg.commissioningId,
              description: `ERRORE export customers: ${error.message}`,
            }),
          );
          // @ts-ignore
          return process.send(error.message);
        });
      break;

    case 'exportCustomersIdentityCardsExcel':
      logger.error('Forked process for exportCustomersExcel');

      customerService
        .exportCustomersIdentityCards(
          msg.myRoleId,
          msg.myUserId,
          msg.productivePeriodYear,
          msg.productivePeriodMonth,
          msg.edition,
          msg.exportId,
          msg.searchCustomer,
          msg.promoterId,
          msg.birthday,
          msg.contactType,
          msg.status,
          msg.networkId,
          msg.type,
          msg.fromProductivePeriodYear,
          msg.fromProductivePeriodMonth,
          msg.toProductivePeriodYear,
          msg.toProductivePeriodMonth,
          msg.expired,
          msg.complete,
        )
        // eslint-disable-next-line sonarjs/no-identical-functions
        .then((state) => {
          logger.error('export customers done');
          logRepository.insert(
            db,
            new LogEvent({
              description: `FINE export customers`,
            }),
          );
          // @ts-ignore
          return process.send(state);
        })
        // eslint-disable-next-line sonarjs/no-identical-functions
        .catch((error) => {
          logger.error('export customers error');
          logger.error(error);
          logRepository.insert(
            db,
            new LogEvent({
              idCommissioning: msg.commissioningId,
              description: `ERRORE export customers: ${error.message}`,
            }),
          );
          // @ts-ignore
          return process.send(error.message);
        });
      break;

    default:
      // @ts-ignore
      return process.send('noop');
  }
});
