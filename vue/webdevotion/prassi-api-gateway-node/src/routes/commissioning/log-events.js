const Mongo = require('mongodb');
const Boom = require('boom');
const dateRegex = require('../../utils/iso-6801-date');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Log Events List',
      description: 'Get log events list',
      tags: ['log-events'],
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
            mimumum: 1,
            maximum: 25,
            description: 'Number of items to return',
          },
          commissioningId: {
            type: 'string',
            default: '',
          },
          invoicingId: {
            type: 'string',
            default: '',
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
                    description: 'Log event ID',
                  },
                  description: {
                    type: 'string',
                    description: 'Log event description',
                  },
                  idInvoicing: {
                    type: 'string',
                    description: 'Log event id invoicing',
                  },
                  idCommissioning: {
                    type: 'string',
                    description: 'Log event id commissioning',
                  },
                  createDate: {
                    type: 'string',
                    description: 'Log event create date',
                    pattern: dateRegex,
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

    return db
      .collection('log-event')
      .find({ $or: [{ idCommissioning: request.query.commissioningId }, { idInvoicing: request.query.invoicingId }] })
      .sort({ createDate: -1 })
      .skip(request.query.skip)
      .limit(request.query.count)
      .toArray()
      .then((list) => reply.send({ _meta: {}, items: list }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
