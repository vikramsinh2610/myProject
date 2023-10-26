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
            personId: {
              type: 'string',
              description: 'Person uuid',
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
                properties: {
                  id: {
                    type: 'number',
                    description: 'Precontractual ID',
                  },
                  personId: {
                    type: 'number',
                    description: 'Person ID',
                  },
                  status: {
                    type: 'number',
                    description: 'Precontractual status',
                  },
                  stepper: {
                    type: 'number',
                    description: 'Precontractual status',
                  },
                  createdDate: {
                    type: 'string',
                  },
                  signedDate: {
                    type: 'string',
                  },
                  inherited: {
                    type: 'boolean',
                    description: 'Customer inherited',
                  },
                  displayHierarchy: {
                    type: 'string',
                    description: 'Customer network',
                  },
                  displayName: {
                    type: 'string',
                    description: 'Customer promoter name',
                  },
                  roleId: {
                    type: 'string',
                    description: 'Customer promoter name',
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

      const precontractual = await precontractualRepository.getSummarybyUuid(sql, request.params.personId);

      return reply.send({
        _meta: {},
        items: precontractual || {},
      });
    }),
  );
  next();
};
