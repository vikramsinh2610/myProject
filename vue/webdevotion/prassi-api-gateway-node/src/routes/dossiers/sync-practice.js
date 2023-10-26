/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
const Mongo = require('mongodb');
const sync = require('../../services/commissioning-flow-srv/commissioning-sync');
const { toQuarter, unparse} = require('../../utils/productive-period-helper');
const AdjustedPremiumService = require('../../services/adjusted-premium-srv');
const PracticeService = require('../../services/practice-srv');
const ProductConfigurationService = require('../../services/product-configuration-srv');
const { dateToPeriod } = require('../../utils/productive-period-helper');

module.exports = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'Sync Customer Person',
      description: 'Sync Customers Person',
      tags: ['customers'],
    },
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  fastify.post('/', options, async (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;
    const sql = fastify.knex;
    const adjustedPremiumService = new AdjustedPremiumService(db);
    const practiceService = new PracticeService(db);
    const productConfigurationService = new ProductConfigurationService(db);
    const { productivePeriodYear, productivePeriodMonth } = unparse(dateToPeriod());

    try {
      fastify.log.error('start practice sync');
      const adjustment = await adjustedPremiumService.getById(toQuarter(productivePeriodYear, productivePeriodMonth));
      const practice = await practiceService.getPracticeByUuid(request.query.practiceId);
      const products = await productConfigurationService.getAll();

      await sync.syncPracticePg(db, sql, practice, adjustment, products, fastify.edition);

      reply.send();
    } catch (error) {
      reply.send(error);
    }
  });
  next();
};
