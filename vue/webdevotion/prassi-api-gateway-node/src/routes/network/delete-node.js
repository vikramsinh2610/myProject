const Boom = require('boom');
const errorHandler = require('../../utils/error-handler');
const { firstNode, firstNodeParent } = require('../../utils/tree');
const networkRepository = require('../../services/network-srv/network-repository');
const DossierInsurerService = require('../../services/dossier-insurer-srv');
const CustomerInsurerService = require('../../services/customer-insurer-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level1000],
    schema: {
      summary: 'Node Tree Delete',
      description: 'Delete single node tree',
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
  };

  fastify.delete(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const sql = fastify.knex;

      const dossierInsurerService = new DossierInsurerService(fastify.mongo.db, sql);
      const customerInsurerService = new CustomerInsurerService(fastify.mongo.db, sql);

      const network = await networkRepository.getNetwork(
        fastify.mongo.db,
        request.query.fromProductivePeriodYear,
        request.query.fromProductivePeriodMonth,
      );

      const editedNode = firstNode(network.tree, request.params.nodeId);
      const parentNode = firstNodeParent(network.tree, request.params.nodeId, network.tree);
      if (!editedNode) return reply.send(Boom.badRequest('Nodo non trovato'));

      const existDossierNode = await dossierInsurerService.existNodeId(
        editedNode._id,
        request.query.fromProductivePeriodYear,
        request.query.fromProductivePeriodMonth,
      );
      const existDossierPromoter = await dossierInsurerService.existPromoterId(
        editedNode.promoterId,
        request.query.fromProductivePeriodYear,
        request.query.fromProductivePeriodMonth,
      );
      const existCustomerNode = await customerInsurerService.existNodeId(
        editedNode._id,
        request.query.fromProductivePeriodYear,
        request.query.fromProductivePeriodMonth,
      );
      const existCustomerPromoter = await customerInsurerService.existPromoterId(
        editedNode.promoterId,
        request.query.fromProductivePeriodYear,
        request.query.fromProductivePeriodMonth,
      );
      if (existDossierNode || existDossierPromoter || existCustomerNode || existCustomerPromoter)
        return reply.send(Boom.badRequest('Impossibile eliminare: esistono pratiche o clienti collegati'));

      const indexToDelete = parentNode.children.findIndex((el) => el._id === request.params.nodeId);
      parentNode.children.splice(indexToDelete, 1);
      await networkRepository.updateNetwork(
        fastify.mongo.db,
        request.query.fromProductivePeriodYear,
        request.query.fromProductivePeriodMonth,
        network.tree,
      );

      networkRepository.deleteNode(
        sql,
        request.params.nodeId,
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
