const Boom = require('boom');
const LetterService = require("../../../services/letter-srv");
const DocumentService = require("../../../services/document-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Promoter Letter Copy',
      description: 'Copy a promoter letter to other promoters',
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
            description: 'Promoter ID',
          },
        },
      },
      querystring: {
        type: 'object',
        properties: {
          activate: {
            type: 'boolean',
            default: true,
            description: 'Activate letters after copy',
          },
        },
      },
      body: {
        type: 'object',
        required: ['promoterIds'],
        properties: {
          promoterIds: {
            type: 'array',
            description: 'List of promoter IDs to export the letter',
            items: {
              type: 'string',
            },
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
                required: ['promoterId', 'copyOk', 'activationOk'],
                properties: {
                  promoterId: {
                    type: 'string',
                    description: 'Promoter of letter',
                  },
                  copyOk: {
                    type: 'boolean',
                    description: 'If copy has succedeed',
                  },
                  activationOk: {
                    type: 'boolean',
                    description: 'If activation has succedeed',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.post('/', options, (request, reply) => {
    const letterService = new LetterService(fastify.mongo.db, fastify.log, fastify.knex);
    const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);

    letterService
      .getLetter(request.params.promoterId, request.params.letterId)
      .then((letter) =>
        Promise.all(
          request.body.promoterIds.map(async (promoterId) => {
            let letterCopy;
            try {
              const letterEmpty = await letterService.createLetter(promoterId, letter.type);
              letterCopy = await letterService.updateLetter(letterEmpty._id, letterEmpty.promoterId, {
                ...letter,
                attachmentIds: [],
              });
            } catch {
              return Promise.resolve({ promoterId, copyOk: false, activationOk: false });
            }
            if (request.query.activate) {
              try {
                await letterService.activate(letterCopy._id, promoterId, documentService);
                return Promise.resolve({ promoterId, copyOk: true, activationOk: true });
              } catch {
                return Promise.resolve({ promoterId, copyOk: true, activationOk: false });
              }
            }
            return Promise.resolve({ promoterId, copyOk: true, activationOk: false });
          }),
        ),
      )
      .then((result) =>
        reply.send({
          _meta: {},
          items: result,
        }),
      )
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
