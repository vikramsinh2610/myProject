const errorHandler = require("../../utils/error-handler");
const NetworkService = require("../../services/network-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Network Tree',
      description: 'Get network Tree',
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

  fastify.get(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const networkService = new NetworkService(fastify.mongo.db);
      const nodeTree = await networkService.getNetworkByRole(
        request.identity.roleId,
        request.identity._id,
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
