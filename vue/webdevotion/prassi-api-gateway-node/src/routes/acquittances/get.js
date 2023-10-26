const Boom = require('boom');
const CompanyAcquittanceService = require('../../services/company-acquittance-srv');
const Acquittance = require('../../services/company-acquittance-srv/acquittance');
const DocumentService = require('../../services/document-srv');

const list = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Get Acquittance List',
      description: 'Company acquittance get',
      tags: ['acquittances'],
      params: {
        type: 'object',
        properties: {
          acquittanceId: {
            type: 'string',
            description: 'Acquittance ID',
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
            item: Acquittance.getJSONSchema(),
          },
        },
      },
    },
  };

  fastify.get('/', options, (request, reply) => {
    const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);
    const companyAcquittanceService = new CompanyAcquittanceService(fastify.mongo.db, documentService, fastify.knex);

    companyAcquittanceService
      .getAcquittance(request.params.acquittanceId)
      .then((acquittance) => reply.send({ _meta: {}, item: acquittance }))
      .catch((error) => reply.send(Boom.badRequest(error)));
  });

  next();
};

module.exports = list;
