const Mongo = require('mongodb');
const Boom = require('boom');
const invoiceRepository = require('../../../services/invoice-srv/invoice-repository');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Invoice Delete',
      description: 'Delete an invoice',
      tags: ['invoice'],
      params: {
        type: 'object',
        properties: {
          promoterId: {
            type: 'string',
            description: 'Invoice ID',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'item'],
          properties: {
            _meta: {
              type: 'object',
            },
            item: {
              type: 'object',
              required: [
                '_id',
              ],
              properties: {
                _id: {
                  type: 'string',
                  description: 'Invoice ID',
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.delete('/', options, async (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    return invoiceRepository.deleteById(db, request.params.invoiceId)
      .then((data) => reply.send({ _meta: {}, item: data }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
