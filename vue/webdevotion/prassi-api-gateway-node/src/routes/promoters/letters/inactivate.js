const Boom = require('boom');
const LetterService = require("../../../services/letter-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Promoter Letter Inactivate',
      description: 'Set letter state as active',
      tags: ['letters'],
      params: {
        type: 'object',
        properties: {
          promoterId: {
            type: 'string',
            description: 'Promoter ID',
          },
          letterId: {
            type: 'string',
            description: 'Letter ID',
          },
        },
      },
    },
  };

  fastify.post('/', options, (request, reply) => {
    const letterService = new LetterService(fastify.mongo.db, fastify.log, fastify.knex);

    letterService
      .inactivate(request.params.letterId, request.params.promoterId)
      .then(() => reply.send())
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
