// eslint-disable-next-line security/detect-child-process
const { fork } = require('child_process');
const CommissioningFlowService = require("../../services/commissioning-flow-srv");
const commissioningStateSchema = require('./commissioning-state-schema');
const LogEvent = require("../../services/commissioning-flow-srv/log-event");
const logRepository = require("../../services/commissioning-flow-srv/log-repository");
const errorHandler = require('../../utils/error-handler');
const { statuses } = require("../../services/commissioning-flow-srv/commissioning-statuses");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level1000],
    schema: {
      summary: 'Commissioning Rollback Close',
      description: 'Rollback commissioning Close',
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
        description: `ROLLBACK CLOSED commissioning ${request.params.commissioningId}`,
      }),
    );

    const processingState = await commissioningFlowService
      .startRollbackClose(request.params.commissioningId)
      .then((state) => state);

    const worker = fork('./src/routes/commissioning/worker-lib');
    worker.on('message', (resultInfo) => {
      fastify.log.info(resultInfo);
      worker.kill();
    });

    worker.send({
      action: 'rollbackCloseCommissioning',
      commissioningId: request.params.commissioningId,
      edition: fastify.edition,
      state: processingState,
    });

    reply.send({ _meta: {}, item: {...processingState, status: statuses.PROCESSING } });
  }));
  next();
};
