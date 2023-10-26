const Boom = require('boom');
const CustomerService = require("../../services/customer-srv");
const errorHandler = require("../../utils/error-handler");
const NetworkService = require("../../services/network-srv");
const { uuidToBinary } = require("../../utils/uuid-to-binary");

function getTypeFilter(type) {
  switch (type) {
    case 'contact':
      return { 'Tipo.key': 1 };
    case 'customer':
      return { 'Tipo.key': 2 };
    case 'all':
    default:
      return {};
  }
}

function getStatusFilter(status) {
  switch (status) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      return { 'Status.key': status };
    default:
      return {};
  }
}

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Customers List',
      description: 'Get Customers list',
      tags: ['customers'],
      querystring: {
        type: 'object',
        properties: {
          promoterId: {
            type: 'string',
            description: 'id of the root promoter for the summary',
          },
          networkId: {
            type: 'string',
            description: 'id of the root promoter for the summary',
          },
          skip: {
            type: 'integer',
            default: 0,
            description: 'Number of items to skip',
          },
          allPeriods: {
            type: 'boolean',
            default: false,
            description: 'Get all the customers',
          },
          contactType: {
            type: 'string',
            description: 'Customer or contact',
          },
          status: {
            type: 'integer',
            description: 'Customer or contact',
          },
          count: {
            type: 'integer',
            default: 20,
            description: 'Number of items to return',
          },
          type: {
            type: 'string',
            description: 'type id',
          },
          customerId: {
            type: 'string',
            description: 'string id of customer',
          },
          sortBy: {
            type: 'string',
            default: 'name',
            enum: ['name', 'surname', 'username', 'roleId', 'approved', 'lastLoginDate'],
            description: 'Sort by field',
          },
          sortDirection: {
            type: 'number',
            default: 1,
            enum: [-1, 1],
            description: 'Sort direction',
          },
          toProductivePeriodYear: {
            type: 'integer',
            description: 'To productive period - year',
          },
          toProductivePeriodMonth: {
            type: 'integer',
            description: 'To productive period - month',
          },
          fromProductivePeriodYear: {
            type: 'integer',
            description: 'From productive period - year',
          },
          fromProductivePeriodMonth: {
            type: 'integer',
            description: 'From productive period - month',
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
                  statusDisplayValue: {
                    type: 'string',
                    description: 'Customer status',
                  },
                  typeDisplayValue: {
                    type: 'string',
                    description: 'Customer type',
                  },
                  inherited: {
                    type: 'boolean',
                    description: 'Customer inherited',
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
                required: ['_id', 'displayName'],
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
      const networkService = new NetworkService(fastify.mongo.db);
      const firstNode = await networkService.userCanSee(
        request.identity.roleId,
        request.identity._id,
        request.query.promoterId,
      );
      if (!firstNode) return reply.send(Boom.badRequest('Utente non autorizzato'));
      const promoterToQuery =
        request.identity._id === request.query.promoterId
          ? undefined
          : request.query.promoterId;

      const customerService = new CustomerService(fastify.mongo.db);
      const customerAndPromoterIds = await customerService.prepareNetworkFilterIds(
        request.query.networkId || firstNode.model._id,
        promoterToQuery,
        {
          fromProductivePeriodYear: Number.parseInt(request.query.fromProductivePeriodYear, 10),
          fromProductivePeriodMonth: Number.parseInt(request.query.fromProductivePeriodMonth, 10),
          toProductivePeriodYear: Number.parseInt(request.query.toProductivePeriodYear, 10),
          toProductivePeriodMonth: Number.parseInt(request.query.toProductivePeriodMonth, 10),
          currentProductivePeriodYear: new Date().getFullYear(),
          currentProductivePeriodMonth: new Date().getMonth() + 1,
        },
        request.query.type,
      );

      const customerIDs = new Set(customerAndPromoterIds.map((el) => uuidToBinary(el.customerId)));
      const filter = {
        ...(request.query.customerId
          ? {
              _id: uuidToBinary(request.query.customerId),
            }
          : {
              _id: { $in: [...customerIDs] },
            }),
        ...getTypeFilter(request.query.contactType),
        ...getStatusFilter(request.query.status),
      };

      const customerItems = await customerService
        .getCustomers(request.query.skip, request.query.count, filter)
        .then((items) => items)
        .catch((error) => error);

      if (!Array.isArray(customerItems)) return reply.send(Boom.badRequest(customerItems.message));

      return reply.send({
        _meta: {},
        items: customerItems,
      });
    }),
  );
  next();
};
