const Boom = require('boom');
const PracticeCommissionService = require("../../../services/practice-commission-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Installment Confirm',
      description: 'Confirm Installment',
      tags: ['invoicing'],
      params: {
        type: 'object',
        properties: {
          practiceId: {
            type: 'string',
            description: 'Installment practice ID',
          },
        },
      },
    },
  };

  fastify.post('/', options, (request, reply) => {
    const practiceCommissionService = new PracticeCommissionService(fastify.mongo.db, fastify.knex);
    const {practiceId, payin, payout, margin, installment, } = request.body;
    return practiceCommissionService.updateInstallmentPayin(practiceId, installment, payin, payout, margin)
      .then((state) => reply.send({ _meta: {}, item: state }))
      .catch((error) => reply.send(Boom.conflict(error.message)));
  });
  next();
};
