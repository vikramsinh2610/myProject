const Boom = require('boom');
const errorHandler = require('../../utils/error-handler');
const NetworkService = require('../../services/network-srv');
const { dateToPeriod, unparse } = require('../../utils/productive-period-helper');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Customers List',
      description: 'Get Customers list',
      tags: ['customers'],
      querystring: {
        type: 'object',
        properties: {
          isCompany: {
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
                  value: {
                    type: 'string',
                    description: 'Customer ID',
                  },
                  label: {
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
          'person.id as value',
          sql.raw(
            // eslint-disable-next-line max-len
            `CASE WHEN person."isCompany" THEN person."companyName" ELSE CONCAT(person.name, ' ',person.surname) END as label`,
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

      if (request.query.searchCustomer) {
        // eslint-disable-next-line func-names
        query.andWhere(function () {
          // @ts-ignore
          this.where('person.name', 'ILIKE', `%${request.query.searchCustomer}%`)
            .orWhere('person.surname', 'ILIKE', `%${request.query.searchCustomer}%`)
            .orWhere('person.companyName', 'ILIKE', `%${request.query.searchCustomer}%`);
        });
      }

      if (request.query.isCompany !== undefined) {
        query.andWhere('person.isCompany', request.query.isCompany);
      }

      query.orderBy('person.name', 'ASC');
      query.orderBy('person.surname', 'ASC');

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
