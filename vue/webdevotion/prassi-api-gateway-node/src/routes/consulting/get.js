// const Mongo = require('mongodb');
const { findOneConsulting } = require('./constants');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Get a consulting document for a survey result',
      tags: ['consulting'],
    },
  };

  fastify.get('/', options, async (request, reply) => {
    // /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    // const db = fastify.mongo.db;

    const item = await findOneConsulting(fastify.knex, request.params.resultId);
    // const item = await db.collection(CONSULTING).findOne({ _id: request.params.resultId });
    return reply.send({ item });
  });
  next();
};
