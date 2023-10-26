const Boom = require('boom');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Survey delete',
      description: 'Delete a Survey',
      tags: ['survey'],
    },
  };

  fastify.delete('/', options, (request, reply) => {
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    db.collection('survey')
      .deleteOne({ _id: request.params.surveyId })
      .then((result) => reply.send({ _meta: {}, item: result }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
