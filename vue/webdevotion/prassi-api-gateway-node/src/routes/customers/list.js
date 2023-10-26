const Boom = require('boom');
const moment = require('moment');
const CustomerService = require('../../services/customer-srv');
const errorHandler = require('../../utils/error-handler');
const NetworkService = require('../../services/network-srv');
const CustomerInsurerService = require('../../services/customer-insurer-srv');
const roleIds = require('../../services/promoter-job-srv/role-ids');
const { uuidToBinary } = require('../../utils/uuid-to-binary');

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

async function getCustomerIds(customerService, request, firstNode) {
  const promoterToQuery = request.identity._id === request.query.promoterId ? undefined : request.query.promoterId;

  if (
    !promoterToQuery &&
    request.identity.roleId >= 7 &&
    !request.query.networkId &&
    !request.query.type &&
    Number.parseInt(request.query.fromProductivePeriodYear, 10) === new Date().getFullYear() &&
    Number.parseInt(request.query.fromProductivePeriodMonth, 10) === new Date().getMonth() + 1
  )
    return {};

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

  return {
    _id: { $in: [...customerIDs] },
  };
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
        required: [
          'toProductivePeriodYear',
          'toProductivePeriodMonth',
          'fromProductivePeriodYear',
          'fromProductivePeriodMonth',
        ],
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
          birthday: {
            type: 'boolean',
            default: false,
            description: 'Get all the customers birthday',
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
          searchCustomer: {
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
    // eslint-disable-next-line sonarjs/cognitive-complexity
    errorHandler(async (request, reply) => {
      const sql = fastify.knex;
      const networkService = new NetworkService(fastify.mongo.db);
      const firstNode = await networkService.userCanSeeProductivePeriod(
        request.identity.roleId,
        request.identity._id,
        request.query.promoterId,
        request.query.toProductivePeriodYear,
        request.query.toProductivePeriodMonth,
      );
      if (!firstNode) return reply.send(Boom.badRequest('Utente non autorizzato'));

      const customerInsurerService = new CustomerInsurerService(fastify.mongo.db, sql);
      const customerService = new CustomerService(fastify.mongo.db);

      const customerIDs = await getCustomerIds(customerService, request, firstNode);

      const previousWeek = moment().add(-1, 'weeks');
      const today = moment();
      const filter = {
        ...(request.query.searchCustomer
          ? {
              NomeCompleto: { $regex: request.query.searchCustomer, $options: 'i' },
            }
          : {}),
        ...customerIDs,
        ...(request.query.birthday
          ? {
              $expr: {
                $and: [
                  { $lte: [{ $dayOfYear: '$DataDiNascita' }, { $dayOfYear: today.toDate() }] },
                  { $gte: [{ $dayOfYear: '$DataDiNascita' }, { $dayOfYear: previousWeek.toDate() }] },
                  { $ne: [{ $year: '$DataDiNascita' }, 1] },
                ],
              },
            }
          : {}),
        ...getTypeFilter(request.query.contactType),
        ...getStatusFilter(request.query.status),
      };

      const customerItems = await customerService
        .getCustomers(
          request.query.type !== 'inherited' ? request.query.skip : 0,
          request.query.type !== 'inherited' ? request.query.count : 0,
          filter,
        )
        .then((items) => items)
        .catch((error) => error);

      if (!Array.isArray(customerItems)) return reply.send(Boom.badRequest(customerItems.message));

      const nodeList = await networkService.getNetworkListFlatPeriod(
        request.identity.roleId,
        request.identity._id,
        request.query.toProductivePeriodYear,
        request.query.toProductivePeriodMonth,
        true,
      );

      const jobs = await fastify.mongo.db
        .collection('promoter-job')
        .aggregate([
          { $sort: { _id: -1 } },
          {
            $group: {
              _id: {
                promoterId: '$promoterId',
              },
              roleId: { $first: '$roleId' },
            },
          },
          {
            $project: {
              promoterId: '$_id.promoterId',
              roleId: '$roleId',
            },
          },
        ])
        .toArray();

      const customerSliceEnriched = [];
      let startFrom = 0;
      const endCount =
        request.query.type !== 'inherited' ? request.query.count : request.query.skip + request.query.count;
      // eslint-disable-next-line security/detect-object-injection
      while (customerItems[startFrom] && customerSliceEnriched.length < endCount) {
        // eslint-disable-next-line security/detect-object-injection
        const item = customerItems[startFrom];
        startFrom += 1;

        // eslint-disable-next-line no-await-in-loop
        const customerInsurer = await customerInsurerService.getCustomerInsurer(
          item._id,
          request.query.toProductivePeriodYear,
          request.query.toProductivePeriodMonth,
        );

        let networkHierarchy = 'Nodo non trovato';
        let promoterName = 'Nessuno';
        let roleId = roleIds.NONE;
        let inherited = false;
        const nodeOriginalPeriod = nodeList.find((el) => el._id === customerInsurer.networkNodeId);
        if (nodeOriginalPeriod) {
          networkHierarchy = nodeOriginalPeriod.displayHierarchy;
          promoterName = nodeOriginalPeriod.validPromoterName;
          inherited = nodeOriginalPeriod.inherited;
          const thisJob = jobs.find((job) => job.promoterId === nodeOriginalPeriod.validPromoterId);
          if (thisJob) roleId = thisJob.roleId;
        }

        if (request.query.type !== 'inherited' || nodeOriginalPeriod.inherited) {
          customerSliceEnriched.push({
            ...item,
            inherited,
            networkHierarchy,
            promoterName,
            roleId,
          });
        }
      }

      return reply.send({
        _meta: {},
        items:
          request.query.type !== 'inherited'
            ? customerSliceEnriched
            : customerSliceEnriched.slice(request.query.skip-customerSliceEnriched.length),
      });
    }),
  );
  next();
};
