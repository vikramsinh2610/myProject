const sync = require('../../services/commissioning-flow-srv/commissioning-sync');
const errorHandler = require('../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
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
        fastify.log.error('start sync');
        // await sync.syncCustomersAndOwnersPg(db, sql);
        await sync.syncCustomersPg(db, sql);
        fastify.log.error('end fixCustomersPg');

        reply.send();
      } catch (error) {
        reply.send(error);
      }
    }),
  );
  next();
};
