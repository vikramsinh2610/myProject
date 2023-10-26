const Boom = require('boom');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
  };

  fastify.delete('/', options, (request, reply) => {
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    db.collection('dossier-insurer')
      .deleteOne({ _id: request.params.dossierInsurerId })
      .then((managementFee) => reply.send({ _meta: {}, item: managementFee }))
      .catch((error) => reply.send(Boom.internal(error.message)));
  });
  next();
};
