const Boom = require('boom');
const SheltiaPromoterTargetService = require('../../../services/sheltia-promoter-target-srv');
const NetworkService = require("../../../services/network-srv");
const errorHandler = require("../../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Promoter target',
      description: 'List year promoter targets',
      tags: ['promoters'],
      params: {
        type: 'object',
        properties: {
          promoterId: {
            type: 'string',
            description: 'Promoter ID',
          },
          productivePeriodYear: {
            type: 'string',
            description: 'Year',
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
              properties: {},
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: {
                    type: 'string',
                    description: 'promoter ID',
                  },
                  productivePeriodYear: {
                    type: 'integer',
                    description: 'Productive period year',
                  },
                  productivePeriodMonth: {
                    type: 'integer',
                    description: 'Productive period month',
                  },
                  targetIv: {
                    type: 'integer',
                    description: 'Target IV value',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.get('/', options, errorHandler(async (request, reply) => {
    const sheltiaPromoterTargetService = new SheltiaPromoterTargetService(fastify.mongo.db);

    const networkService = new NetworkService(fastify.mongo.db);
    const promoterCanSee = await networkService.userCanSee(
      request.identity.roleId,
      request.identity._id,
      request.params.promoterId,
    );
    if(!promoterCanSee) return reply.send(Boom.badRequest('Utente non autorizzato'));

    return sheltiaPromoterTargetService
      .getByPromoterIdAndYear(
        request.params.promoterId,
        request.params.productivePeriodYear
      )
      .then((targets) =>
        reply.send({
          _meta: {},
          items: targets,
        }),
      )
      .catch((error) => {
        reply.send(Boom.badData(error.message));
      });
  }));
  next();
};
