const Boom = require('boom');
const CommissioningFlowService = require('../../services/commissioning-flow-srv');
const commissioningStateSchema = require('./commissioning-state-schema');
const { statuses } = require('../../services/commissioning-flow-srv/commissioning-statuses');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Commissioning Add Installment',
      description: 'Add practice installment into commissioning session',
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
      body: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['practiceId', 'dossierId', 'installment'],
          additionalProperties: false,
          properties: {
            practiceId: {
              type: 'string',
              description: 'The ID of practice',
            },
            dossierId: {
              type: 'string',
              description: 'The ID of dossier',
            },
            installment: {
              type: 'number',
              description: 'Installment number',
            },
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

  fastify.post('/', options, async (request, reply) => {
    const sql = fastify.knex;
    const sqlReader = fastify.knex_reader;
    const commissioningFlowService = new CommissioningFlowService(fastify.mongo.db, fastify.edition, sql, sqlReader);
    const state = await commissioningFlowService.getState(request.params.commissioningId);

    if (state.status === statuses.OPENED) {
      const newItems = [];
      request.body.forEach((installment) => {
        newItems.push({
          commissioningId: request.params.commissioningId,
          dossierId: installment.dossierId,
          practiceId: installment.practiceId,
          installment: installment.installment,
        });
      });

      await sql('commissioning_installments').insert(newItems);
    }

    return commissioningFlowService
      .addPracticeInstallment(request.params.commissioningId, request.body)
      .then((stateResult) => reply.send({ _meta: {}, item: stateResult }))
      .catch((error) => reply.send(Boom.conflict(error.message)));
  });
  next();
};
