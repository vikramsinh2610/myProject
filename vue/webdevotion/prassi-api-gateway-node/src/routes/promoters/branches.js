// const Boom = require('boom');
const NetworkService = require('../../services/network-srv');
const errorHandler = require('../../utils/error-handler');

const isManager = (node) => node && node.model && ['branch-manager', 'branch-manager-auto'].includes(node.model.roleId);

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Promoter Branch',
      tags: ['promoters'],
      params: {
        type: 'object',
        properties: {
          promoterId: {
            type: 'string',
            description: 'Promoter ID',
          },
        },
      },
    },
  };

  fastify.get(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const { db } = fastify.mongo;
      const networkService = new NetworkService(db);
      const { promoterId } = request.params;

      // TODO
      // const promoterCanSee = await networkService.userCanSee(
      //   request.identity.roleId,
      //   request.identity._id,
      //   request.params.promoterId,
      // );
      // if (!promoterCanSee) return reply.send(Boom.badRequest('Utente non autorizzato'));

      const nodeList = await networkService.getNetworkList(promoterId);

      let current = nodeList[0];
      while (current && !isManager(current)) {
        current = current.parent;
      }

      if (!isManager(current)) return reply.send({ _meta: {}, item: {} });

      const networkId = current.model._id;
      const item = await db.collection('branches').findOne({ networkId });
      return reply.send({ _meta: {}, item });
    }),
  );
  next();
};
