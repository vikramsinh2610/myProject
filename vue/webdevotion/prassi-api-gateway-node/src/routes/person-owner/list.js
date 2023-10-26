const errorHandler = require('../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'customer Insurer List',
      description: 'Get customer Insurer list',
      tags: ['configuration'],
      querystring: {
        type: 'object',
        properties: {
          skip: {
            type: 'integer',
            mimimum: 0,
            default: 0,
            description: 'Number of items to skip',
          },
          count: {
            type: 'integer',
            default: 20,
            description: 'Number of items to return',
          },
          fullTextSearch: {
            type: 'string',
            description: 'Free text for full text search',
          },
          sortBy: {
            type: 'string',
            default: '_id',
            enum: ['customerId', 'time'],
            description: 'Sort by field',
          },
          sortDirection: {
            type: 'number',
            default: 1,
            enum: [-1, 1],
            description: 'Sort direction',
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
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'Record ID',
                  },
                  uuid: {
                    type: 'string',
                    description: 'Record ID',
                  },
                  customerId: {
                    type: 'string',
                    description: 'customer ID',
                  },
                  networkNodeId: {
                    type: 'string',
                    description: 'Network Node ID',
                  },
                  networkHierarchy: {
                    type: 'string',
                    description: 'Network name',
                  },
                  productivePeriodMonth: {
                    type: 'number',
                    description: 'Month',
                  },
                  productivePeriodYear: {
                    type: 'number',
                    description: 'Year',
                  },
                  promoterId: {
                    type: 'string',
                    description: 'Promoter ID',
                  },
                  promoterName: {
                    type: 'string',
                    description: 'Promoter name',
                  },
                  displaycustomername: {
                    type: 'string',
                    description: 'Customer name',
                  },
                  inherited: {
                    type: 'boolean',
                    description: 'Customer inherited',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.get('/', options, errorHandler(async (request, reply) => {
    const sql = fastify.knex;

    const query = sql
      .select(
        'person_owner.*',
        'nn.roleId',
        'nn.inherited',
        'nn.displayHierarchy as networkHierarchy',
        'nn.validPromoterName as promoterName',
        'person.isCompany',
        sql.raw("CONCAT(person.name, ' ', person.surname) as displayCustomerName"),
      )
      .from('person_owner')
      .join('person', 'person.uuid', 'person_owner.personId')
      // eslint-disable-next-line func-names
      .join('network_node AS nn', function () {
        // @ts-ignore
        this.on('nn.uuid', '=', 'person_owner.networkNodeId')
          .andOn('nn.productivePeriodMonth', '=', 'person_owner.productivePeriodMonth')
          .andOn('nn.productivePeriodYear', '=', 'person_owner.productivePeriodYear');
      });

    if (request.query.networkid) {
      query.andWhere('person_owner.networkNodeId', request.query.networkid);
    }

    if (request.query.promoterid) {
      query.andWhere('person_owner.ownerId', request.query.promoterid);
    }

    if (request.query.customerId) {
      query.andWhere('person_owner.personId', request.query.customerId);
    }

    if (request.query.sortBy === 'customerId') {
      query.orderBy('person_owner.personId', request.query.sortDirection === 1 ? 'ASC' : 'DESC');
      query.orderBy('person_owner.productivePeriodYear', 'DESC');
      query.orderBy('person_owner.productivePeriodMonth', 'DESC');
    } else {
      query.orderBy('person_owner.productivePeriodYear', request.query.sortDirection === 1 ? 'ASC' : 'DESC');
      query.orderBy('person_owner.productivePeriodMonth', request.query.sortDirection === 1 ? 'ASC' : 'DESC');
    }

    const owners = await query
      .offset(request.query.skip)
      .limit(request.query.count)
      .then((results) => results);

    return reply.send({
      _meta: {},
      items: owners,
    });
  }));
  next();
};
