const sync = require('../../services/commissioning-flow-srv/commissioning-sync');
const errorHandler = require('../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Sync Dossiers Insurer',
      description: 'Sync Dossiers Insurer',
      tags: ['dossiers'],
      querystring: {
        type: 'object',
        required: ['productivePeriodYear', 'productivePeriodMonth'],
        properties: {
          productivePeriodYear: {
            type: 'integer',
            description: 'To productive period - year',
          },
          productivePeriodMonth: {
            type: 'integer',
            description: 'To productive period - month',
          },
        },
      },
    },
  };

  fastify.post(
    '/',
    options,
    // eslint-disable-next-line sonarjs/cognitive-complexity
    errorHandler(async (request, reply) => {
      const sql = fastify.knex;
      const { db } = fastify.mongo;

      try {
        fastify.log.error('start sync dossiers');
        await sync.syncPracticeOwnerPg(
          db,
          sql,
          request.query.productivePeriodYear,
          request.query.productivePeriodMonth,
        );
        fastify.log.error('end sync dossiers');

        reply.send();
      } catch (error) {
        reply.send(error);
      }
    }),
  );
  next();
};
