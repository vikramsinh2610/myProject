const Boom = require('boom');
const ProductConfigurationService = require("../../services/product-configuration-srv");
const productRepository = require("../../services/product-srv/product-repository");
const errorHandler = require("../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Product Configuration Copy',
      description: 'Copy a Product Configuration',
      tags: ['product-configuration'],
      params: {
        type: 'object',
        properties: {
          productId: {
            type: 'string',
            description: 'Product ID',
          },
        },
      },
      querystring: {
        type: 'object',
        properties: {
          productIdToAdd: {
            type: 'string',
            description: 'Product ID',
          },
        },
      },
    },
  };

  fastify.put(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const productConfigurationService = new ProductConfigurationService(fastify.mongo.db);

      const productBase = await productRepository.getById(fastify.mongo.db, request.query.productIdToAdd);
      const newProduct = await productConfigurationService.getByProductId(request.params.productId).then((product) => ({
        ...product,
        _id: request.query.productIdToAdd,
        productCode: productBase.code,
        productName: productBase.name,
      }));

      const result = await productConfigurationService
        .insertProductConfiguration(newProduct)
        .then((configuration) => configuration)
        .catch((error) => error);

      if (result.message) {
        reply.send(Boom.badRequest(result.message));
      } else {
        reply.send({_meta: {}, item: result});
      }
    }),
  );
  next();
};
