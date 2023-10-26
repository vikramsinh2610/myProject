const Boom = require('boom');
const SurveyService = require('../../../services/survey-srv');
const WorkflowService = require('../../../services/workflow-srv');
const CustomerService = require('../../../services/customer-srv');
const errorHandler = require("../../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Survey List Count',
      description: 'Get Surveys list Count',
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
            default: 0,
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

      const filter = {
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
        ...(request.query.codeSurveyResult
          ? {
              codeSurveyResult: { $regex: request.query.codeSurveyResult, $options: 'i' },
            }
          : {}),
      };

      return (
        surveyService
          .getSurveyResultsIds(filter, 0, 0)
          .then(async (surveyResults) =>
            Promise.all(
              surveyResults.map(async (surveyResult) => {
                try {
                  const workflow = await workflowService.getLastByEntityId(surveyResult._id);

                  if (request.query.workflowState && workflow.state !== request.query.workflowState) {
                    return { skip: true };
                  }

                  if (surveyResult.customerId) {
                    const {name, surname} = await customerService.getCustomerById(surveyResult.customerId);
                    if (
                      request.query.customer &&
                      !`${name} ${surname}`.toLowerCase().includes(request.query.customer.toLowerCase())
                    ) {
                      return { skip: true };
                    }
                  }

                  return {
                    ...surveyResult,
                  };
                } catch {
                  return { skip: true };
                }
              }),
            ),
          )
          // @ts-ignore
          .then((surveyResults) => surveyResults.filter((surveyResult) => !surveyResult.skip))
          .then((surveyResults) =>
            reply.send({
              _meta: {},
              items: surveyResults.length,
            }),
          )
          .catch((error) => reply.send(Boom.badRequest(error.message)))
      );
    }),
  );
  next();
};
