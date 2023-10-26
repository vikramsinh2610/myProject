const errorHandler = require("../../utils/error-handler");
const NetworkService = require("../../services/network-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level1000],
    schema: {
      summary: 'Network create copy',
      description: 'Get network create copy previous month',
      tags: ['networks'],
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
      const networkService = new NetworkService(fastify.mongo.db, fastify.knex);
      await networkService.deleteNetworkTree(
        request.query.fromProductivePeriodYear,
        request.query.fromProductivePeriodMonth,
      );
      const nodeTree = await networkService.createAndGetNetworkFromPrevious(
        request.query.fromProductivePeriodYear,
        request.query.fromProductivePeriodMonth,
      );

      return reply.send({
        _meta: {},
        item: nodeTree,
      });
    }),
  );
  next();
};
