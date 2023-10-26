const Boom = require('boom');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Question delete',
      description: 'Delete a Question',
      tags: ['question'],
    },
  };

  fastify.delete('/', options, (request, reply) => {
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    db.collection('survey-question')
      .deleteOne({ _id: request.params.questionId })
      .then((question) => reply.send({ _meta: {}, item: question }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
