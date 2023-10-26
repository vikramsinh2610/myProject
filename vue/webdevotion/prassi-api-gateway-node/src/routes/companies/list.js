const Boom = require('boom');
const CompanyService = require("../../services/company-srv");

const list = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'Get Company List',
      description: 'Get company list',
      tags: ['companies'],
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
                required: ['_id', 'name', 'code'],
                properties: {
                  _id: {
                    type: 'string',
                    description: 'Company ID',
                  },
                  name: {
                    type: 'string',
                    description: 'Company name',
                  },
                  code: {
                    type: 'string',
                    description: 'The company code',
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
    const companyService = new CompanyService(fastify.mongo.db);
    companyService
      .getCompanies()
      .then((companies) => reply.send({ _meta: {}, items: companies }))
      .catch((error) => reply.send(Boom.badRequest(error)));
  });

  next();
};

module.exports = list;
