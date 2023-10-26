const Boom = require('boom');
const NetworkService = require('../../services/network-srv');
const errorHandler = require('../../utils/error-handler');
const precontractualRepository = require('../../services/precontractual-srv/precontractual-repository');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Precontractual Get',
      description: 'Get a Precontractual',
      tags: ['precontractual'],
      params: {
        type: 'object',
        properties: {
          precontractualId: {
            type: 'string',
            description: 'precontractual id',
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
                documentId: {
                  type: 'integer',
                  description: 'Document Id',
                },
                documentNumber: {
                  type: 'string',
                  description: 'Document number',
                },
                issueDate: {
                  type: 'string',
                  description: 'issue date',
                },
                expiryDate: {
                  type: 'string',
                  description: 'expiry date',
                },
                documentuuid: {
                  type: 'string',
                  description: 'document uuid date',
                },
                documentType: {},
                attachmentObj: {},
                issueCountry: {
                  type: 'string',
                  description: 'Customer full name',
                },
                issueRegion: {
                  type: 'string',
                  description: 'Customer full name',
                },
                issueCity: {
                  type: 'string',
                  description: 'Customer full name',
                },

                issueAuthority: {},
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
      const sql = fastify.knex;
      const networkService = new NetworkService(fastify.mongo.db);
      const firstNode = await networkService.getFirstNode();
      if (!firstNode) return reply.send(Boom.badRequest('Rete non presente'));

      // eslint-disable-next-line max-len
      const document = await precontractualRepository.getDocumentByPrecontractualId(sql, request.params.precontractualId);

      return reply.send({
        _meta: {},
        item: document,
      });
    }),
  );
  next();
};
