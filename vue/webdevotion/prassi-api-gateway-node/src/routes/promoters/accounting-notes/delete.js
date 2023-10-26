const Boom = require('boom');
const AccountingService = require("../../../services/accounting-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Invoice Account Entry Delete',
      description: 'Delete an invoice entry',
      tags: ['invoice'],
      params: {
        type: 'object',
        properties: {
          promoterId: {
            type: 'string',
            description: 'Promoter ID',
          },
          id: {
            type: 'string',
            description: 'Entry ID',
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
                  description: 'ID of accounting note',
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.delete('/', options, (request, reply) => {
    const accountingService = new AccountingService(fastify.mongo.db);
    accountingService
      .deleteAccountingNote(request.params.id)
      .then((note) => reply.code(201).send(note))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
