const Boom = require('boom');
const errorHandler = require("../../utils/error-handler");
const NetworkActionsService = require('../../services/network-actions-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level1000],
    schema: {
      summary: 'Move customers',
      description: 'Move customers from node to node',
      tags: ['network, tree, customers'],
      params: {
        type: 'object',
        properties: {
          nodeTargetId: {
            type: 'string',
            description: 'Node ID',
          },
          nodeDestinationId: {
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

  fastify.put(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const networkActionsService = new NetworkActionsService(fastify.mongo.db, fastify.knex);

      try {
        await networkActionsService.moveNodeCustomer(
          request.params.nodeTargetId,
          request.params.nodeDestinationId,
          request.query.fromProductivePeriodYear,
          request.query.fromProductivePeriodMonth,
        );
        return reply.send({
          _meta: {},
          item: {status: 'ok'},
        });
      } catch (error) {
        return reply.send(Boom.badRequest(error.message));
      }
    }),
  );
  next();
};
