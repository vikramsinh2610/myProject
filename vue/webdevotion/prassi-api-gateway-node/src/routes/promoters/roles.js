const errorHandler = require('../../utils/error-handler');
const roleIds = require('../../services/promoter-job-srv/role-ids');

module.exports = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'Promoter Roles Get',
      description: 'Get promoters roles',
      tags: ['promoters'],
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'items'],
          querystring: {
            type: 'object',
            properties: {
              skip: {
                type: 'integer',
                default: 0,
                description: 'Number of items to skip',
              },
              fullTextSearch: {
                type: 'string',
                description: 'Free text for full text search',
              },
            },
          },
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
                  },
                  authenticationId: {
                    type: 'number',
                  },
                  authenticationName: {
                    type: 'string',
                  },
                  networkId: {
                    type: 'string',
                  },
                  name: {
                    type: 'string',
                  },
                  color: {
                    type: 'string',
                  },
                  shortName: {
                    type: 'string',
                  },
                  area: {
                    type: 'string',
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
      const $regex = request.query.fullTextSearch
        ? decodeURIComponent(request.query.fullTextSearch).split(' ').join('|')
        : undefined;
      const filters = {
        ...(request.query.fullTextSearch ? { name: { $regex, $options: 'i' } } : {}),
      };

      const skip = Number.parseInt(request.query.skip, 10);
      const roles = await roleIds.getAllRoleIds(fastify.mongo.db, skip, filters);
      reply.send({ _meta: {}, items: roles });
    }),
  );
  next();
};
