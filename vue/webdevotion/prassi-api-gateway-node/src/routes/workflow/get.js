const Boom = require('boom');
const WorkflowService = require('../../services/workflow-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Workflow Get Last State',
      description: 'Get a Workflow',
      tags: ['survey'],
    },
  };

  fastify.get('/', options, (request, reply) => {
    const workflowService = new WorkflowService(fastify.mongo.db);

    workflowService
      .getWorkflowById(request.params.workflowId)
      .then((workflow) => reply.send({ _meta: {}, item: workflow }))
      .catch((error) => {
        fastify.log.error(error);
        reply.send(Boom.badRequest(error.message));
      });
  });
  next();
};
