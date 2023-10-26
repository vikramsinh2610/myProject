/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
const Mongo = require('mongodb');
const CustomerSrv = require('../../services/customer-srv');
const personRepository = require('../../services/person-srv/person-repository');
const CustomerSync = require('../../services/customer-srv/customer-sync');

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

    try {
      fastify.log.error('start customer person sync');
      const customerSrv = new CustomerSrv(db);

      const customer = await customerSrv.getCustomerById(request.query.customerId);
      await personRepository.insertFromLegacy(sql, db, new CustomerSync({ ...customer }));

      reply.send();
    } catch (error) {
      reply.send(error);
    }
  });
  next();
};
