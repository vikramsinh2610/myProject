const Boom = require('boom');
const KpiService = require('../../../services/kpi-srv');
const NetworkService = require("../../../services/network-srv");
const errorHandler = require("../../../utils/error-handler");
const { periodOrToday } = require('../../../utils/productive-period-helper');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Dossiers List',
      description: 'Get dossier list for specified promoter',
      tags: ['invoicing'],
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
            description: 'id of the customer for the summary',
          },
          fullSearch: {
            type: 'string',
            description: 'full periods search flag',
          },
          solarSearch: {
            type: 'string',
            description: 'solar periods search flag',
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
          skip: {
            type: 'integer',
            default: 0,
            description: 'Number of items to skip',
          },
          count: {
            type: 'integer',
            default: 20,
            description: 'Number of items to return',
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
      if (!firstNode) return reply.send(Boom.badRequest('Utente non autorizzato'));

      const promoterToQuery =
        request.identity._id === request.query.promoterId
          ? undefined
          : request.query.promoterId;

      return kpiService
        .listProposalsKpiByFilter(
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
          request.query.skip,
          request.query.count,
        )
        .then((practices) => reply.send({ _meta: {}, items: practices }))
        .catch((error) => reply.send(Boom.badRequest(error)));
    }),
  );
  next();
};
