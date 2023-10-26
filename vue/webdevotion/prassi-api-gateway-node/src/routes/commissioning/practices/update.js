const Boom = require('boom');
const PracticeFeeService = require("../../../services/practice-commission-srv");
const PracticeService = require("../../../services/practice-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Commissioning Practice Update',
      description: 'Update a Practice for commissions calculation',
      tags: ['commissioning', 'practices'],
      params: {
        type: 'object',
        properties: {
          practiceId: {
            type: 'string',
          },
        },
      },
      querystring: {
        type: 'object',
        properties: {
          override: {
            type: 'boolean',
            description: 'override confirmed',
          },
        },
      },
    },
  };

  fastify.patch('/', options, (request, reply) => {
    const sql = fastify.knex;
    const practiceService = new PracticeService(fastify.mongo.db);
    const practiceFeeService = new PracticeFeeService(fastify.mongo.db, sql);

    practiceService
      .getPracticeById(request.params.practiceId)
      .then((practice) => practiceFeeService.addNewPractice(practice, fastify.edition, request.query.override))
      .then((practice) => reply.send(practice))
      .catch((error) => reply.send(Boom.badData(error.message)));
  });
  next();
};
