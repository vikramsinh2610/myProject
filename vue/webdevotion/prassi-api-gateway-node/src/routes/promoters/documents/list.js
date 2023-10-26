const Mongo = require('mongodb');
const Boom = require('boom');
const NetworkService = require("../../../services/network-srv");
const errorHandler = require("../../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Promoter Document List',
      description: 'Get documents list',
      tags: ['document'],
      params: {
        type: 'object',
        properties: {
          promoterId: {
            type: 'string',
            description: 'Promoter ID',
          },
        },
      },
      querystring: {
        type: 'object',
        required: ['types', 'skip', 'count'],
        properties: {
          types: {
            type: 'string',
            default: '*',
            description: 'Document types',
          },
          skip: {
            type: 'integer',
            mimimum: 0,
            default: 0,
            description: 'Pagination skip items',
          },
          count: {
            type: 'integer',
            default: 20,
            mimumum: 1,
            maximum: 25,
            description: 'Page size',
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
              properties: {},
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['_id', 'type', 'createDate', 'additionalData'],
                properties: {
                  _id: {
                    type: 'string',
                    description: 'Attachment ID',
                  },
                  type: {
                    type: 'string',
                    description: 'Attachment Type',
                  },
                  createDate: {
                    type: 'string',
                    description: 'Attachment creation date',
                  },
                  displayName: {
                    type: 'string',
                    description: 'File name for the user',
                  },
                  locked: {
                    type: 'boolean',
                    default: false,
                    description: 'If a document can be deleted or not',
                  },
                  additionalData: {
                    type: 'object',
                    additionalProperties: true,
                    description: 'Document additional properties',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.get('/', options, errorHandler(async (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    const networkService = new NetworkService(fastify.mongo.db);
    const promoterCanSee = await networkService.userCanSee(
      request.identity.roleId,
      request.identity._id,
      request.params.promoterId,
    );
    if(!promoterCanSee) return reply.send(Boom.badRequest('Utente non autorizzato'));

    const { types } = request.query;
    const ownerId = request.params.promoterId;
    const query = types === '*' ? { ownerId } : { ownerId, type: { $in: types.split(',') } };

    return db.collection('document')
      .find(query)
      .sort({ _id: 1 })
      .skip(request.query.skip)
      .limit(request.query.count)
      .toArray()
      .then((items) =>
        reply.send({
          _meta: {},
          items,
        }),
      )
      .catch((error) => reply.send(Boom.badRequest(error)));
  }));
  next();
};
