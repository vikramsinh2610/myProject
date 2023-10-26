const Boom = require('boom');
const CustomerService = require("../../services/customer-srv");
const NetworkService = require("../../services/network-srv");
const CustomerInsurerService = require("../../services/customer-insurer-srv");
const errorHandler = require("../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Customer Get',
      description: 'Get a Customer',
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
                inherited: {
                  type: 'boolean',
                  description: 'Customer inherited',
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

  fastify.get(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const sql = fastify.knex;
      const customerService = new CustomerService(fastify.mongo.db);
      const networkService = new NetworkService(fastify.mongo.db);
      const firstNode = await networkService.getFirstNode();
      if (!firstNode) return reply.send(Boom.badRequest('Rete non presente'));
      const nodeList = await networkService.getNetworkListFlat(request.identity.roleId, request.identity._id);
      const customerInsurerService = new CustomerInsurerService(fastify.mongo.db, sql);

      return customerService
        .getCustomerById(request.params.customerId)
        .then(async (customer) => {
          const customerInsurer = await customerInsurerService.getCustomerInsurerLast(request.params.customerId);

          let networkHierarchy = 'Nodo non trovato';
          let promoterName = 'Nessuno';
          let inherited = false;
          const nodeOriginalPeriod = nodeList.find((el) => el._id === customerInsurer.networkNodeId);
          if (nodeOriginalPeriod) {
            networkHierarchy = nodeOriginalPeriod.displayHierarchy;
            promoterName = nodeOriginalPeriod.validPromoterName;
            inherited = nodeOriginalPeriod.inherited;
          }

          return reply.send({
            _meta: {},
            item: {
              ...customer,
              displayAddress: customer.legalAddress.displayAddress
                ? customer.legalAddress.displayAddress
                : customer.address.displayAddress,
              networkHierarchy,
              promoterName,
              inherited,
            },
          });
        })
        .catch((error) => reply.send(Boom.badRequest(error.message)));
    }),
  );
  next();
};
