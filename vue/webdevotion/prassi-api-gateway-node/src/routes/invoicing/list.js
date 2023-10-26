const Mongo = require('mongodb');
const Boom = require('boom');
const dateRegex = require('../../utils/iso-6801-date');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Invoicing List',
      description: 'Get invoicing list',
      tags: ['invoicing'],
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
                  'stats',
                ],
                properties: {
                  _id: {
                    type: 'string',
                    description: 'Invoicing ID',
                  },
                  status: {
                    type: 'string',
                    description: 'Invoicing status',
                  },
                  didOpenedDate: {
                    type: 'string',
                    description: 'Invoicing open date',
                    pattern: dateRegex,
                  },
                  didClosedDate: {
                    type: 'string',
                    description: 'Invoicing close date',
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
                  stats: {
                    type: 'object',
                    properties: {
                      gross: {
                        type: 'integer',
                      },
                      net: {
                        type: 'integer',
                      },
                      tax: {
                        type: 'integer',
                      },
                      promoterNumber: {
                        type: 'integer',
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

    const projection = {
      _id: true,
      status: true,
      didOpenedDate: true,
      didClosedDate: true,
      productivePeriodYear: true,
      productivePeriodMonth: true,
      stats: true,
    };
    db.collection('invoicing')
      .find({}, { projection })
      .sort({ _id: -1 })
      .toArray()
      .then((list) => reply.send({ _meta: {}, items: list }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
