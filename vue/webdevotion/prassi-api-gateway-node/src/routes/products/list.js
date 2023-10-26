const Boom = require('boom');
const ProductService = require("../../services/product-srv");
const { uuidToBinary } = require("../../utils/uuid-to-binary");

const list = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'Get Products List',
      description: 'Get products list',
      tags: ['products'],
      querystring: {
        type: 'object',
        properties: {
          companyId: {
            type: 'string',
            description: 'filter for company',
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
                required: ['_id', 'name', 'code'],
                properties: {
                  _id: {
                    type: 'string',
                    description: 'Product ID',
                  },
                  name: {
                    type: 'string',
                    description: 'Product name',
                  },
                  code: {
                    type: 'string',
                    description: 'The product code',
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
    const filter = {
      ...(request.query.companyId
        ? {
            'AnagraficaProdotto.CodiceSocieta.Identifier': uuidToBinary(request.query.companyId),
          }
        : {}),
    };

    const productService = new ProductService(fastify.mongo.db);
    productService
      .getProducts(filter)
      .then((products) => reply.send({ _meta: {}, items: products }))
      .catch((error) => reply.send(Boom.badRequest(error)));
  });

  next();
};

module.exports = list;
