// eslint-disable-next-line unicorn/consistent-function-scoping
const Boom = require('boom');
const errorHandler = require("../../utils/error-handler");
const networkRepository = require('../../services/network-srv/network-repository');
const { firstNode, compare } = require("../../utils/tree");

module.exports = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'Node Tree Order',
      description: 'Order single node tree',
      tags: ['network, tree'],
      params: {
        type: 'object',
        properties: {
          nodeId: {
            type: 'string',
            description: 'Node ID',
          },
        },
      },
      querystring: {
        type: 'object',
        required: [
          'toProductivePeriodYear',
          'toProductivePeriodMonth',
          'fromProductivePeriodYear',
          'fromProductivePeriodMonth',
        ],
        properties: {
          toProductivePeriodYear: {
            type: 'integer',
            description: 'To productive period - year',
          },
          toProductivePeriodMonth: {
            type: 'integer',
            description: 'To productive period - month',
          },
          fromProductivePeriodYear: {
            type: 'integer',
            description: 'From productive period - year',
          },
          fromProductivePeriodMonth: {
            type: 'integer',
            description: 'From productive period - month',
          },
        },
      },
    },
    preHandler: [fastify.auth.authorization.level1000],
  };

  fastify.put(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const network = await networkRepository.getNetwork(
        fastify.mongo.db,
        request.query.fromProductivePeriodYear,
        request.query.fromProductivePeriodMonth,
      );

      const editedNode = firstNode(network.tree, request.params.nodeId);
      if (!editedNode) reply.send(Boom.badRequest('Nodo non trovato'));
      editedNode.children.sort(compare);

      await networkRepository.updateNetwork(
        fastify.mongo.db,
        request.query.fromProductivePeriodYear,
        request.query.fromProductivePeriodMonth,
        network.tree,
      );

      return reply.send({
        _meta: {},
        item: network.tree.children,
      });
    }),
  );
  next();
};
