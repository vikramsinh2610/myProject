const errorHandler = require('../../utils/error-handler');
const RoleService = require('../../services/promoter-job-srv/role-ids');

module.exports = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'Role delete',
      description: 'Delete a Role',
      tags: ['role'],
    },
  };
  fastify.delete(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const roles = await RoleService.deleteRoleIds(fastify.mongo.db, request.params.roleId);
      reply.send({ _meta: {}, items: [roles] });
    }),
  );
  next();
};
