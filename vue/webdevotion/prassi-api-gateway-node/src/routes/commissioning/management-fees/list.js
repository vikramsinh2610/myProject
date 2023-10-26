const Boom = require('boom');
const ManagementFeeSrv = require('../../../services/management-fee-srv');
const productivePeriodHelper = require('../../../utils/productive-period-helper');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Commissioning Management Fee import from legacy',
      description: 'Import Management Fee  from legacy',
      tags: ['commissioning', 'management-fee'],
      querystring: {
        type: 'object',
        properties: {
          productivePeriod: {
            type: 'string',
            pattern: '([0-9]{4})([0-1][0-9])+',
            description: 'Commissioning ID as productive period as YYYYMM',
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
                required: [
                  '_id',
                  'practiceId',
                  'dossierId',
                  'contractId',
                  'productId',
                  'productName',
                  'companyId',
                  'companyName',
                  'insurerId',
                ],
                properties: {
                  _id: {
                    type: 'string',
                  },
                  practiceId: {
                    type: 'string',
                  },
                  contractId: {
                    type: 'string',
                  },
                  dossierId: {
                    type: 'string',
                  },
                  productName: {
                    type: 'string',
                  },
                  companyName: {
                    type: 'string',
                  },
                  amount: {
                    type: 'integer',
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
    const { productivePeriodYear, productivePeriodMonth } = productivePeriodHelper.unparse(
      request.params.commissioningId,
    );

    const managementFeeSrv = new ManagementFeeSrv(fastify.mongo.db);
    return managementFeeSrv
      .getManagementFeesByProductivePeriod(productivePeriodYear, productivePeriodMonth)
      .then((items) => reply.send({ _meta: {}, items }))
      .catch((error) => Boom.badRequest(error));
  });
  next();
};
