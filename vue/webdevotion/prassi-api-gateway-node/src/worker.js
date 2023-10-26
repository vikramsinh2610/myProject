const cron = require('node-cron');
// eslint-disable-next-line security/detect-child-process
const { fork } = require('child_process');
const logger = require('./services/logger-srv')();

module.exports = () => {
  if (process.env.CRON_ACTIVE) {
    const everyDay = '0 0 0 * * *';
    if (!cron.validate(everyDay)) logger.fatal('Invalid cron schedule');

    const cronTask = cron.schedule(everyDay, () => {
      logger.info('Forking process for sync-legacy cron');
      fork('./src/cron/sync-legacy.js');
      logger.info('Forked process for sync-legacy cron');
    });
    cronTask.start();
  }
};
