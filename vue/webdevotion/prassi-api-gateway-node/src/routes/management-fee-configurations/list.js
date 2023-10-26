const Mongo = require('mongodb');
const Boom = require('boom');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Management Fee Configuration List',
      description: 'Get Management Fee Configuration list',
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
                    description: 'Management Fee Configuration ID',
                  },
                  roleId: {
                    type: 'string',
                    enum: [
                      'team-manager',
                      'signaller',
                      'senior-promoter',
                      'promoter',
                      'district-manager',
                      'branch-manager',
                      'administrator',
                    ],
                    description: 'Role type',
                  },
                  fromProductivePeriodYear: {
                    type: 'number',
                    description: '',
                  },
                  fromProductivePeriodMonth: {
                    type: 'number',
                    description: '',
                  },
                  fromProductivePeriod: {
                    type: 'number',
                    description: '',
                  },
                  percentage: {
                    type: 'number',
                    description: 'Percentage',
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
      fromProductivePeriodYear: true,
      fromProductivePeriodMonth: true,
      fromProductivePeriod: true,
      percentage: true,
    };
    db.collection('management-fee-configuration')
      .find(filter, { projection })
      .sort({ _id: -1 })
      .skip(request.query.skip)
      .limit(request.query.count)
      .toArray()
      .then((managementFee) => reply.send({ _meta: {}, items: managementFee }))
      .catch((error) => reply.send(Boom.internal(error.message)));
  });
  next();
};
