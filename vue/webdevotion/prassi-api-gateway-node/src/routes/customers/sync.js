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
      await sync.syncCustomersFirst(db);
      fastify.log.error('end syncCustomersFirst');
      await sync.syncCustomers(db, 2022, 5);
      await sync.syncDossiers(db, sql, 2022, 5, "sheltia");
      await sync.syncPractices(db, sql, "sheltia", 2022, 5);
      await sync.syncNetworkPg(db, sql,  2022, 5);
      await sync.syncCustomersOwnerPg(db, sql,  2022, 5);
      await sync.syncPracticeOwnerPg(db, sql,  2022, 5);
      await sync.syncCustomersPg(db, sql);

      reply.send();
    } catch (error) {
      reply.send(error);
    }
  });
  next();
};
