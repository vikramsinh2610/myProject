const Boom = require('boom');
const moment = require('moment');
const SurveyService = require('../../../services/survey-srv');
const PromoterService = require('../../../services/promoter-srv');
const errorHandler = require('../../../utils/error-handler');

const list = (fastify, opts, next) => {
  const options = {
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
      const promoterService = new PromoterService(fastify.mongo.db);

      try {
        const surveyResult = await surveyService.getSurveyResultById(request.params.surveyResultId);
        const customerInfo = await promoterService.getPromoterById(surveyResult.userId);
        const survey = await surveyService.getSurveyById(surveyResult.idSurvey);
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

        const onEvaBasic= surveyResult.questions.find((el) => el._id === 'on-eval-basic');
        const onEvalBasicYears = onEvaBasic.responses.find((el) => el._id === 'on-eval-basic-years');
        const onEvalBasicYass = onEvaBasic.responses.find((el) => el._id === 'on-eval-basic-yass');
        const onEvalBasicSheltia = onEvaBasic.responses.find((el) => el._id === 'on-eval-basic-sheltia');
        const onEvalBasicBroker = onEvaBasic.responses.find((el) => el._id === 'on-eval-basic-broker');

        const onEvalCommercial = surveyResult.questions.find((el) => el._id === 'on-eval-commercial');
        const onEvalCommAss = onEvalCommercial.responses.find((el) => el._id === 'on-eval-comm-ass');
        const onEvalCommProduction = onEvalCommercial.responses.find((el) => el._id === 'on-eval-comm-prod');
        const onEvalCommNego = onEvalCommercial.responses.find((el) => el._id === 'on-eval-comm-nego');
        const onEvalCommAna = onEvalCommercial.responses.find((el) => el._id === 'on-eval-comm-ana');
        const onEvalCommSelf = onEvalCommercial.responses.find((el) => el._id === 'on-eval-comm-self');

        const onEvalRelation = surveyResult.questions.find((el) => el._id === 'on-eval-relation');
        const onEvalRelEmph = onEvalRelation.responses.find((el) => el._id === 'on-eval-rel-emph');
        const onEvalRelPers = onEvalRelation.responses.find((el) => el._id === 'on-eval-rel-pers');
        const onEvalRelDial = onEvalRelation.responses.find((el) => el._id === 'on-eval-rel-dial');
        const onEvalRelAssert = onEvalRelation.responses.find((el) => el._id === 'on-eval-rel-assert');
        const onEvalRelFlex = onEvalRelation.responses.find((el) => el._id === 'on-eval-rel-flex');
        const onEvalRelAttitu = onEvalRelation.responses.find((el) => el._id === 'on-eval-rel-attitu');

        const onEvalOther = surveyResult.questions.find((el) => el._id === 'on-eval-other');
        const onEvalOtherChannel = onEvalOther.responses.find((el) => el._id === 'on-eval-other-channel');
        const onEvalOtherSelection = onEvalOther.responses.find((el) => el._id === 'on-eval-other-selection');
        const onEvalOtherN = onEvalOther.responses.find((el) => el._id === 'on-eval-other-n');
        const onEvalOtherData = onEvalOther.responses.find((el) => el._id === 'on-eval-other-data');
        const onEvalOtherDatain = onEvalOther.responses.find((el) => el._id === 'on-eval-other-datain');

        const onEvalSign = surveyResult.questions.find((el) => el._id === 'on-eval-sign');
        const onRolePositionSignaler = surveyResult.questions.find((el) => el._id === 'on-role-position-signaler');

        const onFormNeoCanc = surveyResult.questions.find((el) => el._id === 'on-form-neo-canc');
        const onFormNcData = onFormNeoCanc.responses.find((el) => el._id === 'on-form-nc-data');
        const onFormNcName = onFormNeoCanc.responses.find((el) => el._id === 'on-form-nc-name');

        const onRoleContrinBool = surveyResult.questions.find((el) => el._id === 'on-role-contribution-bool');
        const onRoleContributionNo = onRoleContrinBool.responses.find((el) => el._id === 'on-role-contribution-no');

        const onRolePosition = surveyResult.questions.find((el) => el._id === 'on-role-position');
        const onRolPositionRole = onRolePosition.responses.find((el) => el._id === 'on-role-position-role');

        const onRoleContDetail = surveyResult.questions.find((el) => el._id === 'on-role-contribution-detail');
        const onRoleContributionDet = onRoleContDetail.responses.find((el) => el._id === 'on-role-contribution-det');


        const html = await fastify
          .view('pages/scheda-valutazione', {
            surveyResult,
            customer: customerInfo,
            type: survey.type,
            sections: sectionsFinalList,
            moment,
            onEvalBasicYears,
            onEvalBasicYass,
            onEvalBasicSheltia,
            onEvalBasicBroker,
            onEvalCommAss,
            onEvalCommProduction,
            onEvalCommNego,
            onEvalCommAna,
            onEvalCommSelf,
            onEvalRelEmph,
            onEvalRelPers,
            onEvalRelDial,
            onEvalRelAssert,
            onEvalRelFlex,
            onEvalRelAttitu,
            onEvalOtherChannel,
            onEvalOtherSelection,
            onEvalOtherN,
            onEvalOtherData,
            onEvalOtherDatain,
            onEvalSign,
            onRolePositionSignaler,
            onFormNcData,
            onFormNcName,
            onRoleContributionNo,
            onRolPositionRole,
            onRoleContributionDet,

          })
          .then((body) => fastify.view('layouts/default-docs', { title: 'survey', body }));

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
