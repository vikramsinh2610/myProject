// @ts-nocheck
const Mongo = require('mongodb');
const knex = require('knex');
const CommissioningFlowService = require('../../services/commissioning-flow-srv');
const LogEvent = require('../../services/commissioning-flow-srv/log-event');
const logRepository = require('../../services/commissioning-flow-srv/log-repository');
const { unparse } = require('../../utils/productive-period-helper');
const sync = require('../../services/commissioning-flow-srv/commissioning-sync');
const config = require('../../config');
const logger = require('../../services/logger-srv')();
// const moment = require('moment');
// const personRepository = require("../../services/person-srv/person-repository");
// const CustomerSync = require("../../services/customer-srv/customer-sync");
// const myunparse = require('uuid-parse').unparse;


// eslint-disable-next-line consistent-return
process.on('message', async (msg = {}) => {
  const db = await Mongo.connect(config.mongodb.url, { useNewUrlParser: config.mongodb.useNewUrlParser }).then(
    async (client) => client.db(),
  );
  // @ts-ignore
  const sql = knex(config.knex);
  // @ts-ignore
  const sqlReader = knex(config.knex_reader);

  const commissioningFlowService = new CommissioningFlowService(db, msg.edition, sql, sqlReader);

  // eslint-disable-next-line sonarjs/no-small-switch
  switch (msg.action) {
    case 'openCommissioning':
      logger.info('Forked process for openCommissioning');

      commissioningFlowService
        .confirm(msg.commissioningId, msg.state)
        .then((state) => {
          logger.info('commissioning confirmed');
          logRepository.insert(
            db,
            new LogEvent({
              idCommissioning: msg.commissioningId,
              description: `FINE commissioning ${msg.commissioningId}`,
            }),
          );
          // @ts-ignore
          return process.send(state);
        })
        .catch((error) => {
          logger.info('confirm commissioning error');
          logger.info(error);
          logRepository.insert(
            db,
            new LogEvent({
              idCommissioning: msg.commissioningId,
              description: `ERRORE commissioning ${msg.commissioningId}: ${error.message}`,
            }),
          );
          // @ts-ignore
          return process.send(error.message);
        });
      break;

    case 'resetCommissioning':
      logger.info('Forked process for resetCommissioning');

      try {
        await commissioningFlowService.prepareRollback(msg.commissioningId);

        const newState = await commissioningFlowService.rollback(msg.commissioningId);

        logger.info('reset commissioning confirmed');
        logRepository.insert(
          db,
          new LogEvent({
            idCommissioning: msg.commissioningId,
            description: `FINE RESET commissioning ${msg.commissioningId}`,
          }),
        );
        // @ts-ignore
        return process.send(newState);
      } catch (error) {
        logger.info('reset commissioning error');
        logger.info(error);
        logRepository.insert(
          db,
          new LogEvent({
            idCommissioning: msg.commissioningId,
            description: `ERRORE RESET commissioning ${msg.commissioningId}: ${error.message}`,
          }),
        );
        // @ts-ignore
        return process.send(error.message);
      }

    case 'rollbackCommissioning':
      logger.info('Forked process for rollbackCommissioning');

      try {
        const newState = await commissioningFlowService.rollback(msg.commissioningId);

        logger.info('rollback commissioning completed');
        logRepository.insert(
          db,
          new LogEvent({
            idCommissioning: msg.commissioningId,
            description: `FINE ROLLBACK commissioning ${msg.commissioningId}`,
          }),
        );
        // @ts-ignore
        return process.send(newState);
      } catch (error) {
        logger.info('rollback commissioning error');
        logger.info(error);
        logRepository.insert(
          db,
          new LogEvent({
            idCommissioning: msg.commissioningId,
            description: `ERRORE ROLLBACK commissioning ${msg.commissioningId}: ${error.message}`,
          }),
        );
        // @ts-ignore
        return process.send(error.message);
      }

    case 'rollbackCloseCommissioning':
      logger.info('Forked process for rollbackCloseCommissioning');

      try {
        const newState = await commissioningFlowService.rollbackClose(msg.commissioningId);

        logger.info('rollback close commissioning completed');
        logRepository.insert(
          db,
          new LogEvent({
            idCommissioning: msg.commissioningId,
            description: `FINE ROLLBACK CLOSED commissioning ${msg.commissioningId}`,
          }),
        );
        // @ts-ignore
        return process.send(newState);
      } catch (error) {
        logger.info('rollback closed commissioning error');
        logRepository.insert(
          db,
          new LogEvent({
            idCommissioning: msg.commissioningId,
            description: `ERRORE ROLLBACK CLOSED commissioning ${msg.commissioningId}: ${error.message}`,
          }),
        );
        // @ts-ignore
        return process.send(error.message);
      }

    case 'sync':
      logger.info('Forked process for sync');

      try {
        logger.error('start sync');
        // eslint-disable-next-line no-unused-vars
        const { productivePeriodYear, productivePeriodMonth } = unparse(msg.commissioningId);

        await sync.syncDossiers(db, sql, productivePeriodYear, productivePeriodMonth, msg.edition);
        logger.error('end syncDossiers');
        await (msg.override === true
          ? sync.syncCustomersForce(db, productivePeriodYear, productivePeriodMonth)
          : sync.syncCustomers(db, productivePeriodYear, productivePeriodMonth));
        logger.error('end syncCustomers');
        await sync.syncPractices(db, sql, msg.edition, productivePeriodYear, productivePeriodMonth, msg.override);
        logger.error('end syncPractices');
        await sync.syncSheltiaIV(db, sql, msg.edition, productivePeriodYear, productivePeriodMonth);
        logger.error('end syncSheltiaIV');
        await sync.syncManagementFee(db, productivePeriodYear, productivePeriodMonth, logger, msg.edition);
        logger.error('end syncManagementFee');

        logger.error('start syncNetworkPg');
        await sync.syncNetworkPg(db, sql, productivePeriodYear, productivePeriodMonth);
        logger.error('end syncNetworkPg');

        logger.error('start syncCustomersOwnerPg');
        await sync.syncCustomersOwnerPg(db, sql, productivePeriodYear, productivePeriodMonth);
        logger.error('end syncCustomersOwnerPg');

        logger.error('start syncPracticeOwnerPg');
        await sync.syncPracticeOwnerPg(db, sql, productivePeriodYear, productivePeriodMonth);
        logger.error('end syncPracticeOwnerPg');
        logger.error('end sync');

        // const incomeTransactions = await db
        //   .collection('BasePraticaApprovable')
        //   .aggregate([
        //     {
        //       $match: {
        //         CreatedOn: {
        //           $gt:  moment(`28-10-2022`, 'DD-MM-YYYY').toDate(),
        //         },
        //         _t: 'PraticaIncasso',
        //         'DatiProdotto.NomeCompagnia': 'DARTA SAVING LIFE ASSURANCE',
        //       },
        //     },
        //     {
        //       $group: {
        //         _id: {
        //           NumeroPratica: '$DatiBase.NumeroPratica',
        //           periodoAnno: '$StatoCorrente.PeriodoProduttivo.Anno',
        //           periodoMese: '$StatoCorrente.PeriodoProduttivo.Mese',
        //         },
        //         dups: {
        //           $push: '$_id',
        //         },
        //         creationTimestamp: {
        //           $push: '$CreatedOn',
        //         },
        //         count: { $sum: 1 },
        //       },
        //     },
        //     {
        //       $match: {
        //         _id: {
        //           $ne: null,
        //         },
        //         count: {
        //           $gt: 1,
        //         },
        //       },
        //     },
        //   ])
        //   .toArray()
        //   .then(async (docs) => {
        //     // @ts-ignore
        //     // eslint-disable-next-line sonarjs/no-identical-functions
        //     await docs.forEachAsync(async (doc) => {
        //       let i = 0;
        //       console.log(doc._id);
        //       console.log(doc.dups.length);
        //       await doc.dups.forEachAsync(async (thisId) => {
        //         if(i !== 0) {
        //           console.log(myunparse(thisId.buffer));
        //           await db.collection('BasePraticaApprovable').deleteMany({_id : thisId});
        //           await sql('practice').del().where('uuid', myunparse(thisId.buffer));
        //         }
        //         i += 1;
        //       });
        //     });
        //
        //   });

        // logger.error('start syncSurveyResultsPG');
        // await sync.syncCustomersPg(db, sql);
        // await sync.syncSurveyResultsPG(db, sql);
        // logger.error('end syncSurveyResultsPG');

        logger.info('sync completed');
        logRepository.insert(
          db,
          new LogEvent({
            idCommissioning: msg.commissioningId,
            description: `FINE SYNC PERIODO ${msg.commissioningId}`,
          }),
        );
        // @ts-ignore
        return process.send(msg.commissioningId);
      } catch (error) {
        logger.info('sync error');
        logRepository.insert(
          db,
          new LogEvent({
            idCommissioning: msg.commissioningId,
            description: `ERRORE SYNC PERIODO ${msg.commissioningId}: ${error.message}`,
          }),
        );
        // @ts-ignore
        return process.send(error.message);
      }

    case 'exportCommissioningExcelInstallments':
      logger.info('Forked process for exportCommissioningExcelInstallments');

      try {
        // @ts-ignore
        const newState = await commissioningFlowService.exportResultInstalmments(
          msg.commissioningId,
          msg.exportId,
          msg.myUserId,
          msg.edition,
        );

        // @ts-ignore
        return process.send(newState);
      } catch (error) {
        logger.info('export excel commissioning installments error');
        logRepository.insert(
          db,
          new LogEvent({
            idCommissioning: msg.commissioningId,
            description: `ERRORE EXPORT EXCEL installments commissioning ${msg.commissioningId}: ${error.message}`,
          }),
        );
        // @ts-ignore
        return process.send(error.message);
      }

    case 'exportCommissioningExcel':
      logger.info('Forked process for exportCommissioningExcel');

      try {
        // @ts-ignore
        const newState = await commissioningFlowService.exportResult(msg.commissioningId, msg.exportId, msg.myUserId);

        // @ts-ignore
        return process.send(newState);
      } catch (error) {
        logger.info('export excel commissioning error');
        logRepository.insert(
          db,
          new LogEvent({
            idCommissioning: msg.commissioningId,
            description: `ERRORE EXPORT EXCEL commissioning ${msg.commissioningId}: ${error.message}`,
          }),
        );
        // @ts-ignore
        return process.send(error.message);
      }

    default:
      // @ts-ignore
      return process.send('noop');
  }
});
