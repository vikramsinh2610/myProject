const Boom = require('boom');
const LetterService = require("../../../services/letter-srv");
const DocumentService = require("../../../services/document-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Promoter Letter Activate',
      description: 'Set letter state as active',
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
    },
  };

  fastify.post('/', options, (request, reply) => {
    const letterService = new LetterService(fastify.mongo.db, fastify.log, fastify.knex);
    const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);

    letterService
      .activate(request.params.letterId, request.params.promoterId, documentService)
      .then(() => reply.send())
      .catch((error) => reply.send(Boom.badRequest(error)));
  });
  next();
};
