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
          productivePeriodYear: {
            type: 'string',
            description: 'Year',
          },
        },
      },
      body: {
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
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'item'],
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

  fastify.put('/', options, async (request, reply) => {
    const sheltiaPromoterTargetService = new SheltiaPromoterTargetService(fastify.mongo.db);

    let err = {};
    for (let i = 1; i <= 12; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      err = await sheltiaPromoterTargetService
        .addOrUpdateConfiguration(new PromoterTarget({
          promoterId: request.params.promoterId,
          productivePeriodYear: request.body[i-1].productivePeriodYear,
          productivePeriodMonth: request.body[i-1].productivePeriodMonth,
          targetIv: request.body[i-1].targetIv,
        }))
        .then(() => ({}))
        .catch((error) => error);
      if (err.message) break;
    }

    if (err.message) {
      reply.send(Boom.badData(err.message));
      return;
    }
    reply.send({
      _meta: {},
      items: request.body,
    });
  });
  next();
};
