const Boom = require('boom');
const WorkflowService = require('../../services/workflow-srv');
const dateRegex = require('../../utils/iso-6801-date');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Survey Add',
      description: 'Add a Survey',
      tags: ['survey'],
      body: {
        type: 'object',
        required: ['_id'],
        properties: {
          _id: {
            type: 'string',
            description: 'Workflow ID',
          },
          creationDate: {
            type: 'string',
            pattern: dateRegex,
          },
          type: {
            type: 'string',
          },
          entityId: {
            type: 'string',
          },
          approverId: {
            type: 'string',
          },
          approverRoleId: {
            type: 'string',
          },
          approverDisplayName: {
            type: 'string',
          },
          state: {
            type: 'string',
          },
          reason: {
            type: 'string',
          },
        },
      },
    },
  };

  fastify.put('/', options, (request, reply) => {
    const workflowService = new WorkflowService(fastify.mongo.db);

    workflowService
      .nextWorkflowState(request.body)
      .then((workflow) => reply.send({ _meta: {}, item: workflow }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
