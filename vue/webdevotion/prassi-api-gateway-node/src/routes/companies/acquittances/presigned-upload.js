const { v4: uuid } = require('uuid');
const Boom = require('boom');
const DocumentService = require("../../../services/document-srv");
const CompanyService = require("../../../services/company-srv");
const { types } = require("../../../services/document-srv/document-types");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Presigned Upload',
      description: 'Get S3 presigned upload for company acquitance',
      tags: ['companies'],
      params: {
        type: 'object',
        properties: {
          companyId: {
            type: 'string',
            description: 'Company ID',
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
            item: {
              type: 'object',
              required: ['_id', 'url'],
              properties: {
                _id: {
                  type: 'string',
                },
                url: {
                  type: 'string',
                  description: 'S3 upload presigned URL',
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
    const companyService = new CompanyService(fastify.mongo.db);

    const _id = `${uuid()}.xlsx`;
    companyService
      .getCompany(request.params.companyId)
      .then((company) =>
        documentService.getPresignedUploadUrl({
          _id,
          type: types.COMPANY_ACQUITTANCE,
          ownerId: request.params.companyId,
          additionalData: {
            companyId: company._id,
            companyName: company.name,
          },
        }),
      )
      .then((url) => reply.send({ _meta: {}, item: { _id, url } }))
      .catch((error) => reply.send(Boom.badData(error)));
  });
  next();
};
