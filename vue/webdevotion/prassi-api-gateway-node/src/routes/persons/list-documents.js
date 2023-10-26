const errorHandler = require('../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Persons Documents List',
      description: 'Get Persons Documents list',
      tags: ['persons'],
      querystring: {
        type: 'object',
        properties: {
          customerId: {
            type: 'string',
            description: 'id of the root promoter for the summary',
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
                  documentNumber: {
                    type: 'string',
                    description: 'Customer full name',
                  },
                  issueDate: {
                    type: 'string',
                    description: 'Customer full name',
                  },
                  expiryDate: {
                    type: 'string',
                    description: 'Customer full name',
                  },
                  documentType: {},
                  attachmentObj: {},
                  issueCountry: {
                    type: 'string',
                    description: 'Customer full name',
                  },
                  issueRegion: {
                    type: 'string',
                    description: 'Customer full name',
                  },
                  issueCity: {
                    type: 'string',
                    description: 'Customer full name',
                  },

                  issueAuthority: {},
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
          'pd.id',
          'person.fiscalCode',
          'pd.documentNumber',
          'pd.issueDate',
          'pd.expiryDate',
          'pd.documentType',
          'pd.personId',
          'pd.attachmentObj',
          'pd.issueAuthority',
          'pd.issueCountry',
          'pd.issueRegion',
          'pd.issueCity',
          sql.raw(
            // eslint-disable-next-line max-len
            `CASE WHEN person."isCompany" THEN person."companyName" ELSE CONCAT(person.name, ' ',person.surname) END as displayname`,
          ),
        )
        .from('person')
        .join('person_document AS pd', 'person.id', 'pd.personId')
        .where('person.uuid', request.query.customerId)
        .orderBy('pd.expiryDate', 'desc');

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
