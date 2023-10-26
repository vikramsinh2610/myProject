const NetworkService = require("../../../services/network-srv");
const errorHandler = require("../../../utils/error-handler");
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
          confirmed: {
            type: 'string',
            description: 'confirmed id',
          },
          paid: {
            type: 'string',
            description: 'paid id',
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
                dossiers: {
                  type: 'integer',
                  description: '# of dossiers',
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
    // eslint-disable-next-line sonarjs/cognitive-complexity
    errorHandler(async (request, reply) => {
      const sql = fastify.knex;

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
            insured: 0,
            premiums: 0,
            dossiers: 0,
          },
        });

      const promoterToQuery =
        request.identity._id === request.query.promoterId
          ? undefined
          : request.query.promoterId;

      const networkIds = await networkService.getNetworkListIdByPromoterAndPeriod(
        request.query.networkId || firstNode.model._id,
        promoterToQuery,
        request.query.type === 'indirect',
        productivePeriodYear,
        productivePeriodMonth,
      );

      const queryPracticesKpi = sql
        .from('practice_commission')
        .countDistinct('practice_commission.id', { as: 'pc' })
        .countDistinct('practice_commission.dossierId', { as: 'dossiers' })
        .countDistinct('customerId', { as: 'customers' })
        .countDistinct('insurerId', { as: 'consultants' })
        .sum('premiumGross as premiumGross')
        .sum('iv as iv')
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
        queryPracticesKpi
          .andWhere('practice_commission.productivePeriodYear', productivePeriodYear)
          .andWhere('practice_commission.productivePeriodMonth', productivePeriodMonth);
      }

      if (request.query.type === 'direct') {
        if (promoterToQuery) {
          queryPracticesKpi.andWhere('po.ownerId', promoterToQuery);
        } else {
          queryPracticesKpi.andWhere('po.networkNodeId', request.query.networkId || firstNode.model._id);
        }
      }

      if (request.query.type === 'inherited') {
        queryPracticesKpi.andWhere('nn.inherited', true);
      }

      if (request.query.companyId) {
        queryPracticesKpi.andWhere('practice_commission.companyId', request.query.companyId);
      }

      if (request.query.productId) {
        queryPracticesKpi.andWhere('practice_commission.productId', request.query.productId);
      }

      if (request.query.confirmed) {
        queryPracticesKpi.andWhere(
          'practice_commission.confirmed',
          request.query.confirmed === 'confirmed',
        );
      }

      if (request.query.paid) {
        queryPracticesKpi.andWhere(
          'practice_commission.paidToNetwork',
          request.query.paid === 'paid',
        );
      }

      if (request.query.commissionType) {
        queryPracticesKpi.andWhere(
          'practice_commission.practiceType',
          request.query.commissionType === '2' ? 'additional-income' : 'subscription',
        );
      }

      if (request.query.searchCustomer) {
        // eslint-disable-next-line func-names
        queryPracticesKpi.andWhere(function () {
          // @ts-ignore
          this.where('person.name', 'ILIKE', `%${request.query.searchCustomer}%`)
            .orWhere('person.surname', 'ILIKE', `%${request.query.searchCustomer}%`)
            .orWhere('person.companyName', 'ILIKE', `%${request.query.searchCustomer}%`);
        });
      }

      if (request.query.contractSearch) {
        // eslint-disable-next-line func-names
        queryPracticesKpi.andWhere(function () {
          // @ts-ignore
          this.where('practice_commission.dossierId', 'ILIKE', `%${request.query.contractSearch}%`)
            .orWhere('practice_commission.contractId', 'ILIKE', `%${request.query.contractSearch}%`)
            .orWhere('practice_commission.practiceId', 'ILIKE', `%${request.query.contractSearch}%`);
        });
      }

      const practicesKpi = await queryPracticesKpi.then((results) => results[0]);

      return reply.send({
        _meta: {},
        item: {
          _id: request.params.promoterId,
          consultants: practicesKpi.consultants,
          insured: practicesKpi.customers,
          premiums: Math.round(practicesKpi.premiumGross),
          iv: Math.round(practicesKpi.iv / 100),
          pc: practicesKpi.pc * 100,
          dossiers: practicesKpi.dossiers * 100,
        },
      });
    }),
  );
  next();
};
