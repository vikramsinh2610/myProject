const Boom = require('boom');
const SurveyService = require('../../../services/survey-srv');
const CustomerService = require('../../../services/customer-srv');
const CustomerInsurerSrv = require('../../../services/customer-insurer-srv');
const WorkflowService = require('../../../services/workflow-srv');
const NetworkService = require('../../../services/network-srv');
const dateRegex = require('../../../utils/iso-6801-date');
const errorHandler = require('../../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Survey Result Add',
      description: 'Add a Survey Result',
      tags: ['survey'],
      body: {
        type: 'object',
        required: ['_id'],
        properties: {
          _id: {
            type: 'string',
            description: 'Question ID',
          },
          creationDate: {
            type: 'string',
            pattern: dateRegex,
          },
          type: {
            type: 'string',
          },
          filled: {
            type: 'boolean',
          },
          questions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
              },
            },
          },
        },
      },
    },
  };

  fastify.put(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const surveyService = new SurveyService(fastify.mongo.db, fastify.knex);
      const workflowService = new WorkflowService(fastify.mongo.db);
      const customerService = new CustomerService(fastify.mongo.db);
      const customerInsurerSrv = new CustomerInsurerSrv(fastify.mongo.db);
      const networkService = new NetworkService(fastify.mongo.db);

      const nodeList = await networkService.getNetworkListFlat(request.identity.roleId, request.identity._id);

      fastify.log.info(request.body);
      return surveyService
        .addSurveyResult(
          request.body,
          request.query.customerId,
          request.identity._id,
          request.query.practiceId,
          request.query.dossierId,
        )
        .then(async (surveyResult) => {
          const workflow = await workflowService.getLastByEntityId(surveyResult._id);

          if (surveyResult.customerId) {
            const { name, surname } = await customerService.getCustomerById(surveyResult.customerId);
            const insurer = await customerInsurerSrv.getCustomerInsurerLast(surveyResult.customerId);

            let ownerId;
            const nodeOriginalPeriod = nodeList.find((el) => el._id === insurer.networkNodeId);
            if (nodeOriginalPeriod) ownerId = nodeOriginalPeriod.validPromoterId;

            return reply.send({
              _meta: {},
              item: {
                ...surveyResult,
                displayCustomerName: `${name} ${surname}`,
                ownerId,
                ownerNetworkId: insurer.networkNodeId,
                workflow: {
                  state: workflow.state,
                  creationDate: workflow.creationDate,
                  reason: workflow.reason,
                  _id: workflow._id,
                  entityId: workflow.entityId,
                  approverId: workflow.approverId,
                  approverRoleId: workflow.approverRoleId,
                  approverDisplayName: workflow.approverDisplayName,
                },
              },
            });
          }

          return reply.send({
            _meta: {},
            item: {
              ...surveyResult,
              workflow: {
                state: workflow.state,
                creationDate: workflow.creationDate,
                reason: workflow.reason,
                _id: workflow._id,
                entityId: workflow.entityId,
                approverId: workflow.approverId,
                approverRoleId: workflow.approverRoleId,
                approverDisplayName: workflow.approverDisplayName,
              },
            },
          });
        })
        .catch((error) => reply.send(Boom.badRequest(error.message)));
    }),
  );
  next();
};
