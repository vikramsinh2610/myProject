const Boom = require('boom');
const CommissioningFlowService = require("../../services/commissioning-flow-srv");
const productivePeriodHelper = require("../../utils/productive-period-helper");
const commissioningStateSchema = require('./commissioning-state-schema');
const errorHandler = require('../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Commissioning Open',
      description: 'Open commissioning for the specified productive period',
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

  fastify.put(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const { productivePeriodMonth, productivePeriodYear } = productivePeriodHelper.unparse(
        request.params.commissioningId,
      );

      const sql = fastify.knex;
      const sqlReader = fastify.knex_reader;
      const commissioningFlowService = new CommissioningFlowService(fastify.mongo.db, fastify.edition, sql, sqlReader);

      const result = await commissioningFlowService
        .open(productivePeriodYear, productivePeriodMonth)
        .then((state) => state)
        .catch((error) => error);

      if (result.message) {
        reply.send(Boom.conflict(result.message));
        return;
      }

      reply.send({ _meta: {}, item: result });
    }),
  );
  next();
};
