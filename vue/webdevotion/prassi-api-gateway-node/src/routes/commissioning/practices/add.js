const Boom = require('boom');
const PracticeFeeService = require('../../../services/practice-commission-srv');
const PracticeService = require('../../../services/practice-srv');
const sync = require('../../../services/commissioning-flow-srv/commissioning-sync');
const { unparse } = require('../../../utils/productive-period-helper');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Commissioning Practice Add',
      description: 'Add a Practice for commissions calculation',
      tags: ['commissioning', 'practices'],
      params: {
        type: 'object',
        properties: {
          practiceId: {
            type: 'string',
          },
        },
      },
      querystring: {
        type: 'object',
        required: ['productivePeriod'],
        properties: {
          override: {
            type: 'boolean',
            description: 'override confirmed',
          },
          productivePeriod: {
            type: 'string',
            pattern: '([0-9]{4})([0-1][0-9])+',
            description: 'productivePeriod ID as productive period as YYYYMM',
          },
        },
      },
    },
  };

  fastify.put('/', options, (request, reply) => {
    const sql = fastify.knex;

    const practiceService = new PracticeService(fastify.mongo.db);
    const practiceFeeService = new PracticeFeeService(fastify.mongo.db, sql);
    const { productivePeriodYear, productivePeriodMonth } = unparse(request.query.productivePeriod);

    practiceService
      .getPracticeById(request.params.practiceId)
      .then(async (practice) => {
        await sync.syncDossierSingle(
          fastify.mongo.db,
          sql,
          request.params.practiceId,
          productivePeriodYear,
          productivePeriodMonth,
          fastify.edition,
        );
        await (request.query.override === true
          ? sync.syncCustomerSingleForce(
              fastify.mongo.db,
              request.params.practiceId,
              practice.effectProductivePeriodYear,
              practice.effectProductivePeriodMonth,
            )
          : sync.syncCustomerSingle(
              fastify.mongo.db,
              request.params.practiceId,
              practice.effectProductivePeriodYear,
              practice.effectProductivePeriodMonth,
            ));
        await sync.syncManagementFeeSingle(
          fastify.mongo.db,
          request.params.practiceId,
          productivePeriodYear,
          productivePeriodMonth,
          fastify.edition,
        );
        // eslint-disable-next-line no-return-await
        return await practiceFeeService.addNewPractice(practice, fastify.edition, request.query.override);
      })
      .then((practice) => reply.send(practice))
      .catch((error) => reply.send(Boom.badData(error.message)));
  });
  next();
};
