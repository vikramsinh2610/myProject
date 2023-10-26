const sync = require('../../services/commissioning-flow-srv/commissioning-sync');
const errorHandler = require('../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Sync Network',
      description: 'Sync Network',
      tags: ['network'],
      querystring: {
        type: 'object',
        required: [
          'productivePeriodYear',
          'productivePeriodMonth',
        ],
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
        fastify.log.error('start sync network');
        await sync.syncNetworkPg(db, sql, request.query.productivePeriodYear, request.query.productivePeriodMonth);
        fastify.log.error('end fixNetworkPg');

        reply.send();
      } catch (error) {
        reply.send(error);
      }
    }),
  );
  next();
};
