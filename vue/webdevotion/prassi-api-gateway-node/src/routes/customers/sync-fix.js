/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
const Mongo = require('mongodb');
const sync = require('../../services/commissioning-flow-srv/commissioning-sync');

module.exports = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'Sync Customers',
      description: 'Sync Customers',
      tags: ['customers'],
    },
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  fastify.post('/', options, async (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;
    const sql = fastify.knex;

    try {
      fastify.log.error('start sync');
      // await sync.fixCustomersSync(db);
      // await sync.syncCustomerIdentityCards(db, sql, fastify.edition);
      await sync.checkDuplicatedCustomers(db, sql);
      fastify.log.error('end syncCustomersFirst');

      reply.send();
    } catch (error) {
      reply.send(error);
    }
  });
  next();
};
