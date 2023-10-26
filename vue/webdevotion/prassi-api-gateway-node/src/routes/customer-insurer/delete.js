const Boom = require('boom');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
  };

  fastify.delete('/', options, (request, reply) => {
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    db.collection('customer-insurer')
      .deleteOne({ _id: request.params.customerInsurerId })
      .then((result) => reply.send({ _meta: {}, item: result }))
      .catch((error) => reply.send(Boom.internal(error.message)));
  });
  next();
};
