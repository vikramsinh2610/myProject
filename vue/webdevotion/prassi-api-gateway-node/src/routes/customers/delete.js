const Boom = require('boom');
const CustomerService = require('../../services/customer-srv');
const NetworkService = require('../../services/network-srv');
const errorHandler = require('../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Customer Delete',
      description: 'Delete a Customer',
      tags: ['customer'],
      params: {
        type: 'object',
        properties: {
          customerId: {
            type: 'string',
            description: 'Customer ID',
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
                  description: 'Customer ID',
                },
                displayName: {
                  type: 'string',
                  description: 'Customer full name',
                },
                created: {
                  type: 'string',
                  description: 'Customer creation date',
                },
                displayAddress: {
                  type: 'string',
                  description: 'Customer address',
                },
                statusDisplayValue: {
                  type: 'string',
                  description: 'Customer status',
                },
                typeDisplayValue: {
                  type: 'string',
                  description: 'Customer type',
                },
                networkHierarchy: {
                  type: 'string',
                  description: 'Customer network',
                },
                promoterName: {
                  type: 'string',
                  description: 'Customer promoter name',
                },
                roleId: {
                  type: 'string',
                  description: 'Customer promoter name',
                },
                fiscalCode: {
                  type: 'string',
                  description: 'Customer full name',
                },
                fixedPhone: {
                  type: 'string',
                  description: 'Customer full name',
                },
                mobilePhone: {
                  type: 'string',
                  description: 'Customer full name',
                },
                birthDate: {
                  type: 'string',
                  description: 'Customer full name',
                },
                birthCity: {
                  type: 'string',
                  description: 'Customer full name',
                },
                physicalPerson: {
                  type: 'string',
                  description: 'Customer full name',
                },
                sex: {
                  type: 'string',
                  description: 'Customer full name',
                },
                email: {
                  type: 'string',
                  description: 'Customer full name',
                },
                birthRegion: {
                  type: 'string',
                  description: 'Customer full name',
                },
                birthState: {
                  type: 'string',
                  description: 'Customer full name',
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.delete(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const customerService = new CustomerService(fastify.mongo.db);
      const networkService = new NetworkService(fastify.mongo.db);
      const firstNode = await networkService.getFirstNode();
      if (!firstNode) return reply.send(Boom.badRequest('Rete non presente'));

      return customerService
        .deleteCustomerById(request.params.customerId)
        .then((result) =>
          reply.send({
            _meta: {},
            item: { result },
          }),
        )
        .catch((error) => reply.send(Boom.badRequest(error.message)));
    }),
  );
  next();
};
