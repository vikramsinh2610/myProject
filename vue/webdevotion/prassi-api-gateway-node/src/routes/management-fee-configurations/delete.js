const Boom = require('boom');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Management Fee Configuration Detail',
      description: 'Get Management Fee Configuration Detail',
      tags: ['configuration'],
      querystring: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Management Fee Configuration ID',
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
                  description: 'Management Fee Configuration ID',
                },
                roleId: {
                  type: 'string',
                  enum: [
                    'team-manager',
                    'signaller',
                    'senior-promoter',
                    'promoter',
                    'district-manager',
                    'branch-manager',
                    'administrator',
                  ],
                  description: 'Role type',
                },
                fromProductivePeriodYear: {
                  type: 'number',
                  description: '',
                },
                fromProductivePeriodMonth: {
                  type: 'number',
                  description: '',
                },
                fromProductivePeriod: {
                  type: 'number',
                  description: '',
                },
                percentage: {
                  type: 'string',
                  description: 'Percentage',
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

    db.collection('management-fee-configuration')
      .deleteOne({ _id: request.params.managementFeeId })
      .then((managementFee) => reply.send({ _meta: {}, item: managementFee }))
      .catch((error) => reply.send(Boom.internal(error.message)));
  });
  next();
};
