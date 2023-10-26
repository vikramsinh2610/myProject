const Mongo = require('mongodb');
const Boom = require('boom');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Menu Permissions List',
      description: 'Get Menu Permissions list',
      tags: ['configuration'],
      querystring: {
        type: 'object',
        properties: {
          skip: {
            type: 'integer',
            mimimum: 0,
            default: 0,
            description: 'Number of items to skip',
          },
          count: {
            type: 'integer',
            default: 20,
            description: 'Number of items to return',
          },
          fullTextSearch: {
            type: 'string',
            description: 'Free text for full text search',
          },
          roleId: {
            type: 'string',
            description: 'Role type',
          },
          promoterId: {
            type: 'string',
            description: 'Promoter Id',
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
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: {
                    type: 'string',
                    description: 'Menu Permissions ID',
                  },
                  roleId: {
                    type: 'string',
                    description: 'Role type',
                  },
                  userId: {
                    type: 'string',
                    description: 'User promoter Id',
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
          },
        },
      },
    },
  };

  fastify.get('/', options, (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    const filter = {
      $and: [
        request.query.roleId ? { roleId: { $eq: Number.parseInt(request.query.roleId, 10) } } : {},
        request.query.promoterId ? { userId: { $eq: request.query.promoterId } } : {},
      ],
    };

    const projection = {
      _id: true,
      roleId: true,
      userId: true,
      enabled: true,
      menuId: true,
    };

    db.collection('menu-permissions')
      .find(filter, { projection })
      .sort({ _id: -1 })
      .skip(request.query.skip)
      .limit(request.query.count)
      .toArray()
      .then((menu) => reply.send({ _meta: {}, items: menu }))
      .catch((error) => reply.send(Boom.internal(error.message)));
  });
  next();
};
