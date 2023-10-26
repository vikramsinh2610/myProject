const Mongo = require('mongodb');
const errorHandler = require('../../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Survey Extra questions',
      description: 'Fetch extra questions for survey',
      tags: ['survey'],
    },
  };

  fastify.get(
    '/',
    options,
    errorHandler(async (request, reply) => {
      /** @type {Mongo.Db} */
      // eslint-disable-next-line prefer-destructuring
      const db = fastify.mongo.db;

      const items = await db.collection('survey-extra-questions').find({}).toArray();
      return reply.send({ items });
    }),
  );
  next();
};
