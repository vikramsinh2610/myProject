const Boom = require('boom');
const NetworkService = require('../../services/network-srv');
const errorHandler = require('../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Person Document Delete',
      description: 'Delete a Person Document',
      tags: ['person', 'document'],
      params: {
        type: 'object',
        properties: {
          documentId: {
            type: 'string',
            description: 'Document ID',
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
              properties: {},
            },
            item: {
              type: 'object',
            },
          },
        },
      },
    },
  };

  fastify.delete(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const sql = fastify.knex;
      const networkService = new NetworkService(fastify.mongo.db);
      const firstNode = await networkService.getFirstNode();
      if (!firstNode) return reply.send(Boom.badRequest('Rete non presente'));

      await sql('person_document').del().where('id', request.params.documentId);

      return reply.send({
        _meta: {},
        item: { ok: true },
      });
    }),
  );
  next();
};
