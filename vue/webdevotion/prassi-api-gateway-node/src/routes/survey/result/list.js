const Boom = require('boom');
const moment = require('moment');
const SurveyService = require('../../../services/survey-srv');
const WorkflowService = require('../../../services/workflow-srv');
const CustomerService = require('../../../services/customer-srv');
const CustomerInsurerSrv = require('../../../services/customer-insurer-srv');
const NetworkService = require('../../../services/network-srv');
const errorHandler = require('../../../utils/error-handler');
require('../../../utils/foreach');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Survey List',
      description: 'Get Surveys list',
      tags: ['survey'],
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
          customerId: {
            type: 'string',
            description: 'Customer Id Search',
          },
          practiceId: {
            type: 'string',
            description: 'Practice Id Search',
          },
          state: {
            type: 'string',
            description: 'Only published/confirmed/draft results',
          },
          workflowState: {
            type: 'string',
            description: 'Only workflow state',
          },
          codeSurveyResult: {
            type: 'string',
            description: 'Search by number',
          },
          customer: {
            type: 'string',
            description: 'Search by customer name',
          },
        },
      },
    },
  };

  fastify.get(
    '/',
    options,
    // eslint-disable-next-line sonarjs/cognitive-complexity
    errorHandler(async (request, reply) => {
      const surveyService = new SurveyService(fastify.mongo.db, fastify.knex);
      const workflowService = new WorkflowService(fastify.mongo.db);
      const customerService = new CustomerService(fastify.mongo.db);
      const customerInsurerSrv = new CustomerInsurerSrv(fastify.mongo.db);
      const networkService = new NetworkService(fastify.mongo.db);
      const nodeList = await networkService.getNetworkListFlat(request.identity.roleId, request.identity._id);

      const filter = {
        $or: [{ creationDate: { $gte: moment(`01-01-2022`, 'DD-MM-YYYY').toDate() } }, { type: { $eq: 'onboarding' } }],
        ...(request.query.customerId
          ? {
              customerId: request.query.customerId,
            }
          : {}),
        ...(request.query.userId
          ? {
              userId: request.query.userId,
            }
          : {}),
        ...(request.query.practiceId
          ? {
              practiceId: request.query.practiceId,
            }
          : {}),
        ...(request.query.state
          ? {
              state: request.query.state,
            }
          : {}),
        ...(request.query.type
          ? {
              type: request.query.type,
            }
          : {}),
        ...(request.query.codeSurveyResult
          ? {
              codeSurveyResult: { $regex: request.query.codeSurveyResult, $options: 'i' },
            }
          : {}),
      };

      return (
        surveyService
          .getSurveyResults(filter, 0, 0)
          .then(async (surveyResults) => {
            const surveyResultsMapped = [];
            // @ts-ignore
            await surveyResults.forEachAsync(async (surveyResult) => {
              try {
                const workflow = await workflowService.getLastByEntityId(surveyResult._id);

                if (request.query.workflowState && workflow.state !== request.query.workflowState) {
                  return { skip: true };
                }

                if (surveyResult.customerId) {
                  const { name, surname } = await customerService.getCustomerById(surveyResult.customerId);
                  const insurer = await customerInsurerSrv.getCustomerInsurerLast(surveyResult.customerId);

                  if (
                    request.query.customer &&
                    !`${name} ${surname}`.toLowerCase().includes(request.query.customer.toLowerCase())
                  ) {
                    return { skip: true };
                  }

                  let ownerId;
                  const nodeOriginalPeriod = nodeList.find((el) => el._id === insurer.networkNodeId);
                  if (nodeOriginalPeriod) ownerId = nodeOriginalPeriod.validPromoterId;
                  if (!ownerId) {
                    return { skip: true };
                  }

                  surveyResultsMapped.push({
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
                  });
                } else {
                  surveyResultsMapped.push({
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
                  });
                }

                return { skip: false };
              } catch {
                return { skip: true };
              }
            });
            return surveyResultsMapped;
          })
          // @ts-ignore
          .then((surveyResults) => surveyResults.filter((surveyResult) => !surveyResult.skip))
          .then((surveyResults) =>
            reply.send({
              _meta: {},
              items: surveyResults.slice(
                request.query.skip,
                request.query.count === 0 ? surveyResults.length : request.query.count + request.query.skip,
              ),
            }),
          )
          .catch((error) => reply.send(Boom.badRequest(error.message)))
      );
    }),
  );
  next();
};
