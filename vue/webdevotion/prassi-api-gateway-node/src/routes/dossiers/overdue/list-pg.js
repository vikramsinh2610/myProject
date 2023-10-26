const Boom = require('boom');
const NetworkService = require('../../../services/network-srv');
const errorHandler = require('../../../utils/error-handler');
const { periodOrToday, parse } = require('../../../utils/productive-period-helper');

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
          contractSearch: {
            type: 'string',
            description: 'text of the contract to search',
          },
          commissionType: {
            description: 'type of practice',
          },
          status: {
            type: 'integer',
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
          option: {
            type: 'integer',
            default: 2,
            description: 'Number of overdue installments',
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
    // eslint-disable-next-line sonarjs/cognitive-complexity
    errorHandler(async (request, reply) => {
      const sql = fastify.knex;

      const { productivePeriodYear, productivePeriodMonth } = periodOrToday(
        request.query.toProductivePeriodYear,
        request.query.toProductivePeriodMonth,
      );

      const productivePeriod = parse(productivePeriodYear, productivePeriodMonth);

      const networkService = new NetworkService(fastify.mongo.db);
      const firstNode = await networkService.userCanSeeProductivePeriod(
        request.identity.roleId,
        request.identity._id,
        request.query.promoterId,
        productivePeriodYear,
        productivePeriodMonth,
      );
      if (!firstNode) return reply.send(Boom.badRequest('Utente non autorizzato'));

      const promoterToQuery = request.identity._id === request.query.promoterId ? undefined : request.query.promoterId;

      const networkIds = await networkService.getNetworkListIdByPromoterAndPeriod(
        request.query.networkId || firstNode.model._id,
        promoterToQuery,
        request.query.type === 'indirect',
        productivePeriodYear,
        productivePeriodMonth,
      );

      const queryPractices = sql
        .from('practice_commission')
        .select(
          'practice_commission.dossierId',
          'practice_commission.contractId',
          'practice_commission.practiceId',
          'practice_commission.productName',
          'practice_commission.companyName',
          'practice_commission.installmentsPerYear',
          // eslint-disable-next-line max-len
          sql.raw('sum(CASE WHEN installment = 1 THEN practice_commission."premiumGross" ELSE 0 END) as "premiumGross"'),
          sql.raw('count(*) as installments'),
          sql.raw('SUM(CASE WHEN NOT confirmed THEN 1 ELSE 0 END) as "overdueInstallments"'),
          sql.raw('SUM(CASE WHEN NOT confirmed THEN iv ELSE 0 END) as iv'),
          // eslint-disable-next-line max-len
          sql.raw('SUM(CASE WHEN NOT confirmed THEN practice_commission."premiumGross" / practice_commission."installmentsPerYear" ELSE 0 END) as amount'),
        )
        // eslint-disable-next-line func-names
        .join('practice_owner AS po', function () {
          // @ts-ignore
          // eslint-disable-next-line max-len
          this.on('po.uuid', '=', sql.raw('(select uuid from practice_owner where practice_owner."dossierId" = "practice_commission"."dossierId" order by "productivePeriodYear" desc, "productivePeriodMonth" desc limit 1)'));
        })
        .join('person', 'person.uuid', 'practice_commission.customerId')
        // eslint-disable-next-line func-names,sonarjs/no-identical-functions
        .join('network_node AS nn', function () {
          // @ts-ignore
          this.on('nn.uuid', '=', 'po.networkNodeId')
            .andOn('nn.productivePeriodMonth', '=', productivePeriodMonth)
            .andOn('nn.productivePeriodYear', '=', productivePeriodYear);
        })
        .whereIn('po.networkNodeId', networkIds);

      if (!request.query.fullSearch) {
        queryPractices
          .andWhere('practice_commission.productivePeriod', '<=', productivePeriod);
      }

      if (request.query.type === 'direct') {
        if (promoterToQuery) {
          queryPractices.andWhere('po.ownerId', promoterToQuery);
        } else {
          queryPractices.andWhere('po.networkNodeId', request.query.networkId || firstNode.model._id);
        }
      }

      if (request.query.type === 'inherited') {
        queryPractices.andWhere('nn.inherited', true);
      }

      if (request.query.companyId) {
        queryPractices.andWhere('practice_commission.companyId', request.query.companyId);
      }

      if (request.query.productId) {
        queryPractices.andWhere('practice_commission.productId', request.query.productId);
      }

      if (request.query.confirmed) {
        queryPractices.andWhere('practice_commission.confirmed', request.query.confirmed === 'confirmed');
      }

      if (request.query.paid) {
        queryPractices.andWhere('practice_commission.paidToNetwork', request.query.paid === 'paid');
      }

      if (request.query.commissionType) {
        queryPractices.andWhere(
          'practice_commission.practiceType',
          request.query.commissionType === '2' ? 'additional-income' : 'subscription',
        );
      }

      if (request.query.searchCustomer) {
        // eslint-disable-next-line func-names
        queryPractices.andWhere(function () {
          // @ts-ignore
          this.where('person.name', 'ILIKE', `%${request.query.searchCustomer}%`)
            .orWhere('person.surname', 'ILIKE', `%${request.query.searchCustomer}%`)
            .orWhere('person.companyName', 'ILIKE', `%${request.query.searchCustomer}%`);
        });
      }

      if (request.query.contractSearch) {
        // eslint-disable-next-line func-names
        queryPractices.andWhere(function () {
          // @ts-ignore
          this.where('practice_commission.dossierId', 'ILIKE', `%${request.query.contractSearch}%`)
            .orWhere('practice_commission.contractId', 'ILIKE', `%${request.query.contractSearch}%`)
            .orWhere('practice_commission.practiceId', 'ILIKE', `%${request.query.contractSearch}%`);
        });
      }

      queryPractices.groupBy(
        'practice_commission.dossierId',
        'practice_commission.contractId',
        'practice_commission.practiceId',
        'practice_commission.productName',
        'practice_commission.companyName',
        'practice_commission.installmentsPerYear',
      ).havingRaw('SUM(CASE WHEN NOT confirmed THEN 1 ELSE 0 END) >= ?', [request.query.option]);
      const practices = await queryPractices
        .offset(request.query.skip)
        .limit(request.query.count)
        .then((results) => results);

      return reply.send({
        _meta: {},
        items: practices,
      });
    }),
  );
  next();
};
