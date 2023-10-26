const Boom = require('boom');
const DocumentService = require("../../../../services/document-srv");
const LetterService = require("../../../../services/letter-srv");
const { types } = require("../../../../services/document-srv/document-types");
const letterTypes = require("../../../../services/letter-srv/letter-types");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Promoter Letter Attachments Add',
      description: 'Add letter attachment',
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
          attachmentId: {
            type: 'string',
            description: 'Attachment ID',
          },
        },
      },
      querystring: {
        type: 'object',
        required: ['letterType', 'attachmentName'],
        properties: {
          letterType: {
            type: 'string',
            enum: Object.values(letterTypes.types),
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
    const letterService = new LetterService(fastify.mongo.db, fastify.log, fastify.knex);

    letterService
      .updateLetter(request.params.letterId, request.params.promoterId, {
        attachmentIds: [request.params.attachmentId],
      })
      .then(() =>
        documentService.addDocument({
          _id: request.params.attachmentId,
          type: types.LETTER_ATTACHMENT,
          ownerId: request.params.promoterId,
          displayName: request.query.attachmentName,
          locked: false,
          additionalData: {
            letterId: request.params.letterId,
            attachmentType: request.query.letterType,
          },
        }),
      )
      .then(() => reply.send())
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
