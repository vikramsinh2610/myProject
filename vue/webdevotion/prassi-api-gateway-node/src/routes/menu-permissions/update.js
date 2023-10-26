const Boom = require('boom');
const MenuPermissionsConfigurationService = require('../../services/menu-permissions-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Menu Permissions Add',
      description: 'Add a Menu Permissions Configuration',
      tags: ['menu-permissions-configuration'],
      params: {
        type: 'object',
        properties: {
          menuPermissionsId: {
            type: 'string',
            description: 'Menu Permissions ID',
          },
        },
      },
      body: {
        type: 'object',
        required: ['roleId', 'menuId'],
        properties: {
          _id: {
            type: 'string',
            description: 'Menu Permissions ID',
          },
          roleId: {
            type: 'integer',
            description: 'Role type',
          },
          userId: {
            type: 'string',
            description: 'User Id',
          },
          enabled: {
            type: 'boolean',
            description: 'State Visible',
          },
          menuId: {
            type: 'string',
            description: 'Name menu',
          },
        },
      },
    },
  };

  fastify.put('/', options, (request, reply) => {
    const menuPermissionsConfigurationService = new MenuPermissionsConfigurationService(fastify.mongo.db);

    fastify.log.info(request.body);
    menuPermissionsConfigurationService
      .addOrUpdateConfiguration(request.body)
      .then((configuration) => reply.send({ _meta: {}, item: configuration }))
      .catch((error) => reply.send(Boom.internal(error.message)));
  });
  next();
};
