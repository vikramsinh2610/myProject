const Boom = require('boom');
const NetworkService = require("../../services/network-srv");
const errorHandler = require("../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Precontractual Delete',
      description: 'Delete a Precontractual',
      tags: ['precontractual'],
      params: {
        type: 'object',
        properties: {
          precontractualId: {
            type: 'string',
            description: 'precontractual ID',
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
              properties: {
                id: {
                  type: 'string',
                  description: 'Precontractual ID',
                },
                personId: {
                  type: 'string',
                  description: 'Person ID',
                },
                status: {
                  type: 'number',
                  description: 'Precontractual status',
                },
                stepper: {
                  type: 'number',
                  description: 'Precontractual status',
                },
              },
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

      const query = sql
          .select(
              'id',
              'status',
              'personId',
              'stepper',
          )
          .from('precontractual')
          .where('personId', request.params.personId);

      const precontractual = await query
        .then((results) => results);

      // eslint-disable-next-line max-len
      if (!precontractual || precontractual.length === 0) return reply.send(Boom.badRequest('Nessun precontrattuale trovata'));

      await sql('precontractual')
        .del()
        .where('personId', request.params.personId);

      return reply.send({
        _meta: {},
        item: precontractual[0],
      });
    }),
  );
  next();
};
