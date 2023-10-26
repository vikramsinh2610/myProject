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
          fiscalCode: {
            type: 'string',
            description: 'fiscal code',
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
        .select(
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
        )
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
        // eslint-disable-next-line func-names
        query.andWhere(function () {
          // @ts-ignore
          this.where('person.name', 'ILIKE', `%${request.query.searchCustomer}%`)
            .orWhere('person.surname', 'ILIKE', `%${request.query.searchCustomer}%`)
            .orWhere('person.companyName', 'ILIKE', `%${request.query.searchCustomer}%`);
        });
      }

      if (request.query.customerType && request.query.customerType !== 'all') {
        query.andWhere('person.customerType', request.query.customerType);
      }

      if (request.query.fiscalCode) {
        query.andWhere('person.fiscalCode', request.query.fiscalCode);
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

      const persons = await query
        .orderBy('surname', 'name')
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
