const Boom = require('boom');
const DocumentService = require('../../services/document-srv');

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
          userId: {
            type: 'string',
            description: 'Attachment ID',
          },
        },
      },
    },
  };

  fastify.delete('/', options, (request, reply) => {
    const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);

    documentService
      .deleteDocument(request.params.attachmentId)
      .then((doc) => reply.send({ _meta: {}, item: doc }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
