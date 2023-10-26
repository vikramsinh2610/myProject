const Boom = require('boom');
const WorkflowService = require('../../services/workflow-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Workflow List',
      description: 'Get Workflow list',
      tags: ['workflow'],
      querystring: {
        type: 'object',
        properties: {
          skip: {
            type: 'integer',
            default: 0,
            description: 'Number of items to skip',
          },
          count: {
            type: 'integer',
            default: 20,
            description: 'Number of items to return',
          },
          entityId: {
            type: 'string',
          },
          type: {
            type: 'string',
          },
        },
      },
    },
  };

  fastify.get('/', options, (request, reply) => {
    const workflowService = new WorkflowService(fastify.mongo.db);

    let filter = {};
    if (request.query.entityId) filter = { ...filter, entityId: request.query.entityId };
    if (request.query.type) filter = { ...filter, type: request.query.type };

    workflowService
      .getWorkflows(filter, request.query.skip, request.query.count)
      .then((workflows) => reply.send({ _meta: {}, items: workflows }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
