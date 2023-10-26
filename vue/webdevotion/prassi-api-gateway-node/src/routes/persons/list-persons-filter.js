const Boom = require("boom");
const errorHandler = require('../../utils/error-handler');
const NetworkService = require("../../services/network-srv");
const {unparse, dateToPeriod} = require("../../utils/productive-period-helper");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Persons Persons List',
      description: 'Get Persons Persons list',
      tags: ['persons'],
      querystring: {
        type: 'object',
        properties: {
          isCompany: {
            type: 'boolean',
          },
          isFiscalCodeSearch: {
            type: 'boolean',
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
          searchCustomer: {
            type: 'string',
            description: 'string id of customer',
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
                  id: {
                    type: 'string',
                    description: 'Customer ID',
                  },
                  uuid: {
                    type: 'string',
                    description: 'Customer ID',
                  },
                  displayname: {
                    type: 'string',
                    description: 'Customer full name',
                  },
                  personId: {
                    type: 'string',
                    description: 'Customer full name',
                  },
                  fiscalCode: {
                    type: 'string',
                    description: 'Customer full name',
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
                  status: {
                    type: 'integer',
                    description: 'Customer type',
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
      const { productivePeriodYear, productivePeriodMonth } = unparse(dateToPeriod());

      const firstNode = await networkService.userCanSeeProductivePeriod(
          request.identity.roleId,
          request.identity._id,
          request.identity._id,
          productivePeriodYear,
          productivePeriodMonth,
      );
      if (!firstNode) return reply.send(Boom.badRequest('Utente non autorizzato'));

      const networkIds = await networkService.getNetworkListIdByPromoterAndPeriod(
          request.query.networkId || firstNode.model._id,
          undefined,
          false,
          productivePeriodYear,
          productivePeriodMonth,
      );


      const query = sql
        .select(
          'person.id',
          'person.fiscalCode',
          'person.uuid',
          'person.status',
          'nn.roleId',
          'nn.inherited',
          'nn.displayHierarchy as networkHierarchy',
          'nn.validPromoterName as promoterName',
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
              .andOn('nn.productivePeriodMonth', '=', productivePeriodMonth)
              .andOn('nn.productivePeriodYear', '=', productivePeriodYear);
        })
        .whereIn('po.networkNodeId', networkIds)
        .andWhere('po.productivePeriodMonth', productivePeriodMonth)
        .andWhere('po.productivePeriodYear', productivePeriodYear);

      if (request.query.isCompany !== undefined) {
        query.andWhere('person.isCompany', request.query.isCompany);
      }

      if (request.query.searchCustomer && request.query.isFiscalCodeSearch) {
        // eslint-disable-next-line func-names
        query.andWhere(function () {
          // @ts-ignore
          this.where('person.fiscalCode', 'ILIKE', `%${request.query.searchCustomer}%`);
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

      const personDocuments = await query
        .offset(request.query.skip)
        .limit(request.query.count)
        .then((results) => results);

      return reply.send({
        _meta: {},
        items: personDocuments,
      });
    }),
  );
  next();
};
