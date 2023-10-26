// @ts-nocheck
const Mongo = require('mongodb');
const knex = require('knex');
const LogEvent = require('../../../services/commissioning-flow-srv/log-event');
const KpiService = require('../../../services/kpi-srv');
const logRepository = require('../../../services/commissioning-flow-srv/log-repository');
const config = require('../../../config');
const logger = require('../../../services/logger-srv')();

// eslint-disable-next-line consistent-return
process.on('message', async (msg) => {
  logger.info('workerlib message');
  logger.info(msg.action);
  logger.info(msg);

  const db = await Mongo.connect(config.mongodb.url, {
    useNewUrlParser: config.mongodb.useNewUrlParser,
  }).then(async (client) => client.db());

  // @ts-ignore
  const sql = knex(config.knex);

  logRepository.insert(
    db,
    new LogEvent({
      idCommissioning: msg.commissioningId,
      description: `export production action: ${msg.action}`,
    }),
  );

  const kpiService = new KpiService(db, sql);

  // eslint-disable-next-line sonarjs/no-small-switch
  switch (msg.action) {
    case 'exportSheltiaProductionExcel':
      logger.error('Forked process for exportSheltiaProductionExcel');

      kpiService
        .exportProduction(
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
          msg.contractSearch,
          msg.commissionType,
          msg.companyId,
          msg.productId,
          msg.fullSearch,
          msg.solarSearch,
        )
        .then((state) => {
          logger.error('export production done');
          logRepository.insert(
            db,
            new LogEvent({
              description: `FINE export production`,
            }),
          );
          // @ts-ignore
          return process.send(state);
        })
        .catch((error) => {
          logger.error('export production error');
          logger.error(error);
          logRepository.insert(
            db,
            new LogEvent({
              idCommissioning: msg.commissioningId,
              description: `ERRORE export production: ${error.message}`,
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
