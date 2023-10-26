const Boom = require('boom');
const PromoterJobService = require("../../../services/promoter-job-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Promoter Job List',
      description: 'Get job history for specified promoter',
      tags: ['lobs'],
      params: {
        type: 'object',
        properties: {
          promoterId: {
            type: 'string',
            description: 'Promoter ID',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'items'],
          properties: {
            _meta: {
              type: 'object',
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: [
                  '_id',
                  'promoterId',
                  'roleId',
                  'fromProductivePeriodYear',
                  'fromProductivePeriodMonth',
                ],
                properties: {
                  _id: {
                    type: 'string',
                    description: 'Invoice ID',
                  },
                  promoterId: {
                    type: 'string',
                    description: 'Promoter ID',
                  },
                  roleId: {
                    type: 'string',
                    description: 'Role ID',
                  },
                  fromProductivePeriodYear: {
                    type: 'integer',
                    description: 'Year',
                  },
                  fromProductivePeriodMonth: {
                    type: 'integer',
                    description: 'Month',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.get('/', options, (request, reply) => {
   const promoterJobService = new PromoterJobService(fastify.mongo.db);

   promoterJobService
     .getAllPromoterJobs(request.params.promoterId)
     .then((list) => reply.send({ _meta: {}, items: list }))
     .catch((error) => reply.send(Boom.badRequest(error.message)));
   });


    next();
};
