const Boom = require('boom');
const moment = require('moment');
const errorHandler = require('../../utils/error-handler');
const NetworkService = require('../../services/network-srv');

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
          customerType: {
            type: 'integer',
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
                  displayname: {
                    type: 'string',
                    description: 'Customer full name',
                  },
                  name: {
                    type: 'string',
                    description: 'Customer full name',
                  },
                  surname: {
                    type: 'string',
                    description: 'Customer full name',
                  },
                  companyName: {
                    type: 'string',
                    description: 'Customer full name',
                  },
                  created: {
                    type: 'string',
                    description: 'Customer creation date',
                  },
                  status: {
                    type: 'integer',
                    description: 'Customer status',
                  },
                  customerType: {
                    type: 'integer',
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
                  isCompany: {
                    type: 'boolean',
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
                  duplicated: {
                    type: 'string',
                    description: 'Customer full name',
                  },
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
      if (!firstNode) return reply.send(Boom.badRequest('Utente non autorizzato'));

      const promoterToQuery = request.identity._id === request.query.promoterId ? undefined : request.query.promoterId;

      const networkIds = await networkService.getNetworkListIdByPromoterAndPeriod(
        request.query.networkId || firstNode.model._id,
        promoterToQuery,
        request.query.type === 'indirect',
        request.query.toProductivePeriodYear,
        request.query.toProductivePeriodMonth,
      );

      const query = sql
        .distinct(
          'person.fiscalCode',
          'pother.uuid as _id',
          'pother.name',
          'pother.surname',
          'pother.birthDate',
          'pother.creationDate as created',
          'pother.companyName',
          'pother.isCompany',
          'pother.sex',
          'pother.status',
          'pother.customerType',
          'nn.roleId',
          'nn.inherited',
          'nn.displayHierarchy as networkHierarchy',
          'nn.validPromoterName as promoterName',
          'pother.isCompany',
          sql.raw(
            // eslint-disable-next-line max-len
            `CASE WHEN pother."isCompany" THEN pother."companyName" ELSE CONCAT(pother.name, ' ',pother.surname) END as displayname`,
          ),
          sql.raw(
            // eslint-disable-next-line max-len
            `(select count(*) from "person" as "ip" where person."fiscalCode" = ip."fiscalCode") as duplicated`,
          ),
        )
        .from('person')
        .joinRaw(
          // eslint-disable-next-line max-len
          `inner join person as pother on pother."uuid" = (select jpo.uuid from "person" as jpo inner join "person_owner" as "po_jpo" on "jpo"."uuid" = "po_jpo"."personId" where jpo."fiscalCode" = "person"."fiscalCode" limit 1)`,
        )
        .join('person_owner AS po', 'pother.uuid', 'po.personId')
        // eslint-disable-next-line func-names
        .join('network_node AS nn', function () {
          // @ts-ignore
          this.on('nn.uuid', '=', 'po.networkNodeId')
            .andOn('nn.productivePeriodMonth', '=', request.query.toProductivePeriodMonth)
            .andOn('nn.productivePeriodYear', '=', request.query.toProductivePeriodYear);
        })
        .whereIn('po.networkNodeId', networkIds)
        .andWhere('po.productivePeriodMonth', request.query.toProductivePeriodMonth)
        .andWhere('po.productivePeriodYear', request.query.toProductivePeriodYear)
        .andWhere('person.fiscalCode', '!=', '');

      if (request.query.type === 'direct') {
        if (promoterToQuery) {
          query.andWhere('po.ownerId', promoterToQuery);
        } else {
          query.andWhere('po.networkNodeId', request.query.networkId || firstNode.model._id);
        }
      }

      if (request.query.type === 'inherited') {
        query.andWhere('nn.inherited', true);
      }

      if (request.query.searchCustomer) {
        const searchCustomerArray = request.query.searchCustomer.split(' ');
        if (searchCustomerArray.length > 1) {
          // eslint-disable-next-line func-names,sonarjs/no-identical-functions
          query.andWhere(function () {
            // @ts-ignore
            this.where('person.name', 'ILIKE', `%${searchCustomerArray[0]}%`).andWhere(
              'person.surname',
              'ILIKE',
              `%${searchCustomerArray[1]}%`,
            );
          });
        } else {
          // eslint-disable-next-line func-names
          query.andWhere(function () {
            // @ts-ignore
            this.where('person.name', 'ILIKE', `%${request.query.searchCustomer}%`)
              .orWhere('person.surname', 'ILIKE', `%${request.query.searchCustomer}%`)
              .orWhere('person.companyName', 'ILIKE', `%${request.query.searchCustomer}%`);
          });
        }
      }

      if (request.query.customerType && request.query.customerType !== 'all') {
        query.andWhere('person.customerType', request.query.customerType);
      }

      if (request.query.status) {
        query.andWhere('person.status', request.query.status);
      }

      if (request.query.birthday) {
        const previousWeek = moment().add(-1, 'weeks');
        const today = moment();
        query.whereRaw(
          `extract(DOY from person."birthDate"::date) <= extract(DOY from TIMESTAMP '${today.toISOString()}')`,
        );
        query.whereRaw(
          `extract(DOY from person."birthDate"::date) >= extract(DOY from TIMESTAMP '${previousWeek.toISOString()}')`,
        );
      }

      // eslint-disable-next-line func-names
      query.union(function () {
        const queryU = this.select(
          'person.fiscalCode',
          'person.uuid as _id',
          'person.name',
          'person.surname',
          'person.birthDate',
          'person.creationDate as created',
          'person.companyName',
          'person.isCompany',
          'person.sex',
          'person.status',
          'person.customerType',
          'nn.roleId',
          'nn.inherited',
          'nn.displayHierarchy as networkHierarchy',
          'nn.validPromoterName as promoterName',
          'person.isCompany',
          sql.raw(
            // eslint-disable-next-line max-len
            `CASE WHEN person."isCompany" THEN person."companyName" ELSE CONCAT(person.name, ' ',person.surname) END as displayname`,
          ),
          sql.raw(
            // eslint-disable-next-line max-len
            `1 as ip`,
          ),
        )
          .from('person')
          .join('person_owner AS po', 'person.uuid', 'po.personId')
          // eslint-disable-next-line func-names,sonarjs/no-identical-functions
          .join('network_node AS nn', function () {
            // @ts-ignore
            this.on('nn.uuid', '=', 'po.networkNodeId')
              .andOn('nn.productivePeriodMonth', '=', request.query.toProductivePeriodMonth)
              .andOn('nn.productivePeriodYear', '=', request.query.toProductivePeriodYear);
          })
          .whereIn('po.networkNodeId', networkIds)
          .andWhere('po.productivePeriodMonth', request.query.toProductivePeriodMonth)
          .andWhere('po.productivePeriodYear', request.query.toProductivePeriodYear)
          // eslint-disable-next-line func-names
          .andWhere(function () {
            // @ts-ignore
            this.where('person.fiscalCode', '=', '').orWhereNull('person.fiscalCode');
          });

        if (request.query.type === 'direct') {
          if (promoterToQuery) {
            queryU.andWhere('po.ownerId', promoterToQuery);
          } else {
            queryU.andWhere('po.networkNodeId', request.query.networkId || firstNode.model._id);
          }
        }

        if (request.query.type === 'inherited') {
          queryU.andWhere('nn.inherited', true);
        }

        if (request.query.searchCustomer) {
          const searchCustomerArray = request.query.searchCustomer.split(' ');
          if (searchCustomerArray.length > 1) {
            // eslint-disable-next-line func-names,sonarjs/no-identical-functions
            queryU.andWhere(function () {
              // @ts-ignore
              this.where('person.name', 'ILIKE', `%${searchCustomerArray[0]}%`).andWhere(
                'person.surname',
                'ILIKE',
                `%${searchCustomerArray[1]}%`,
              );
            });
          } else {
            // eslint-disable-next-line sonarjs/no-identical-functions,func-names
            queryU.andWhere(function () {
              // @ts-ignore
              this.where('person.name', 'ILIKE', `%${request.query.searchCustomer}%`)
                .orWhere('person.surname', 'ILIKE', `%${request.query.searchCustomer}%`)
                .orWhere('person.companyName', 'ILIKE', `%${request.query.searchCustomer}%`);
            });
          }
        }

        if (request.query.customerType && request.query.customerType !== 'all') {
          queryU.andWhere('person.customerType', request.query.customerType);
        }

        if (request.query.status) {
          queryU.andWhere('person.status', request.query.status);
        }

        if (request.query.birthday) {
          const previousWeek = moment().add(-1, 'weeks');
          const today = moment();
          queryU.whereRaw(
            `extract(DOY from person."birthDate"::date) <= extract(DOY from TIMESTAMP '${today.toISOString()}')`,
          );
          queryU.whereRaw(
            `extract(DOY from person."birthDate"::date) >= extract(DOY from TIMESTAMP '${previousWeek.toISOString()}')`,
          );
        }
      });

      const persons = await query
        .offset(request.query.skip)
        .limit(request.query.count)
        .then((results) => results);

      return reply.send({
        _meta: {},
        items: persons,
      });
    }),
  );
  next();
};
