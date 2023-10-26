const Mongo = require('mongodb');
const Boom = require('boom');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Commissioning Configuration Dynamic List',
      description: 'Get Commissioning Configuration Dynamic list',
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
                    description: 'Commissioning Configuration Dynamic ID',
                  },
                  config: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        roles: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              roleId: { type: 'string' },
                              directProductionPercentage: { type: 'number' },
                              indirectProductionPercentage: { type: 'number' },
                              isIndirectProductionCombinable: { type: 'boolean' },
                              directProductionForfait: { type: 'number' },
                            },
                          },
                        },
                      },
                    },
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

    const $regex = request.query.fullTextSearch
      ? decodeURIComponent(request.query.fullTextSearch)
          .split(' ')
          .join('|')
      : undefined;

    const filter = {
      ...($regex ? {} : {}),
    };

    const projection = {
      _id: true,
      config: true,
    };
    db.collection('tcw-commissioning-configuration-dynamic')
      .find(filter, { projection })
      .sort({ _id: -1 })
      .skip(request.query.skip)
      .limit(request.query.count)
      .toArray()
      .then((commissioning) => reply.send({ _meta: {}, items: commissioning }))
      .catch((error) => reply.send(Boom.internal(error.message)));
  });
  next();
};
