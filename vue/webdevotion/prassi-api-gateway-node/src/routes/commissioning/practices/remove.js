const Boom = require('boom');
const PracticeFeeService = require("../../../services/practice-commission-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Commissioning Practice Remove',
      description: 'Remove an existing Practice to stop calculating future commissions',
      tags: ['commissioning', 'practices'],
      params: {
        type: 'object',
        properties: {
          practiceId: {
            type: 'string',
            description: 'Practice ID',
          },
        },
      },
    },
  };

  fastify.delete('/', options, (request, reply) => {
    const sql = fastify.knex;
    const practiceFeeService = new PracticeFeeService(fastify.mongo.db, sql);

    practiceFeeService
      .removePractice(request.params.practiceId)
      .then(() => reply.send())
      .catch((error) => reply.send(Boom.badData(error.message)));
  });
  next();
};
