const Boom = require('boom');
const { seed: tcwSeed } = require('../../services/promoter-job-srv/seed/roles.tcw');
const { seed: sheltiaSeed } = require('../../services/promoter-job-srv/seed/roles.sheltia');
const roleRepository = require('../../services/promoter-job-srv/role-repository');

module.exports = (fastify, opts, next) => {
  fastify.post('/', { schema: { hide: true } }, (request, reply) => {
    const { db } = fastify.mongo;

    Promise.all([
      roleRepository.insertSeed(db, process.env.EDITION === 'tcw' ? tcwSeed : sheltiaSeed)  ,
    ])
      .then(() => reply.code(201).send())
      .catch((error) => reply.send(Boom.badRequest(error)));
  });
  next();
};
