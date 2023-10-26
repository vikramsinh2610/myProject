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
                  contractId: {
                    type: 'string',
                  },
                  dossierId: {
                    type: 'string',
                  },
                  practiceId: {
                    type: 'string',
                  },
                  practiceUuid: {
                    type: 'string',
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
          'plinked.uuid',
          'plinked.status',
          'practice.contractId',
          'practice.dossierId',
          'practice.practiceId',
          'practice.uuid as practiceUuid',
          sql.raw(
            // eslint-disable-next-line max-len
            `CASE WHEN plinked."isCompany" THEN plinked."companyName" ELSE CONCAT(plinked.name, ' ',plinked.surname) END as displayname`,
          ),
        )
        .from('person')
        .join('practice AS practice', 'person.uuid', 'practice.customerId')
        .join('person_practice AS pp', 'practice.id', 'pp.practiceId')
        .join('person AS plinked', 'pp.personId', 'plinked.id')
        .where('person.uuid', request.query.customerId);

      if (request.query.isCompany !== undefined) {
        query.andWhere('person.isCompany', request.query.isCompany);
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
