const Boom = require('boom');
const errorHandler = require('../../utils/error-handler');
const NetworkActionsService = require('../../services/network-actions-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level1000],
    schema: {
      summary: 'Node Tree Create',
      description: 'Create single node tree',
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
          sibling: {
            type: 'boolean',
          },
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
      body: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Promoter serial number',
          },
          name: {
            type: 'string',
            description: 'Node name',
          },
          roleId: {
            type: 'string',
            description: 'Role code',
          },
          enabled: {
            type: 'boolean',
            description: 'Is promoter enabled',
          },
          promoterId: {
            type: 'string',
            description: 'Id promoter',
          },
          promoterName: {
            type: 'string',
            description: 'Name of promoter',
          },
          children: {
            type: 'array',
            description: 'list of children',
          },
        },
      },
    },
  };

  fastify.post(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const networkActionsService = new NetworkActionsService(fastify.mongo.db, fastify.knex);

      try {
        const children = await networkActionsService.createNode(
          request.params.nodeId,
          request.body,
          request.query.fromProductivePeriodYear,
          request.query.fromProductivePeriodMonth,
          request.query.sibling,
        );
        return reply.send({
          _meta: {},
          item: children,
        });
      } catch (error) {
        return reply.send(Boom.badRequest(error.message));
      }
    }),
  );
  next();
};
