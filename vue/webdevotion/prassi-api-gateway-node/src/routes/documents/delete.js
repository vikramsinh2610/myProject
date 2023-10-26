const Boom = require('boom');
const DocumentService = require("../../services/document-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Document deletion',
      description: 'Delete document by Id',
      tags: ['documents'],
      params: {
        type: 'object',
        properties: {
          documentId: {
            type: 'string',
            description: 'Document ID',
          },
        },
      }
    },
  };

  fastify.delete('/', options, (request, reply) => {
    const { documentId } = request.params;
    const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);
    documentService
      .deleteDocument(documentId)
      .then((result) => reply.send(result))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
