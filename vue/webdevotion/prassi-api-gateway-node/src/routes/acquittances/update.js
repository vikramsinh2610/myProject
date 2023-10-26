const Boom = require('boom');
const CompanyAcquittanceService = require("../../services/company-acquittance-srv");
const Acquittance = require("../../services/company-acquittance-srv/acquittance");
const Payment = require("../../services/company-acquittance-srv/payment");
const DocumentService = require("../../services/document-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Acquittance update',
      description: 'Update acquittance payments',
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
      body: {
        type: 'object',
        additionalProperties: false,
        properties: {
          item: Payment.getJSONSchema(),
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

  fastify.post('/', options, (request, reply) => {
    const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);
    const companyAcquittanceService = new CompanyAcquittanceService(fastify.mongo.db, documentService, fastify.knex);

    companyAcquittanceService
      .getAcquittance(request.params.acquittanceId)
      .then((acquittance) => {
        const selectedPaymentIndex = acquittance.payments.findIndex((el) => el._id === request.body.item._id);
        // eslint-disable-next-line security/detect-object-injection
        acquittance.payments[selectedPaymentIndex] = { // eslint-disable-line no-param-reassign
          ...request.body.item,
          installmentDate: new Date(request.body.item.installmentDate),
        };
        return acquittance;
      })
      .then((acquittance) => companyAcquittanceService.updateAcquittance(acquittance))
      .then((acquittance) => reply.send({ _meta: {}, item: acquittance }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });

  next();
};
