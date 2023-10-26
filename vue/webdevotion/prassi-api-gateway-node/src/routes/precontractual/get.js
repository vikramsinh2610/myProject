const Boom = require('boom');
const NetworkService = require("../../services/network-srv");
const errorHandler = require("../../utils/error-handler");
const precontractualRepository = require("../../services/precontractual-srv/precontractual-repository");

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
              description: 'Precontractual id',
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
                id: {
                  type: 'string',
                  description: 'Precontractual ID',
                },
                linkedPersonId: {
                  type: 'string',
                  description: 'linked person ID',
                },
                personId: {
                  type: 'string',
                  description: 'Person ID',
                },
                status: {
                  type: 'number',
                  description: 'Precontractual status',
                },
                stepperStatus: {
                  type: 'object',
                  properties: {
                    stepper: {
                      type: 'array',
                      description: 'Precontractual stepper array',
                    },
                  },
                },
                documentId: {
                  type: 'integer',
                  description: 'Document Id',
                },
                documentNumber: {
                  type: 'string',
                  description: 'Document number',
                },
                createdDate: {
                  type: 'string',
                },
                signedDate: {
                  type: 'string',
                },
                documentuuid: {
                  type: 'string',
                  description: 'document uuid date',
                },
                documentType: {},
                attachmentObj: {},
                fiscalCodeFile: {},
                signatureMandate: {},
                signaturePrivacy: {},
                signatureOtp: {},
                signatureDocuments: {},
                minimalCheck:  {
                  type: 'boolean',
                  description: 'check',
                },
                marketingCheck:  {
                  type: 'boolean',
                  description: 'check',
                },
                noPolicyLimits:  {
                  type: 'boolean',
                  description: 'check',
                },
                profileCheck:  {
                  type: 'boolean',
                  description: 'check',
                },
                signPlacePrivacy: {
                  type: 'string',
                },
                signPlaceMandate: {
                  type: 'string',
                },
                signPlaceOtp: {
                  type: 'string',
                },
                policies: {
                  type: 'string',
                },
                vatDocumentType:{},
                vatIssueDate: {
                  type: 'string',
                },
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

      const precontractual = await precontractualRepository.getbyId(sql, request.params.precontractualId);

      return reply.send({
        _meta: {},
        item: precontractual,
      });
    }),
  );
  next();
};
