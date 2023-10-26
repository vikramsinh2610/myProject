const errorHandler = require("../../utils/error-handler");
const NetworkService = require("../../services/network-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Network List',
      description: 'Get network list',
      tags: ['networks'],
      querystring: {
        type: 'object',
        properties: {
          productivePeriodMonth: {
            type: 'number',
          },
          productivePeriodYear: {
            type: 'number',
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
                    description: 'network ID',
                  },
                  name: {
                    type: 'string',
                    description: 'Network full name',
                  },
                  roleId: {
                    type: 'string',
                    description: 'role Id',
                  },
                  promoterId: {
                    type: 'string',
                    description: 'Promoter username',
                  },
                  displayHierarchy: {
                    type: 'string',
                    description: 'Promoter displayHkerarchy',
                  },
                  validPromoterId: {
                    type: 'string',
                    description: 'Promoter validPromoterId',
                  },
                  validPromoterName: {
                    type: 'string',
                    description: 'Promoter validPromoterName',
                  },
                  inherited: {
                    type: 'boolean',
                    description: 'Promoter inherited',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.get(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const networkService = new NetworkService(fastify.mongo.db, fastify.knex);
      const nodeList = await networkService.getNetworkListFlat(
        request.identity.roleId,
        request.identity._id,
      );

      return reply.send({
        _meta: {},
        items: nodeList,
      });
    }),
  );
  next();
};
