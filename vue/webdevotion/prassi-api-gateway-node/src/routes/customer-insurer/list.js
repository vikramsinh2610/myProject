const Mongo = require('mongodb');
const Boom = require('boom');
const CustomerService = require("../../services/customer-srv");
const NetworkService = require("../../services/network-srv");
const { parse } = require("../../utils/productive-period-helper");
require('../../utils/foreach');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'customer Insurer List',
      description: 'Get customer Insurer list',
      tags: ['configuration'],
      querystring: {
        type: 'object',
        properties: {
          skip: {
            type: 'integer',
            mimimum: 0,
            default: 0,
            description: 'Number of items to skip',
          },
          count: {
            type: 'integer',
            default: 20,
            description: 'Number of items to return',
          },
          fullTextSearch: {
            type: 'string',
            description: 'Free text for full text search',
          },
          sortBy: {
            type: 'string',
            default: '_id',
            enum: ['customerId', 'time'],
            description: 'Sort by field',
          },
          sortDirection: {
            type: 'number',
            default: 1,
            enum: [-1, 1],
            description: 'Sort direction',
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
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: {
                    type: 'string',
                    description: 'Record ID',
                  },
                  customerId: {
                    type: 'string',
                    description: 'customer ID',
                  },
                  networkNodeId: {
                    type: 'string',
                    description: 'Network Node ID',
                  },
                  networkHierarchy: {
                    type: 'string',
                    description: 'Network name',
                  },
                  productivePeriodMonth: {
                    type: 'number',
                    description: 'Month',
                  },
                  productivePeriodYear: {
                    type: 'number',
                    description: 'Year',
                  },
                  promoterId: {
                    type: 'string',
                    description: 'Promoter ID',
                  },
                  promoterName: {
                    type: 'string',
                    description: 'Promoter name',
                  },
                  displayCustomerName: {
                    type: 'string',
                    description: 'Customer name',
                  },
                  inherited: {
                    type: 'boolean',
                    description: 'Customer inherited',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.get('/', options, (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;
    const networkService = new NetworkService(db);
    const customerService = new CustomerService(db);

    const filter = {
      $and: [
        request.query.networkid ? { networkNodeId: { $eq: request.query.networkid } } : {},
        request.query.promoterid ? { promoterId: { $eq: request.query.promoterid } } : {},
        request.query.customerId ? { customerId: { $eq: request.query.customerId } } : {},
      ],
    };

    const projection = {
      _id: true,
      customerId: true,
      networkNodeId: true,
      productivePeriodMonth: true,
      productivePeriodYear: true,
      promoterId: true,
    };

    const sortBy =
      request.query.sortBy === 'customerId'
        ? { customerId: request.query.sortDirection, productivePeriodYear: -1, productivePeriodMonth: -1 }
        : { productivePeriodYear: request.query.sortDirection, productivePeriodMonth: request.query.sortDirection };

    db.collection('customer-insurer')
      .find(filter, { projection })
      .sort(sortBy)
      .skip(request.query.skip)
      .limit(request.query.count)
      .toArray()
      .then(async (list) => {
        const nodeListMap = new Map();

        const listEnriched = [];
        // @ts-ignore
        await list.forEachAsync(async (customer) => {
          const customerPeriod = parse(customer.productivePeriodYear, customer.productivePeriodMonth);
          let nodeList = nodeListMap.get(customerPeriod);
          if (!nodeList) {
            nodeList = await networkService.getNetworkListFlatPeriod(
              request.identity.roleId,
              request.identity._id,
              customer.productivePeriodYear,
              customer.productivePeriodMonth,
              true
            );
            nodeListMap.set(customerPeriod, nodeList);
          }

          let networkHierarchy = 'Nodo non trovato';
          let promoterName = 'Nessuno';
          let inherited = false;
          const nodeOriginalPeriod = nodeList.find((item) => item._id === customer.networkNodeId);
          if (nodeOriginalPeriod) {
            networkHierarchy = nodeOriginalPeriod.displayHierarchy;
            promoterName = nodeOriginalPeriod.validPromoterName;
            inherited = nodeOriginalPeriod.inherited;
          }

          const { name, surname } = await customerService.getCustomerById(customer.customerId);
          listEnriched.push({
            ...customer,
            displayCustomerName: `${name} ${surname}`,
            networkHierarchy,
            promoterName,
            inherited,
          });
        });

        return listEnriched;
      })
      .then((list) => reply.send({ _meta: {}, items: list }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
