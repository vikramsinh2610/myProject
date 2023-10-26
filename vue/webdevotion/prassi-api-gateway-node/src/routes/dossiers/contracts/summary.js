const KpiService = require('../../../services/kpi-srv');
const NetworkService = require('../../../services/network-srv');
const errorHandler = require('../../../utils/error-handler');
const { periodOrToday } = require('../../../utils/productive-period-helper');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Dossiers Summary Get',
      description: 'Summary of dossiers',
      tags: ['promoters'],
      querystring: {
        type: 'object',
        required: [
          'promoterId',
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
          fullSearch: {
            type: 'string',
            description: 'full periods search flag',
          },
          solarSearch: {
            type: 'string',
            description: 'solar periods search flag',
          },
          searchCustomer: {
            type: 'string',
            description: 'id of the root promoter for the summary',
          },
          contractSearch: {
            type: 'string',
            description: 'text of the contract to search',
          },
          commissionType: {
            description: 'type of practice',
          },
          status: {
            description: 'status of practice',
          },
          companyId: {
            type: 'string',
            description: 'company id',
          },
          productId: {
            type: 'string',
            description: 'product id',
          },
          type: {
            type: 'string',
            description: 'type id',
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
                  description: '_id promoter',
                },
                nodes: {
                  type: 'integer',
                  description: '# of nodes',
                },
                consultants: {
                  type: 'integer',
                  description: '# of consultants',
                },
                insured: {
                  type: 'integer',
                  description: '# of insured',
                },
                premiums: {
                  type: 'integer',
                  description: '# of premiums',
                },
                iv: {
                  type: 'integer',
                  description: '# of iv',
                },
                pc: {
                  type: 'integer',
                  description: '# of pc',
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
      const kpiService = new KpiService(fastify.mongo.db, fastify.knex);
      const { productivePeriodYear, productivePeriodMonth } = periodOrToday(
        request.query.toProductivePeriodYear,
        request.query.toProductivePeriodMonth,
      );

      const networkService = new NetworkService(fastify.mongo.db);
      const firstNode = await networkService.userCanSeeProductivePeriod(
        request.identity.roleId,
        request.identity._id,
        request.query.promoterId,
        productivePeriodYear,
        productivePeriodMonth,
      );
      if (!firstNode)
        return reply.send({
          _meta: {},
          item: {
            _id: request.params.promoterId,
            consultants: 0,
            nodes: 0,
            insured: 0,
            premiums: 0,
            iv: 0,
            pc: 0,
          },
        });

      const promoterToQuery = request.identity._id === request.query.promoterId ? undefined : request.query.promoterId;

      const practicesKpi = await kpiService.sumContractsKpiByFilter(
        request.query.networkId || firstNode.model._id,
        promoterToQuery,
        request.query.contractSearch,
        request.query.commissionType ? JSON.parse(request.query.commissionType) : [],
        request.query.companyId,
        request.query.productId,
        request.query.searchCustomer,
        request.query.fullSearch,
        request.query.solarSearch,
        request.query.status ? JSON.parse(request.query.status) : [],
        request.query.type,
        {
          fromProductivePeriodYear: Number.parseInt(request.query.fromProductivePeriodYear, 10),
          fromProductivePeriodMonth: Number.parseInt(request.query.fromProductivePeriodMonth, 10),
          toProductivePeriodYear: Number.parseInt(request.query.toProductivePeriodYear, 10),
          toProductivePeriodMonth: Number.parseInt(request.query.toProductivePeriodMonth, 10),
          currentProductivePeriodYear: new Date().getFullYear(),
          currentProductivePeriodMonth: new Date().getMonth() + 1,
        },
      );

      const networkLast = await networkService.getNetworkListFlatPeriod(
        request.identity.roleId,
        promoterToQuery,
        Number.parseInt(request.query.fromProductivePeriodYear, 10),
        Number.parseInt(request.query.fromProductivePeriodMonth, 10),
      );

      return reply.send({
        _meta: {},
        item: {
          _id: request.params.promoterId,
          consultants: practicesKpi.consultants,
          nodes: networkLast.filter((el) => el.promoterId).length,
          insured: practicesKpi.customers,
          premiums: Math.round(practicesKpi.premiumGross / 100),
          iv: Math.round(practicesKpi.iv / 100),
          pc: practicesKpi.count * 100,
        },
      });
    }),
  );
  next();
};
