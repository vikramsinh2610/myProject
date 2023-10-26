const Boom = require('boom');
const SheltiaPromoterTargetService = require('../../../services/sheltia-promoter-target-srv');
const PromoterTarget = require('../../../services/sheltia-promoter-target-srv/sheltia-promoter-target');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Promoter target update',
      description: 'Add or update promoter target',
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
      body: {
        type: 'object',
        required: ['productivePeriodYear', 'productivePeriodMonth', 'targetIv'],
        properties: {
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

  fastify.post('/', options, (request, reply) => {
    const sheltiaPromoterTargetService = new SheltiaPromoterTargetService(fastify.mongo.db);
    const promoterTarget = new PromoterTarget({
      promoterId: request.params.promoterId,
      productivePeriodYear: request.body.productivePeriodYear,
      productivePeriodMonth: request.body.productivePeriodMonth,
      targetIv: request.body.targetIv,
    });
    sheltiaPromoterTargetService
      .addOrUpdateConfiguration(promoterTarget)
      .then((target) =>
        reply.send({
          _meta: {},
          item: target,
        }),
      )
      .catch((error) => reply.send(Boom.badData(error.message)));
  });
  next();
};
