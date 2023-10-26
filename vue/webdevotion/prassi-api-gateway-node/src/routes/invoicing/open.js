const Boom = require('boom');
// eslint-disable-next-line security/detect-child-process
const { fork } = require('child_process');
const InvoicingFlowService = require("../../services/invoicing-flow-srv");
const LogEvent = require("../../services/commissioning-flow-srv/log-event");
const logRepository = require("../../services/commissioning-flow-srv/log-repository");
const productivePeriodHelper = require("../../utils/productive-period-helper");
const invoicingStateSchema = require('./invoicing-state-schema');
const dateRegex = require('../../utils/iso-6801-date');
const errorHandler = require('../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Invoicing Open',
      description: 'Open invoicing for the specified productive period',
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
      querystring: {
        type: 'object',
        properties: {
          issueDate: {
            type: 'string',
            pattern: dateRegex,
          },
          dueDate: {
            type: 'string',
            pattern: dateRegex,
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

  fastify.put('/', options, errorHandler(async (request, reply) => {
    const { productivePeriodMonth, productivePeriodYear } = productivePeriodHelper.unparse(request.params.invoicingId);
    const { issueDate, dueDate } = request.query;
    const now = Date.now();
    let errorMessage = '';

    logRepository.insert(
      fastify.mongo.db,
      new LogEvent({
        idInvoicing: request.params.invoicingId,
        description: `INIZIO fatturazione ${productivePeriodYear} ${productivePeriodMonth}`,
      }),
    );

    const invoicingFlowService = new InvoicingFlowService(fastify.mongo.db, fastify.edition, fastify.log, fastify.knex);
    // There is no file open but ESLint think yes... uhm!
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const stateInvoicing = await invoicingFlowService
      .create(productivePeriodYear, productivePeriodMonth, new Date(issueDate), new Date(dueDate))
      .then((state) => state)
      .catch((error) => {
        logRepository.insert(
          fastify.mongo.db,
          new LogEvent({
            idInvoicing: request.params.invoicingId,
            description: `ERRORE fatturazione ${productivePeriodYear} ${productivePeriodMonth}: ${error.message}`,
          }),
        );
        errorMessage = error.message;
        // eslint-disable-next-line unicorn/no-useless-undefined
        return undefined;
      });

    if (!stateInvoicing) return reply.send(Boom.conflict(errorMessage));
    fastify.log.info('process invoices');

    const worker = fork('./src/routes/invoicing/worker-lib');
    worker.on('message', (resultInfo) => {
      fastify.log.info(resultInfo);
      worker.kill();
    });

    worker.send({
      action: 'openInvoicing',
      stateInvoicing,
      issueDate: issueDate || now,
      dueDate: dueDate || now,
      invoicingId: request.params.invoicingId,
      productivePeriodYear,
      productivePeriodMonth,
      edition: fastify.edition,
    });

    return reply.send({ _meta: {}, item: stateInvoicing });
  }));
  next();
};
