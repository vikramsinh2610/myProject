const sync = require('../../services/commissioning-flow-srv/commissioning-sync');
const errorHandler = require('../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Customers List',
      description: 'Get Customers list',
      tags: ['customers'],
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
        fastify.log.error('start sync documents');
        await sync.syncCustomerIdentityCards(db, sql, fastify.edition);
        fastify.log.error('end sync documents');

        reply.send();
      } catch (error) {
        reply.send(error);
      }
    }),
  );
  next();
};
