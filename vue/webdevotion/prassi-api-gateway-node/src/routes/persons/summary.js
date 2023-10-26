const moment = require('moment');
const NetworkService = require('../../services/network-srv');
const errorHandler = require('../../utils/error-handler');
const { status: practiceStatus } = require('../../services/practice-srv/practice-status');

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
          customerId: {
            type: 'string',
            description: 'id of the customer',
          },
          contactType: {
            type: 'string',
            description: 'Customer or contact',
          },
          status: {
            type: 'integer',
            description: 'status of person',
          },
          practiceStatus: {
            type: 'integer',
            description: 'status of practice',
          },
          allPeriods: {
            type: 'boolean',
            default: false,
            description: 'Get all the customers birthday',
          },
          birthday: {
            type: 'boolean',
            default: false,
            description: 'Get all the customers birthday',
          },
          customerType: {
            type: 'integer',
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

      const promoterToQuery = request.identity._id === request.query.promoterId ? undefined : request.query.promoterId;

      const networkIds = await networkService.getNetworkListIdByPromoterAndPeriod(
        request.query.networkId || firstNode.model._id,
        promoterToQuery,
        request.query.type === 'indirect',
        request.query.toProductivePeriodYear,
        request.query.toProductivePeriodMonth,
      );

      const queryPersons = sql
        .count('person.id', { as: 'persons' })
        .from('person')
        .join('person_owner AS po', 'person.uuid', 'po.personId')
        // eslint-disable-next-line func-names
        .join('network_node AS nn', function () {
          // @ts-ignore
          this.on('nn.uuid', '=', 'po.networkNodeId')
            .andOn('nn.productivePeriodMonth', '=', request.query.toProductivePeriodMonth)
            .andOn('nn.productivePeriodYear', '=', request.query.toProductivePeriodYear);
        })
        .whereIn('po.networkNodeId', networkIds)
        .andWhere('po.productivePeriodMonth', request.query.toProductivePeriodMonth)
        .andWhere('po.productivePeriodYear', request.query.toProductivePeriodYear);

      const queryPracticesKpi = sql
        .from('practice')
        .countDistinct('practice.id', { as: 'pc' })
        .countDistinct('customerId', { as: 'insured' })
        .sum('amountPaid as premiums')
        .sum('iv as iv')
        // eslint-disable-next-line func-names,sonarjs/no-identical-functions
        .join('practice_owner AS po', function () {
          // @ts-ignore
          // eslint-disable-next-line max-len
          this.on(
            'po.uuid',
            '=',
            sql.raw(
              // eslint-disable-next-line max-len
              '(select uuid from practice_owner where practice_owner."dossierId" = "practice"."dossierId" order by "productivePeriodYear" desc, "productivePeriodMonth" desc limit 1)',
            ),
          );
        })
        .join('person', 'person.uuid', 'practice.customerId')
        // eslint-disable-next-line func-names,sonarjs/no-identical-functions
        .join('network_node AS nn', function () {
          // @ts-ignore
          this.on('nn.uuid', '=', 'po.networkNodeId')
            .andOn('nn.productivePeriodMonth', '=', request.query.toProductivePeriodMonth)
            .andOn('nn.productivePeriodYear', '=', request.query.toProductivePeriodYear);
        })
        .whereIn('po.networkNodeId', networkIds)
        .andWhereNot('practice.practiceType', 'cash-in');

      if (!request.query.allPeriods) {
        queryPracticesKpi
          .andWhere('practice.effectProductivePeriodMonth', request.query.toProductivePeriodMonth)
          .andWhere('practice.effectProductivePeriodYear', request.query.toProductivePeriodYear)
          .andWhere('po.productivePeriodMonth', request.query.toProductivePeriodMonth)
          .andWhere('po.productivePeriodYear', request.query.toProductivePeriodYear);
      }

      if (request.query.practiceStatus) {
        queryPracticesKpi
          .whereIn('practice.status', [request.query.practiceStatus]);
      } else {
        queryPracticesKpi
          .whereIn('practice.status', [
            practiceStatus.IN_VIGORE,
            practiceStatus.CHIUSA,
            practiceStatus.IN_ELABORAZIONE,
            practiceStatus.SOSPESA,
            practiceStatus.AL_CORRENTE,
          ]);
      }

      if (request.query.type === 'direct') {
        if (promoterToQuery) {
          queryPersons.andWhere('po.ownerId', promoterToQuery);
          queryPracticesKpi.andWhere('po.ownerId', promoterToQuery);
        } else {
          queryPersons.andWhere('po.networkNodeId', request.query.networkId || firstNode.model._id);
          queryPracticesKpi.andWhere('po.networkNodeId', request.query.networkId || firstNode.model._id);
        }
      }

      if (request.query.type === 'inherited') {
        queryPersons.andWhere('nn.inherited', true);
        queryPracticesKpi.andWhere('nn.inherited', true);
      }

      if (request.query.searchCustomer) {
        const searchCustomerArray = request.query.searchCustomer.split(' ');
        if (searchCustomerArray.length > 1) {
          // eslint-disable-next-line func-names,sonarjs/no-identical-functions
          queryPersons.andWhere(function () {
            // @ts-ignore
            this.where('person.name', 'ILIKE', `%${searchCustomerArray[0]}%`)
              .andWhere('person.surname', 'ILIKE', `%${searchCustomerArray[1]}%`);
          });
          // eslint-disable-next-line sonarjs/no-identical-functions,func-names
          queryPracticesKpi.andWhere(function () {
            // @ts-ignore
            this.where('person.name', 'ILIKE', `%${searchCustomerArray[0]}%`)
              .orWhere('person.surname', 'ILIKE', `%${searchCustomerArray[1]}%`);
          });
        } else {
          // eslint-disable-next-line func-names
          queryPersons.andWhere(function () {
            // @ts-ignore
            this.where('person.name', 'ILIKE', `%${request.query.searchCustomer}%`)
              .orWhere('person.surname', 'ILIKE', `%${request.query.searchCustomer}%`)
              .orWhere('person.companyName', 'ILIKE', `%${request.query.searchCustomer}%`);
          });

          // eslint-disable-next-line sonarjs/no-identical-functions,func-names
          queryPracticesKpi.andWhere(function () {
            // @ts-ignore
            this.where('person.name', 'ILIKE', `%${request.query.searchCustomer}%`)
              .orWhere('person.surname', 'ILIKE', `%${request.query.searchCustomer}%`)
              .orWhere('person.companyName', 'ILIKE', `%${request.query.searchCustomer}%`);
          });
        }
      }

      if (request.query.customerType && request.query.customerType !== 'all') {
        queryPersons.andWhere('person.customerType', request.query.customerType);
        queryPracticesKpi.andWhere('person.customerType', request.query.customerType);
      }

      if (request.query.status) {
        queryPersons.andWhere('person.status', request.query.status);
        queryPracticesKpi.andWhere('person.status', request.query.status);
      }

      if (request.query.birthday) {
        const previousWeek = moment().add(-1, 'weeks');
        const today = moment();
        queryPersons.whereRaw(
          `extract(DOY from person."birthDate"::date) <= extract(DOY from TIMESTAMP '${today.toISOString()}')`,
        );
        queryPersons.whereRaw(
          `extract(DOY from person."birthDate"::date) >= extract(DOY from TIMESTAMP '${previousWeek.toISOString()}')`,
        );
        queryPracticesKpi.whereRaw(
          `extract(DOY from person."birthDate"::date) <= extract(DOY from TIMESTAMP '${today.toISOString()}')`,
        );
        queryPracticesKpi.whereRaw(
          `extract(DOY from person."birthDate"::date) >= extract(DOY from TIMESTAMP '${previousWeek.toISOString()}')`,
        );
      }

      if (request.query.customerId) {
        queryPersons.andWhere('person.uuid', request.query.customerId);
        queryPracticesKpi.andWhere('practice.customerId', request.query.customerId);
      }

      const persons = await queryPersons.then((results) => results[0]);
      const practicesKpi = await queryPracticesKpi.then((results) => results[0]);

      return reply.send({
        _meta: {},
        item: {
          _id: request.params.promoterId,
          customers: persons.persons * 100,
          insured: practicesKpi.insured,
          premiums: practicesKpi.premiums * 100,
          iv: practicesKpi.iv * 100,
          pc: practicesKpi.pc * 100,
        },
      });
    }),
  );
  next();
};
