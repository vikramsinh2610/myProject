const errorHandler = require("../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
  };

  fastify.delete('/', options, errorHandler(async (request, reply) => {
    const sql = fastify.knex;

    await sql('person_owner')
      .del()
      .where('uuid', request.params.customerInsurerId);

    reply.send({ _meta: {}, item: 'ok' });

  }));
  next();
};
