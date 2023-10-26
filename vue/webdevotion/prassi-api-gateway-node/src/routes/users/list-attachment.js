const Mongo = require('mongodb');
const DocumentObject = require("../../services/document-srv/document");
const errorHandler = require("../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Workflow Attachments List',
      description: 'Get Workflow attachments list',
      tags: ['workflow'],
      params: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'Attachment ID',
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

  fastify.get(
    '/',
    options,
    errorHandler(async (request, reply) => {
      /** @type {Mongo.Db} */
      // eslint-disable-next-line prefer-destructuring
      const db = fastify.mongo.db;

      return db
        .collection('document')
        .find({ 'additionalData.entityId': request.params.userId })
        .map((res) => new DocumentObject(res))
        .toArray()
        .then((items) =>
          reply.send({
            _meta: {},
            items,
          }),
        )
        .catch((error) => reply.send(error));
    }),
  );
  next();
};
