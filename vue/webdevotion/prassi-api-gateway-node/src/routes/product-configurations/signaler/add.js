const Boom = require('boom');
const ProductConfigurationService = require("../../../services/product-configuration-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Signaler Product Configuration Add',
      description: 'Add a Signaler Product Configuration',
      tags: ['configuration'],
      params: {
        type: 'object',
        properties: {
          productId: {
            type: 'string',
            description: 'Product ID',
          },
        },
      },
      body: {
        type: 'object',
        required: ['_id'],
        properties: {
          _id: {
            type: 'string',
            description: 'Product configuration ID',
          },
          productName: {
            type: 'string',
            description: 'Product Name',
          },
          productCode: {
            type: 'string',
            description: 'Product Code',
          },
          amount: {
            type: 'number',
            description: 'Amount',
          },
        },
      },
    },
  };

  fastify.put('/', options, (request, reply) => {
    const productConfigurationService = new ProductConfigurationService(fastify.mongo.db);

    fastify.log.info(request.body);
    productConfigurationService
      .addSignalerProductConfiguration(request.body)
      .then((configuration) => reply.send({ _meta: {}, item: configuration }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
