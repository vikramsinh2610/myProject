const Mongo = require('mongodb');
const Boom = require('boom');
const errorHandler = require('../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'Invoice Get Heading',
      description: 'Get an invoice heading',
      tags: ['invoice'],
    },
  };

  fastify.get(
    '/',
    options,
    errorHandler(async (request, reply) => {
      /** @type {Mongo.Db} */
      // eslint-disable-next-line prefer-destructuring
      const db = fastify.mongo.db;

      const invoice = await db
        .collection('invoice-heading')
        .find({})
        .toArray()
        .then((record) => record)
        .catch((error) => error);

      if (invoice.message) return reply.send(Boom.badRequest(invoice.message));
      return reply.send({ _meta: {}, items: invoice });
    }),
  );
  next();
};
