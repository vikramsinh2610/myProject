const Boom = require('boom');
const CommissioningFlowService = require("../../services/commissioning-flow-srv");
const commissioningStateSchema = require('./commissioning-state-schema');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Commissioning Details Get',
      description: 'Get commissioning state for the specified productive period',
      tags: ['commissioning'],
      params: {
        type: 'object',
        properties: {
          commissioningId: {
            type: 'string',
            pattern: '([0-9]{4})([0-1][0-9])+',
            description: 'Commissioning ID as productive period as YYYYMM',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'item'],
          properties: {
            _meta: { type: 'object' },
            item: commissioningStateSchema,
          },
        },
      },
    },
  };

  fastify.get('/', options, (request, reply) => {
    const sql = fastify.knex;
    const sqlReader = fastify.knex_reader;
    const commissioningFlowService = new CommissioningFlowService(fastify.mongo.db, fastify.edition, sql, sqlReader);
    commissioningFlowService
      .getState(request.params.commissioningId)
      .then((state) => reply.send({ _meta: {}, item: state }))
      .catch((error) => reply.send(Boom.notFound(error.message)));
  });
  next();
};
