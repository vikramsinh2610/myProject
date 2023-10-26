const Boom = require('boom');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Adjusted Premium Configuration Detail',
      description: 'Get Adjusted Premium Configuration Detail',
      tags: ['configuration'],
      querystring: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Adjusted Premium Configuration ID',
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
                  description: 'Adjusted Premium Configuration ID',
                },
                products : {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties : {
                      productId: { type: 'string' },
                      productName: { type: 'string' },
                      adjustedPercentageSubscription: { type: 'number' },
                      adjustedPercentageAdditionalIncome: { type: 'number' },
                      adjustedBonus: { type: 'number' },
                    }
                  }
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

    db.collection('adjusted-premium-configuration')
      .deleteOne({ _id: request.params.adjustedPremiumId })
      .then((adjustedPremium) => reply.send({ _meta: {}, item: adjustedPremium }))
      .catch((error) => reply.send(Boom.internal(error.message)));
  });
  next();
};
