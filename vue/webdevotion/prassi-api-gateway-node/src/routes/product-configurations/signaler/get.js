const Boom = require('boom');
const { uuidToBinary } = require("../../../utils/uuid-to-binary");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Signaler Configuration Detail',
      description: 'Get Signaler Configuration Detail',
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
                  description: 'Configuration ID',
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

  fastify.get('/', options, (request, reply) => {
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    db.collection('signaler-product-configuration')
      .findOne({ _id: request.params.productId })
      .then(
        (product) => {
          if (product) return product;

          // eslint-disable-next-line promise/no-nesting
          return db.collection('Product')
          .findOne(
            { _id: uuidToBinary(request.params.productId) },
            { projection: { Title: true, 'AnagraficaProdotto.CodiceProdotto': true }},
          )
          .then((p) => ({
              _id: request.params.productId,
              productName: p.Title,
              productCode: p.AnagraficaProdotto.CodiceProdotto,
              amount: 0,
            })
          );
        }
      )
      .then((product) => reply.send({ _meta: {}, item: product }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
