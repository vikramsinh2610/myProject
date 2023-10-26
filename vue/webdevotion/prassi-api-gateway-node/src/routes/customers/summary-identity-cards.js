const KpiService = require('../../services/kpi-srv');
const NetworkService = require("../../services/network-srv");
const errorHandler = require("../../utils/error-handler");

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
          searchCustomer: {
            type: 'string',
            description: 'id of the root promoter for the summary',
          },
          contactType: {
            type: 'string',
            description: 'Customer or contact',
          },
          status: {
            type: 'integer',
            description: 'status of practice',
          },
          expired: {
            type: 'string',
            default: 'all',
            description: 'Get all the customers id expired',
          },
          complete: {
            type: 'string',
            default: 'all',
            description: 'Get all the customers id complete',
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
                customers: {
                  type: 'integer',
                  description: '# of customers',
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

      const networkService = new NetworkService(fastify.mongo.db);
      const firstNode = await networkService.userCanSeeProductivePeriod(
        request.identity.roleId,
        request.identity._id,
        request.query.promoterId,
        request.query.toProductivePeriodYear,
        request.query.toProductivePeriodMonth,
      );
      if (!firstNode)
        return reply.send({
          _meta: {},
          item: {
            _id: request.params.promoterId,
            customers: 0,
            insured: 0,
            premiums: 0,
            iv: 0,
            pc: 0,
          },
        });

      if (request.query.type === 'inherited') {
        return reply.send({
          _meta: {},
          item: {
            _id: request.params.promoterId,
            customers: '-',
            insured: '-',
            premiums: '-',
            iv: '-',
            pc: '-',
          },
        });
      }

      const promoterToQuery =
        request.identity._id === request.query.promoterId
          ? undefined
          : request.query.promoterId;

      const practicesKpi = await kpiService.sumCustomersIdentityCardsKpiByFilter(
        request.identity.roleId,
        firstNode.model._id,
        request.query.networkId || firstNode.model._id,
        promoterToQuery,
        request.query.searchCustomer,
        request.identity._id,
        request.query.type,
        request.query.contactType,
        request.query.status,
        request.query.expired,
        request.query.complete,
        fastify.edition,
        {
          fromProductivePeriodYear: Number.parseInt(request.query.fromProductivePeriodYear, 10),
          fromProductivePeriodMonth: Number.parseInt(request.query.fromProductivePeriodMonth, 10),
          toProductivePeriodYear: Number.parseInt(request.query.toProductivePeriodYear, 10),
          toProductivePeriodMonth: Number.parseInt(request.query.toProductivePeriodMonth, 10),
          currentProductivePeriodYear: new Date().getFullYear(),
          currentProductivePeriodMonth: new Date().getMonth() + 1,
        },
      );

      return reply.send({
        _meta: {},
        item: {
          _id: request.params.promoterId,
          customers: practicesKpi.customers,
          insured: practicesKpi.insured,
          premiums: Math.round(practicesKpi.premiumGross / 100),
          iv: Math.round(practicesKpi.iv / 100),
          pc: practicesKpi.count * 100,
        },
      });
    }),
  );
  next();
};
