const Mongo = require('mongodb');
const Boom = require('boom');
const DocumentObject = require("../../../../services/document-srv/document");
const NetworkService = require("../../../../services/network-srv");
const errorHandler = require("../../../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Promoter Letter Attachments List',
      description: 'Get letter attachments list',
      tags: ['letters'],
      params: {
        type: 'object',
        properties: {
          promoterId: {
            type: 'string',
            description: 'Promoter ID',
          },
          letterId: {
            type: 'string',
            description: 'Letter ID',
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
                additionalProperties: true,
                properties: {
                  _id: {
                    type: 'string',
                    description: 'Attachment ID',
                  },
                  type: {
                    type: 'string',
                    description: 'Attachment Type',
                  },
                  displayName: {
                    type: 'string',
                    description: 'File name',
                  },
                  locked: {
                    type: 'boolean',
                    default: false,
                    description: 'If a document can be deleted or not',
                  },
                  createDate: {
                    type: 'string',
                    description: 'Attachment creation date',
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

    return db.collection('letter')
      .findOne(
        { _id: request.params.letterId, promoterId: request.params.promoterId },
        {
          projection: {
            attachmentIds: true,
          },
        },
      )
      .then((letter) => {
        if (!letter) return Promise.reject(Boom.notFound());
        return Promise.resolve(letter.attachmentIds || []);
      })
      .then((ids) =>
        db
          .collection('document')
          .find({ _id: { $in: ids } })
          .map((res) => new DocumentObject(res))
          .toArray(),
      )
      .then((items) =>
        reply.send({
          _meta: {},
          items,
        }),
      )
      .catch((error) => reply.send(error));
  }));
  next();
};
