// eslint-disable-next-line security/detect-child-process
const commissioningStateSchema = require('./commissioning-state-schema');
const CommissioningFlowService = require("../../services/commissioning-flow-srv");
const LogEvent = require("../../services/commissioning-flow-srv/log-event");
const logRepository = require("../../services/commissioning-flow-srv/log-repository");
const errorHandler = require('../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Commissioning Confirm',
      description: 'Confirm commissioning for the specified productive period',
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

  fastify.post('/', options, errorHandler(async (request, reply) => {
    const sql = fastify.knex;
    const sqlReader = fastify.knex_reader;
    const commissioningFlowService = new CommissioningFlowService(fastify.mongo.db, fastify.edition, sql, sqlReader);

    logRepository.insert(
      fastify.mongo.db,
      new LogEvent({
        idCommissioning: request.params.commissioningId,
        description: `RIAPERTO commissioning ${request.params.commissioningId}`,
      }),
    );

    const processingState = await commissioningFlowService
      .reopenerror(request.params.commissioningId)
      .then((state) => state);

    reply.send({ _meta: {}, item: processingState });
  }));
  next();
};
