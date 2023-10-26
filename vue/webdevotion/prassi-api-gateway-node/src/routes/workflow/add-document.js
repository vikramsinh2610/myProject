const Boom = require('boom');
const DocumentService = require("../../services/document-srv");
const { types } = require("../../services/document-srv/document-types");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Workflow Attachments Add',
      description: 'Workflow letter attachment',
      tags: ['workflow'],
      params: {
        type: 'object',
        properties: {
          attachmentId: {
            type: 'string',
            description: 'Attachment ID',
          },
        },
      },
      querystring: {
        type: 'object',
        required: ['attachmentName', 'extension', 'type'],
        properties: {
          type: {
            type: 'string',
            description: 'type ID',
          },
          extension: {
            type: 'string',
          },
          attachmentName: {
            type: 'string',
            description: 'Name of attachment',
          },
        },
      },
    },
  };

  fastify.put('/', options, (request, reply) => {
    const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);

    documentService
      .addDocument({
        _id: request.params.attachmentId,
        type: types.WORKFLOW,
        ownerId: request.identity._id,
        displayName: request.query.attachmentName,
        locked: false,
        additionalData: {
          entityId: request.params.entityId,
          type: request.query.type,
          extension: request.query.extension,
        },
      })
      .then((doc) => reply.send({ _meta: {}, item: doc }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
