const counters = require('../../utils/counters');
const errorHandler = require('../../utils/error-handler');
const { unparse } = require('../../utils/productive-period-helper');

function getLastOrdinal(mongodb) {
  return counters.lastInvoiceCounter(mongodb).then((count) => count);
}

function getCurrentOrdinal(mongodb, month, year) {
  return counters.current(mongodb, `EXPORT-INVOICES-ID-${month}-${year}`).then((count) => count);
}

function getPreviousOrdinal(mongodb) {
  return counters.previousInvoiceCounter(mongodb).then((count) => count);
}

module.exports = (fastify, opts, next) => {
  const options = {
    // preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Invoicing Export Number Get',
      description: 'Get invoicing export number',
      tags: ['commissioning'],
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
            item: {},
          },
        },
      },
    },
  };

  fastify.get(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const { productivePeriodMonth, productivePeriodYear } = unparse(request.params.invoicingId);

      const currentIndex = await getLastOrdinal(fastify.mongo.db);
      const currentMonthIndex = await getCurrentOrdinal(fastify.mongo.db, productivePeriodYear, productivePeriodMonth);
      const previousIndex = await getPreviousOrdinal(fastify.mongo.db);

      reply.send({
        _meta: {},
        item: { invoicingId: request.params.invoicingId, currentIndex, currentMonthIndex, previousIndex },
      });
    }),
  );
  next();
};
