const errorHandler = require('../../utils/error-handler');
const RoleService = require('../../services/promoter-job-srv/role-ids');

module.exports = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'Promoter Roles Get',
      description: 'Get promoters roles',
      tags: ['promoters'],
      body: {
        type: 'object',
        // required: ['name','color','area'],
        properties: {
          _id: {
            type: 'string',
            description: 'Role ID',
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
          responses: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
              },
            },
          },
        },
      },
    },
  };
  fastify.put(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const roles = request.body._id ? await RoleService.updateRoleIds(fastify.mongo.db, request.body)
        : await RoleService.insertRoleIds(fastify.mongo.db, request.body);
      reply.send({ _meta: {}, items: [roles] });
    }),
  );
  next();
};
