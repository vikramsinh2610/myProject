const Boom = require('boom');
const Mongo = require('mongodb');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Menu Permissions Configuration Detail',
      description: 'Delete Configuration Detail',
      tags: ['configuration'],
      querystring: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Menu Permissions Configuration ID',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            _meta: {
              type: 'object',
            },
            item: {
              type: 'object',
              properties: {
                _id: {
                  type: 'string',
                  description: 'Menu Permissions Configuration ID',
                },
                roleId: {
                  type: 'integer',
                  description: 'Role type',
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.delete('/', options, (request, reply) => {
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    db.collection('menu-permissions')
      .deleteOne({ _id: new Mongo.ObjectId(request.params.menuPermissionsId) })
      .then((menuPermissions) => reply.send({ _meta: {}, item: menuPermissions }))
      .catch((error) => reply.send(Boom.internal(error.message)));
  });
  next();
};
