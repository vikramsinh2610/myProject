const errorHandler = require('../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Precontractual List',
      description: 'Get Precontractual list',
      tags: ['precontractual'],
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
                properties: {
                  id: {
                    type: 'number',
                    description: 'Precontractual ID',
                  },
                  personId: {
                    type: 'number',
                    description: 'Person ID',
                  },
                  status: {
                    type: 'number',
                    description: 'Precontractual status',
                  },
                  stepper: {
                    type: 'number',
                    description: 'Precontractual status',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.get(
    '/',
    options,
    // eslint-disable-next-line sonarjs/cognitive-complexity
    errorHandler(async (request, reply) => {
      const sql = fastify.knex;

      const query = sql
        .select(
          'id',
          'status',
          'personId',
          'stepper',
        )
        .from('precontractual');

      const precontractuals = await query
          .offset(request.query.skip)
          .limit(request.query.count)
          .then((results) => results);

      return reply.send({
        _meta: {},
        items: precontractuals,
      });
    }),
  );
  next();
};
