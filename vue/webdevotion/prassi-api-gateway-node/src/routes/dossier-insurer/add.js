const Boom = require('boom');
const DossierInsurerConfigurationService = require("../../services/dossier-insurer-srv");
const NetworkService = require("../../services/network-srv");
const errorHandler = require("../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
  };

  fastify.put('/', options, errorHandler(async (request, reply) => {
    const dossierInsurerConfigurationService = new DossierInsurerConfigurationService(fastify.mongo.db);

    fastify.log.info(request.body);
    const networkService = new NetworkService(fastify.mongo.db);
    const promoterCanSee = await networkService.userCanSee(
      request.identity.roleId,
      request.identity._id,
      request.body.promoterId,
    );
    if(!promoterCanSee) return reply.send(Boom.badRequest('Utente non autorizzato'));
    const nodeCanSee = await networkService.userCanSeeNode(
      request.identity.roleId,
      request.identity._id,
      request.body.networkNodeId,
    );
    if(!nodeCanSee) return reply.send(Boom.badRequest('Utente non autorizzato'));

    return dossierInsurerConfigurationService
      .addDossierInsurer(request.body)
      .then((configuration) => reply.send({ _meta: {}, item: configuration }))
      .catch((error) => reply.send(Boom.internal(error.message)));
  }));
  next();
};
