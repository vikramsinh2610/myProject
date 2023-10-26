const Boom = require('boom');
const Loadsh = require('loadsh');
const CommissioningFlowService = require('../../services/commissioning-flow-srv');
const commissioningStateSchema = require('./commissioning-state-schema');
const { statuses } = require('../../services/commissioning-flow-srv/commissioning-statuses');
require('../../utils/foreach');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Commissioning Remove Installment',
      description: 'Remove practice installment from commissioning session',
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
      const chunks = Loadsh.chunk(request.body, 5000);

      // @ts-ignore
      await chunks.forEachAsync(async (myChunk) => {
        await sql('commissioning_installments')
          .whereIn(
            ['commissioningId', 'practiceId', 'dossierId', 'installment'],
            myChunk.map((p) => [request.params.commissioningId, p.practiceId, p.dossierId, p.installment]),
          )
          .del();
      });
    }

    commissioningFlowService
      .removePracticeInstallment(request.params.commissioningId, request.body)
      .then((stateResult) => reply.send({ _meta: {}, item: stateResult }))
      .catch((error) => reply.send(Boom.conflict(error.message)));
  });
  next();
};
