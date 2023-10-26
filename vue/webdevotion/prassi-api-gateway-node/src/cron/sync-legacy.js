/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable unicorn/no-process-exit */
const Mongo = require('mongodb');
const knex = require('knex');
const mandrill = require('mandrill-api');
const logger = require('../services/logger-srv')();
const config = require('../config');
const sync = require('../services/commissioning-flow-srv/commissioning-sync');
const LogEvent = require('../services/commissioning-flow-srv/log-event');
const logRepository = require('../services/commissioning-flow-srv/log-repository');
const { unparse, addMonths, parse } = require('../utils/productive-period-helper');
const MailService = require('../services/mail-srv');

const now = new Date(Date.now());
const nowPeriodYear = now.getUTCFullYear();
const nowPeriodMonth = now.getUTCMonth() + 1;

const start = Date.now();
logger.info('Sync Legacy Cron started');

Mongo.connect(config.mongodb.url, { useNewUrlParser: config.mongodb.useNewUrlParser })
  .then(async (client) => {
    const db = client.db();
    // @ts-ignore
    const sql = knex(config.knex);

    let i;
    for (i = 1; i <= 4; i += 1) {
      const { productivePeriodYear, productivePeriodMonth } = unparse(
        addMonths(parse(nowPeriodYear, nowPeriodMonth), -i),
      );

      logRepository.insert(
        db,
        new LogEvent({
          description: `LEGACY SYNC ${productivePeriodYear} ${productivePeriodMonth}`,
        }),
      );

      try {
        await sync.syncDossiers(db, sql, productivePeriodYear, productivePeriodMonth, config.fastify.edition);
        logger.error('Sync dossiers completed');
        await sync.syncCustomers(db, productivePeriodYear, productivePeriodMonth);
        logger.error('Sync customers completed');
        await sync.syncPractices(db, sql, config.fastify.edition, productivePeriodYear, productivePeriodMonth);
        logger.error('Sync practices completed');
        await sync.syncSheltiaIV(db, sql, config.fastify.edition, productivePeriodYear, productivePeriodMonth);
        logger.error('Sync IV completed');
        await sync.syncManagementFee(db, productivePeriodYear, productivePeriodMonth, logger);
        logger.error('Sync managent fee completed');

        logger.error('start syncNetworkPg');
        await sync.syncNetworkPg(db, sql,  productivePeriodYear, productivePeriodMonth);
        logger.error('end syncNetworkPg');

        logger.error('start syncCustomersOwnerPg');
        await sync.syncCustomersOwnerPg(db, sql,  productivePeriodYear, productivePeriodMonth);
        logger.error('end syncCustomersOwnerPg');

        logger.error('start syncPracticeOwnerPg');
        await sync.syncPracticeOwnerPg(db, sql,  productivePeriodYear, productivePeriodMonth);
        logger.error('end syncPracticeOwnerPg');

        const ms = Date.now() - start;
        logger.info(`Sync Legacy Cron completed successfully in ${ms / 1000} seconds`);
      } catch (error) {
        logRepository.insert(
          db,
          new LogEvent({
            description: `ERRORE LEGACY SYNC ${productivePeriodYear} ${productivePeriodMonth} ${error}`,
          }),
        );
      }
    }

    let k;
    for (k = 0; k <= 3; k += 1) {
      const { productivePeriodYear, productivePeriodMonth } = unparse(
        addMonths(parse(nowPeriodYear, nowPeriodMonth), k),
      );

      logRepository.insert(
        db,
        new LogEvent({
          description: `LEGACY SYNC ${productivePeriodYear} ${productivePeriodMonth}`,
        }),
      );

      try {
        if (k === 0) {
          await sync.syncCustomersFirst(db);
          await sync.syncCustomers(db, productivePeriodYear, productivePeriodMonth);
        }
        await sync.syncDossiers(db, sql, productivePeriodYear, productivePeriodMonth, config.fastify.edition);
        logger.error('Sync dossiers completed');
        logger.error('Sync customers completed');
        await sync.syncPractices(db, sql, config.fastify.edition, productivePeriodYear, productivePeriodMonth);
        logger.error('Sync practices completed');
        await sync.syncSheltiaIV(db, sql, config.fastify.edition, productivePeriodYear, productivePeriodMonth);
        logger.error('Sync IV completed');
        await sync.syncManagementFee(db, productivePeriodYear, productivePeriodMonth, logger);
        logger.error('Sync managent fee completed');

        logger.error('start syncNetworkPg');
        await sync.syncNetworkPg(db, sql,  productivePeriodYear, productivePeriodMonth);
        logger.error('end syncNetworkPg');

        logger.error('start syncCustomersOwnerPg');
        await sync.syncCustomersOwnerPg(db, sql,  productivePeriodYear, productivePeriodMonth);
        logger.error('end syncCustomersOwnerPg');

        logger.error('start syncPracticeOwnerPg');
        await sync.syncPracticeOwnerPg(db, sql,  productivePeriodYear, productivePeriodMonth);
        logger.error('end syncPracticeOwnerPg');

        const ms = Date.now() - start;
        logger.info(`Sync Legacy Cron completed successfully in ${ms / 1000} seconds`);
      } catch (error) {
        logRepository.insert(
          db,
          new LogEvent({
            description: `ERRORE LEGACY SYNC ${productivePeriodYear} ${productivePeriodMonth} ${error}`,
          }),
        );
      }
    }

    logger.error('start syncCustomersPg');
    await sync.syncCustomersPg(db, sql);
    logger.error('end syncCustomersPg');

    logger.error('start syncSurveyResultsPG');
    await sync.syncSurveyResultsPG(db, sql);
    logger.error('end syncSurveyResultsPG');

    logger.error('start syncCustomerIdentityCards');
    await sync.syncCustomerIdentityCards(db, sql, config.fastify.edition);
    logger.error('end syncCustomerIdentityCards');

    const customersNotFound = await sync.checkCustomersInsurer(db);

    if (process.env.SYNC_DUPLICATED_CUSTOMERS === 'YES') {
      await sync.checkDuplicatedCustomers(db, sql);
    }

    const Mandrill = new mandrill.Mandrill(process.env.MANDRILL_API_KEY || '');
    const mailService = new MailService(
      Mandrill,
      process.env.URL || '',
      process.env.EDITION || '',
      process.env.ENV || 'development',
    );

    if (customersNotFound.length > 0) {
      await mailService.sendCustomerInsurerMail(customersNotFound);
    }

    return process.exit(0);
  })
  .catch((error) => {
    logger.error('Sync Legacy Cron error', error);
    process.exit(1);
  });
