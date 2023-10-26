const Boom = require('boom');
const CompanyAcquittanceService = require("../../../services/company-acquittance-srv");
const Acquittance = require("../../../services/company-acquittance-srv/acquittance");
const CompanyService = require("../../../services/company-srv");
const DocumentService = require("../../../services/document-srv");
const { types: documentTypes } = require("../../../services/document-srv/document-types");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Acquittance Add',
      description: 'Add company acquittance from uploaded file',
      tags: ['companies'],
      params: {
        type: 'object',
        properties: {
          companyId: {
            type: 'string',
            description: 'Company ID',
          },
          documentId: {
            type: 'string',
            description: 'Document ID',
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

  fastify.put('/', options, (request, reply) => {
    const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);
    const companyAcquittanceService = new CompanyAcquittanceService(fastify.mongo.db, documentService, fastify.knex);
    const companyService = new CompanyService(fastify.mongo.db);

    companyService
      .getCompany(request.params.companyId)
      .then((company) =>
        documentService.addDocument({
          _id: request.params.documentId,
          type: documentTypes.COMPANY_ACQUITTANCE,
          ownerId: company._id,
          displayName: `Quetanze ${company.name}`,
          locked: true,
          additionalData: {
            companyId: company._id,
            companyName: company.name,
          },
        }),
      )
      .then((doc) =>
        companyAcquittanceService.addAcquittance(request.params.companyId, doc.additionalData.companyName, doc._id),
      )
      .then((acquittance) => companyAcquittanceService.processAcquittance(acquittance, fastify.edition))
      .then((acquittance) => reply.send({ _meta: {}, item: acquittance }))
      .catch((error) => reply.send(Boom.badData(error.message)));
  });

  next();
};
