const Boom = require('boom');
const DocumentService = require('../../services/document-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    // preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Export Presigned Document Download',
      description: 'Get presigned document download URL',
      tags: ['documents'],
      params: {
        type: 'object',
        properties: {
          exportId: {
            type: 'string',
            description: 'Export ID',
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
              properties: {
                _id: {
                  type: 'string',
                  description: 'Attachment ID',
                },
                url: {
                  type: 'string',
                  description: 'Presigned URL for download the attachment from S3. Expires in 1h',
                },
                displayName: {
                  type: 'string',
                  description: 'File name for the user',
                },
                notFound: {
                  type: 'boolean',
                },
                found: {
                  type: 'boolean',
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
    documentService
      .getDocumentByExportId(request.params.exportId)
      .then(async (doc) => {
        try {
          const url = await documentService.getPresignedDownloadUrl(doc);
          return reply.send({
            _meta: {},
            item: {
              _id: request.params.documentId,
              displayName: doc.displayName,
              url,
              found: true,
            },
          });
        } catch (error) {
          return reply.send(Boom.badRequest(error));
        }
      })
      .catch(() => reply.send({
          _meta: {},
          item: { notFound: true },
        }));
  });
  next();
};
