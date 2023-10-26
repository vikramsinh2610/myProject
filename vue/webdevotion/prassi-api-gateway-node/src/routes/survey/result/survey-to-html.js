const Boom = require('boom');
const moment = require('moment');
const SurveyService = require('../../../services/survey-srv');
const CustomerService = require('../../../services/customer-srv');
const CustomerInsurerSrv = require('../../../services/customer-insurer-srv');
const PromoterService = require('../../../services/promoter-srv');
const PracticeService = require('../../../services/practice-srv');
const NetworkService = require('../../../services/network-srv');
const { uuidToBinary } = require('../../../utils/uuid-to-binary');
const errorHandler = require('../../../utils/error-handler');
const personRepository = require("../../../services/person-srv/person-repository");

const list = (fastify, opts, next) => {
  const options = {
    // preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Get HTML document',
      description: 'Get HTML document',
      tags: ['html', 'survey'],
      querystring: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            description: 'Survey type',
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
      const customerService = new CustomerService(fastify.mongo.db);
      const customerInsurerSrv = new CustomerInsurerSrv(fastify.mongo.db);
      const promoterService = new PromoterService(fastify.mongo.db);
      const practiceService = new PracticeService(fastify.mongo.db);
      const networkService = new NetworkService(fastify.mongo.db);
      const numeroProposta = [];
      const sql = fastify.knex;

      try {
        const surveyResult = await surveyService.getSurveyResultById(request.params.surveyResultId);
        const customerInfo = await customerService.getCustomerById(surveyResult.customerId);
        const person = await personRepository.getbyUuid(sql, surveyResult.customerId);
        const survey = await surveyService.getSurveyById(surveyResult.idSurvey);
        const binaryPracticeId = surveyResult.practiceId ? uuidToBinary(surveyResult.practiceId) : '';
        if (survey.type !== 'inquiry' && survey.type !== 'company-inquiry' && surveyResult.practiceId) {
          // @ts-ignore
          const practice = await practiceService.getPracticeByBinaryOldStyle(binaryPracticeId);
          // @ts-ignore
          numeroProposta.push(practice.DatiBase.NumeroProposta);
        }

        const insurer = await customerInsurerSrv.getCustomerInsurerLast(surveyResult.customerId);

        const nodeList = await networkService.getNetworkListFlat(7, '');
        // const nodeList = await networkService.getNetworkListFlat(request.identity.roleId, request.identity._id);

        let ownerId;
        const nodeOriginalPeriod = nodeList.find((el) => el._id === insurer.networkNodeId);
        if (nodeOriginalPeriod) ownerId = nodeOriginalPeriod.validPromoterId;
        if (!ownerId) return reply.send(Boom.badRequest('Nodo promotore non trovato'));

        const { displayName, role } = await promoterService.getPromoterById(ownerId);

        const sections = await surveyService.getSections();
        // eslint-disable-next-line unicorn/no-reduce
        const sectionsList = surveyResult.questions.reduce(
          (acc, item) => ({
            sections: [...acc.sections, item.texts[0].section],
          }),
          { sections: [] },
        );

        const sectionsReList = sectionsList.sections.filter(
          (element, pos) => sectionsList.sections.indexOf(element) === pos,
        );
        const sectionsFinalList = sectionsReList.map((section) => {
          const thisSection = sections.find((el) => el._id === section);
          let questions = surveyResult.questions.filter((el) => el.texts[0].section === thisSection._id);
          const conditionedQuestionList = [];
          questions.forEach((question) => {
            question.responses.forEach((res) => {
              res.values.forEach((value) => {
                if (value.conditionedQuestionId !== '') {
                  res.subQuestion = questions.find((el) => el._id === value.conditionedQuestionId);
                  conditionedQuestionList.push(value.conditionedQuestionId);
                }
              });
            });
          });

          questions = questions.filter((el) => !conditionedQuestionList.includes(el._id));

          return {
            _id: thisSection._id,
            description: thisSection.description,
            descShort: thisSection['short-description'] ? thisSection['short-description'] : '',
            questions: questions.map((question) => ({ ...question, text: question.texts[0].text })),
          };
        });

        const buckets0314 = surveyResult.results
          .filter((el) => ['pension', 'protection', 'saving'].includes(el._id) && el.reasons.length > 0)
          .map((el) => el.reasons[0].reason);

        const arrayNetwork = person.networkHierarchy ? person.networkHierarchy.split("/") : null;
        const networkBranch = arrayNetwork && arrayNetwork.length > 1 ? arrayNetwork[1]: '';
        const buckets0314Set = new Set(buckets0314);
        const html = await fastify
          .view('pages/survey-result', {
            buckets0314: [...buckets0314Set],
            surveyResult,
            numberProposal: numeroProposta[0],
            customer: customerInfo,
            promoter: displayName,
            branch: role,
            type: survey.type === 'company-inquiry' ? 'inquiry' : survey.type,
            sections: sectionsFinalList,
            moment,
            networkBranch
          })
          .then((body) => fastify.view('layouts/default', { title: 'survey', body }));

        return reply.type('text/html').send(html);
      } catch (error) {
        fastify.log.error(error);
        return reply.send(Boom.badRequest(error.message));
      }
    }),
  );

  next();
};

module.exports = list;
