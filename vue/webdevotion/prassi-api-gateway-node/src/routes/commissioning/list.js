const Mongo = require('mongodb');
const Boom = require('boom');
const dateRegex = require('../../utils/iso-6801-date');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Commissioning List',
      description: 'Get commissioning list',
      tags: ['commissioning'],
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
                required: [
                  '_id',
                  'status',
                  'didOpenedDate',
                  'didClosedDate',
                  'productivePeriodYear',
                  'productivePeriodMonth',
                  'income',
                  'outcome',
                  'margin',
                ],
                properties: {
                  _id: {
                    type: 'string',
                    description: 'Commissioning ID',
                  },
                  status: {
                    type: 'string',
                    description: 'Commissioning status',
                  },
                  didOpenedDate: {
                    type: 'string',
                    description: 'Commissioning open date',
                    pattern: dateRegex,
                  },
                  didClosedDate: {
                    type: 'string',
                    description: 'Commissioning close date',
                    pattern: dateRegex,
                  },
                  productivePeriodYear: {
                    type: 'integer',
                    description: 'Productive period year',
                    minimum: 2000,
                    maximum: 2099,
                  },
                  productivePeriodMonth: {
                    type: 'integer',
                    description: 'Productive period month',
                    minimum: 1,
                    maximum: 12,
                  },
                  income: {
                    type: 'integer',
                    default: 0,
                    description: 'Commissioning revenues',
                  },
                  outcome: {
                    type: 'integer',
                    default: 0,
                    description: 'Commissioning expenses',
                  },
                  margin: {
                    type: 'integer',
                    default: 0,
                    description: 'Commissioning margin',
                  },
                  promotersCount: {
                    type: 'integer',
                    default: 0,
                    minimum: 0,
                    description: 'Promoters in commissioning',
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

    const projection = {
      _id: true,
      status: true,
      didOpenedDate: true,
      didClosedDate: true,
      productivePeriodYear: true,
      productivePeriodMonth: true,
      income: true,
      outcome: true,
      margin: true,
      promotersCount: true,
    };
    db.collection('commissioning')
      .find({}, { projection })
      .sort({ _id: -1 })
      .toArray()
      .then((list) => reply.send({ _meta: {}, items: list }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
