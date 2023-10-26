const Boom = require('boom');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Signaler Configuration Detail',
      description: 'Delete Configuration Detail',
      tags: ['configuration'],
      querystring: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Product ID',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            _meta: {
              type: 'object',
            },
            item: {
              type: 'object',
              properties: {
                _id: {
                  type: 'string',
                  description: 'Product ID',
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
        },
      },
    },
  };

  fastify.delete('/', options, (request, reply) => {
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    db.collection('signaler-product-configuration')
      .deleteOne({ _id: request.params.productId })
      .then((product) => reply.send({ _meta: {}, item: product }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
