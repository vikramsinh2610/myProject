const errorHandler = require('../../utils/error-handler');
const RoleService = require('../../services/promoter-job-srv/role-ids');

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
      const roles = await RoleService.getRole(fastify.mongo.db, request.params.roleId);
      reply.send({ _meta: {}, items: [roles] });
    }),
  );
  next();
};
