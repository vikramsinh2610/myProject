// eslint-disable-next-line security/detect-child-process
const Boom = require('boom');
const invoicingStateSchema = require('./invoicing-state-schema');
const LogEvent = require('../../services/commissioning-flow-srv/log-event');
const logRepository = require('../../services/commissioning-flow-srv/log-repository');
const invoicingRepository = require('../../services/invoicing-flow-srv/invoicing-repository');
const InvoicingFlowService = require('../../services/invoicing-flow-srv');
const errorHandler = require('../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Invoicing ReOpen',
      description: 'Rollback and open again invoicing for the specified productive period',
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

  fastify.post(
    '/',
    options,
    errorHandler(async (request, reply) => {
      // eslint-disable-next-line prefer-destructuring
      const db = fastify.mongo.db;
      const stateInvoicing = await invoicingRepository.getById(fastify.mongo.db, request.params.invoicingId);
      const invoicingFlowService = new InvoicingFlowService(
        fastify.mongo.db,
        fastify.edition,
        fastify.log,
        fastify.knex,
      );

      invoicingFlowService
        .reOpen(stateInvoicing)
        .then((state) => {
          logRepository.insert(
            db,
            new LogEvent({
              idInvoicing: request.params.invoicingId,
              description: `FINE ROLLBACK/OPEN fatturazione ${request.params.invoicingId}`,
            }),
          );
          return reply.send({ _meta: {}, item: state });
        })
        .catch((error) => {
          logRepository.insert(
            db,
            new LogEvent({
              idInvoicing: request.params.invoicingId,
              description: `ERRORE ROLLBACK/OPEN fatturazione ${request.params.invoicingId}`,
            }),
          );
          return reply.send(Boom.badRequest(error.message));
        });
    }),
  );
  next();
};
