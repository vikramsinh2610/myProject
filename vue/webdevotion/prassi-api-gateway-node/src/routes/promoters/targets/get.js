const Boom = require('boom');
const SheltiaPromoterTargetService = require('../../../services/sheltia-promoter-target-srv');
const NetworkService = require("../../../services/network-srv");
const errorHandler = require("../../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Promoter target',
      description: 'Get promoter target',
      tags: ['promoters'],
      params: {
        type: 'object',
        properties: {
          promoterId: {
            type: 'string',
            description: 'Promoter ID',
          },
        },
      },
      querystring: {
        type: 'object',
        required: ['productivePeriodYear', 'productivePeriodMonth'],
        properties: {
          productivePeriodYear: {
            type: 'integer',
            description: 'Productive period year',
          },
          productivePeriodMonth: {
            type: 'integer',
            description: 'Productive period month',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'item'],
          properties: {
            _meta: {
              type: 'object',
              properties: {},
            },
            item: {
              type: 'object',
              required: ['_id', 'productivePeriodYear', 'productivePeriodMonth', 'targetIv'],
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
      .getByPromoterIdAndProductivePeriod(
        request.params.promoterId,
        request.query.productivePeriodYear,
        request.query.productivePeriodMonth,
        'none',
      )
      .then((target) =>
        reply.send({
          _meta: {},
          item: target,
        }),
      )
      .catch((error) => reply.send(Boom.notFound(error.message)));
  }));
  next();
};
