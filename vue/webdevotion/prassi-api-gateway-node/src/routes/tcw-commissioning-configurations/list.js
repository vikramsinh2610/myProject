const Mongo = require('mongodb');
const Boom = require('boom');
const dateRegex = require('../../utils/iso-6801-date');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Commissioning Configuration List',
      description: 'Get Commissioning Configuration list',
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
                    description: 'Commissioning Configuration ID',
                  },
                  roleId: {
                    type: 'string',
                    description: 'Role type',
                  },
                  creationDate: {
                    type: 'string',
                    pattern: dateRegex,
                    description: 'Creation date',
                  },
                  directProductionPercentage: {
                    type: 'number',
                    description: '',
                  },
                  indirectProductionPercentage: {
                    type: 'number',
                    description: '',
                  },
                  isIndirectProductionCombinable: {
                    type: 'boolean',
                    description: '',
                  },
                  directProductionForfait: {
                    type: 'number',
                    description: '',
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
      roleId: true,
      creationDate: true,
      directProductionPercentage: true,
      indirectProductionPercentage: true,
      isIndirectProductionCombinable: true,
      directProductionForfait: true,
    };
    db.collection('tcw-commissioning-configuration')
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
