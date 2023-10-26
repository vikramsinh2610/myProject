const Boom = require('boom');
const CompanyAcquittanceService = require('../../services/company-acquittance-srv');
const DocumentService = require('../../services/document-srv');
const dateRegex = require('../../utils/iso-6801-date');

const list = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Acquittance List',
      description: 'Get acquittance list',
      tags: ['acquittances'],
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
            mimumum: 1,
            maximum: 25,
            description: 'Number of items to return',
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
                required: ['_id', 'documentId', 'status', 'didCreatedDate', 'didConfirmedDate', 'companyName', 'count'],
                properties: {
                  _id: {
                    type: 'string',
                    description: 'Payment ID',
                  },
                  documentId: {
                    type: 'string',
                    description: 'Document ID',
                  },
                  status: {
                    type: 'string',
                    description: 'Status',
                  },
                  didCreatedDate: {
                    type: 'string',
                    pattern: dateRegex,
                    description: 'Created date',
                  },
                  didConfirmedDate: {
                    type: 'string',
                    pattern: dateRegex,
                    description: 'Confirmed date',
                  },
                  companyName: {
                    type: 'string',
                    description: 'Company name',
                  },
                  count: {
                    type: 'integer',
                    description: 'Number of payments',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.get('/', options, (request, reply) => {
    const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);
    const companyAcquittanceService = new CompanyAcquittanceService(fastify.mongo.db, documentService, fastify.knex);

    companyAcquittanceService
      .getAllAcquittance(request.query.skip, request.query.limit)
      .then((acquittances) =>
        reply.send({ _meta: {}, items: acquittances.map((a) => ({ ...a, count: a.payments.length })) }),
      )
      .catch((error) => reply.send(Boom.badData(error)));
  });

  next();
};

module.exports = list;
