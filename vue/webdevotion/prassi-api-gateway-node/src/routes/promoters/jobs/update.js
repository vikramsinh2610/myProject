const Boom = require('boom');
const PromoterJobService = require('../../../services/promoter-job-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Promoter Job Update',
      description: 'Update the job history',
      tags: ['product-configuration'],
      params: {
        type: 'object',
        properties: {
          promoterId: {
            type: 'string',
            description: 'Promoter ID',
          },
        },
      },
      body: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['fromProductivePeriodMonth', 'fromProductivePeriodYear', 'roleId'],
          properties: {
            fromProductivePeriodMonth: {
              type: 'integer',
              description: 'Month',
            },
            fromProductivePeriodYear: {
              type: 'integer',
              description: 'Year',
            },
            roleId: {
              type: 'string',
              description: 'Role',
            },
          },
        },
      },
    },
  };

  fastify.put('/', options, (request, reply) => {
    const promoterJobService = new PromoterJobService(fastify.mongo.db);

    promoterJobService
      .updatePromoterJobs(request.params.promoterId, request.body)
      .then((list) => reply.send({ _meta: {}, items: list }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });

  next();
};
