const { v4: uuid } = require('uuid');
const Boom = require('boom');
const DocumentService = require("../../services/document-srv");
const { types } = require("../../services/document-srv/document-types");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Workflow Attachment Presigned Upload',
      description: 'Get S3 presigned upload for workflow documents',
      tags: ['workflow'],
      params: {
        type: 'object',
        properties: {
          entityId: {
            type: 'string',
            description: 'entityId ID',
          },
        },
      },
      querystring: {
        type: 'object',
        required: ['extension'],
        properties: {
          extension: {
            type: 'string',
          },
          type: {
            type: 'string',
            description: 'type ID',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'item'],
          properties: {
            _meta: {
              type: 'object',
              properties: {},
            },
            item: {
              type: 'object',
              required: ['_id', 'url'],
              properties: {
                _id: {
                  type: 'string',
                },
                url: {
                  type: 'string',
                  description: 'S3 upload presigned URL',
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.get('/', options, (request, reply) => {
    const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);

    const _id = `${uuid()}`;
    documentService
      .getPresignedUploadUrl({
        _id,
        type: types.WORKFLOW,
        ownerId: request.identity._id,
        additionalData: {
          entityId: request.params.entityId,
          type: request.query.type,
          extension: request.query.extension,
        },
      })
      .then((url) => reply.send({ _meta: {}, item: { _id, url } }))
      .catch((error) => reply.send(Boom.badRequest(error)));
  });
  next();
};
