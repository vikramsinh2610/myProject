const Boom = require('boom');
const errorHandler = require('../../utils/error-handler');
const { firstNode, firstNodeParent, compare } = require('../../utils/tree');
const networkRepository = require('../../services/network-srv/network-repository');
const DossierInsurerService = require('../../services/dossier-insurer-srv');
const CustomerInsurerService = require('../../services/customer-insurer-srv');
const NetworkService = require('../../services/network-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level1000],
    schema: {
      summary: 'Node Tree Move',
      description: 'Move single node tree',
      tags: ['network, tree'],
      params: {
        type: 'object',
        properties: {
          sourceNodeId: {
            type: 'string',
            description: 'Node ID',
          },
        },
      },
      querystring: {
        type: 'object',
        required: [
          'destinationNodeId',
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
          destinationNodeId: {
            type: 'string',
            description: 'Destination Node',
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
  };

  fastify.put(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const sql = fastify.knex;

      const dossierInsurerService = new DossierInsurerService(fastify.mongo.db, sql);
      const customerInsurerService = new CustomerInsurerService(fastify.mongo.db, sql);
      const networkService = new NetworkService(fastify.mongo.db, sql);

      const network = await networkRepository.getNetwork(
        fastify.mongo.db,
        request.query.fromProductivePeriodYear,
        request.query.fromProductivePeriodMonth,
      );

      const sourceNode = firstNode(network.tree, request.params.sourceNodeId);
      const destinationNode = firstNode(network.tree, request.query.destinationNodeId);
      const toDeleteNode = firstNodeParent(network.tree, request.params.sourceNodeId, network.tree);

      if (!sourceNode) reply.send(Boom.badRequest('Nodo Sorgente non trovato'));
      if (!destinationNode) reply.send(Boom.badRequest('Nodo Destinazione non trovato'));
      if (!toDeleteNode) reply.send(Boom.badRequest('Nodo non trovato'));

      const indexToDelete = toDeleteNode.children.findIndex((el) => el._id === request.params.sourceNodeId);
      toDeleteNode.children.splice(indexToDelete, 1);
      toDeleteNode.children.sort(compare);

      destinationNode.children.push(sourceNode);
      destinationNode.children.sort(compare);

      await dossierInsurerService.changeNodeIdOfNodeId(
        sourceNode._id,
        sourceNode._id,
        request.query.fromProductivePeriodYear,
        request.query.fromProductivePeriodMonth,
      );

      await customerInsurerService.changeNodeIdOfNodeId(
        sourceNode._id,
        sourceNode._id,
        request.query.fromProductivePeriodYear,
        request.query.fromProductivePeriodMonth,
      );

      if (sourceNode.promoterId) {
        await dossierInsurerService.changeNodeIdOfPromoterId(
          sourceNode._id,
          sourceNode.promoterId,
          request.query.fromProductivePeriodYear,
          request.query.fromProductivePeriodMonth,
        );

        await customerInsurerService.changeNodeIdOfPromoterId(
          sourceNode._id,
          sourceNode.promoterId,
          request.query.fromProductivePeriodYear,
          request.query.fromProductivePeriodMonth,
        );
      }

      await networkRepository.updateNetwork(
        fastify.mongo.db,
        request.query.fromProductivePeriodYear,
        request.query.fromProductivePeriodMonth,
        network.tree,
      );

      await networkService.updateNode(
        sourceNode._id,
        request.query.fromProductivePeriodYear,
        request.query.fromProductivePeriodMonth,
      );

      return reply.send({
        _meta: {},
        item: network.tree.children,
      });
    }),
  );
  next();
};
