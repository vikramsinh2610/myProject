// eslint-disable-next-line security/detect-child-process
const { fork } = require('child_process');
const { statuses } = require("../../services/invoicing-flow-srv/invoicing-statuses");
const invoicingStateSchema = require('./invoicing-state-schema');
const LogEvent = require("../../services/commissioning-flow-srv/log-event");
const logRepository = require("../../services/commissioning-flow-srv/log-repository");
const invoicingRepository = require("../../services/invoicing-flow-srv/invoicing-repository");
const errorHandler = require('../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Invoicing Preview',
      description: 'Preview invoicing for the specified productive period',
      tags: ['invoicing'],
      params: {
        type: 'object',
        properties: {
          invoicingId: {
            type: 'string',
            pattern: '([0-9]{4})([0-1][0-9])+',
            description: 'Invoicing ID as productive period as YYYYMM',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'item'],
          properties: {
            _meta: { type: 'object' },
            item: invoicingStateSchema,
          },
        },
      },
    },
  };

  fastify.post('/', options, errorHandler(async (request, reply) => {
    const stateInvoicing = await invoicingRepository.getById(fastify.mongo.db, request.params.invoicingId);

    logRepository.insert(
      fastify.mongo.db,
      new LogEvent({
        idInvoicing: request.params.invoicingId,
        description: `INIZIO preview fatturazione ${request.params.invoicingId}`,
      }),
    );

    const worker = fork('./src/routes/invoicing/worker-lib');
    worker.on('message', (resultInfo) => {
      fastify.log.info(resultInfo);
      worker.kill();
    });

    worker.send({
      action: 'previewInvoicing',
      stateInvoicing,
      invoicingId: request.params.invoicingId,
      edition: fastify.edition,
    });

    reply.send({ _meta: {}, item: { ...stateInvoicing, status: statuses.PREVIEW_PROCESSING } });
  }));
  next();
};
