const Boom = require('boom');

const verifytoken = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'User Verify JWT',
      description: 'Exchange JWT for the owner Identity',
      tags: ['login', 'user'],
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'item'],
          properties: {
            _meta: {
              type: 'object',
              properties: {},
            },
            item: {
              type: 'object',
              description: 'Authenticated user informations',
              properties: {
                _id: {
                  type: 'string',
                  description: 'User ID',
                },
                userName: {
                  type: 'string',
                  description: 'Username',
                },
                name: {
                  type: 'string',
                  description: 'Name',
                },
                surname: {
                  type: 'string',
                  description: 'Surname',
                },
                roleId: {
                  type: 'string',
                  description: 'Role identifier (level)',
                },
                roleName: {
                  type: 'string',
                  description: 'Role name',
                },
                fiscalCode: {
                  type: 'string',
                  description: 'User fiscal code',
                },
              },
              required: ['_id'],
            },
          },
        },
      },
    },
  };

  fastify.get('/', options, (request, reply) => {
    if (request.identity === null) return reply.send(Boom.unauthorized('Invalid credentials'));
    return reply.send({ _meta: {}, item: request.identity });
  });

  next();
};

module.exports = verifytoken;
