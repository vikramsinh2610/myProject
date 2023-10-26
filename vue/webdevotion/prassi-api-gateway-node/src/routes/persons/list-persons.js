const errorHandler = require('../../utils/error-handler');

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
          customerId: {
            type: 'string',
            description: 'id of the root promoter for the summary',
          },
          isCompany: {
            type: 'boolean',
          },
          skip: {
            type: 'integer',
            default: 0,
            description: 'Number of items to skip',
          },
          lr: {
            type: 'boolean',
          }
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
                  personType: {},
                  linkedPersonId: {
                    type: 'string',
                    description: 'Customer full name',
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

      const query = sql
        .select(
          'pp.id',
          'plinked.fiscalCode',
          'pp.personType',
          'pp.personId',
          'pp.linkedPersonId',
          'plinked.uuid',
          'plinked.status',
          sql.raw(
            // eslint-disable-next-line max-len
            `CASE WHEN plinked."isCompany" THEN plinked."companyName" ELSE CONCAT(plinked.name, ' ',plinked.surname) END as displayname`,
          ),
        )
        .from('person')
        .join('person_person AS pp', 'person.id', 'pp.personId')
        .join('person AS plinked', 'pp.linkedPersonId', 'plinked.id')
        .where('person.uuid', request.query.customerId);

      if (request.query.isCompany !== undefined) {
        query.andWhere('person.isCompany', request.query.isCompany);
      }

      if (request.query.lr) {
        // eslint-disable-next-line func-names
        query.andWhere('pp.personTypeKey', 5);
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
