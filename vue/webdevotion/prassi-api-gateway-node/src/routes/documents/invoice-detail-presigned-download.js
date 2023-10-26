const Boom = require('boom');
const DocumentService = require("../../services/document-srv");
const errorHandler = require("../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    // preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Presigned Invoice Document Download',
      description: 'Get presigned Invoice document download URL',
      tags: ['documents'],
      params: {
        type: 'object',
        properties: {
          invoiceId: {
            type: 'string',
            description: 'Invoice ID',
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
              },
            },
          },
        },
      },
    },
  };

  fastify.get('/', options, errorHandler(async (request, reply) => {
    const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);

    const invoice = await fastify.mongo.db.collection('invoice')
      .findOne({ _id: request.params.invoiceId})
      .then((x) => x);

    documentService
      .getDocument(invoice.documentWithDetailsId)
      .then(async (doc) => {
        try {
          const url = await documentService.getPresignedDownloadUrl(doc);
          return reply.send({
            _meta: {},
            item: {
              _id: invoice.documentWithDetailsId,
              displayName: doc.displayName,
              url,
            },
          });
        } catch (error) {
          throw Promise.reject(error);
        }
      })
      .catch((error) => reply.send(Boom.badRequest(error)));
  }));
  next();
};
