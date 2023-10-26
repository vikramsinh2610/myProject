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

        const onSecurityWorkplace = surveyResult.questions.find((el) => el._id === 'on-security-workplace');
        const cityResponse = onSecurityWorkplace.responses.find((el) => el._id === 'on-security-wfilia');
        const addressResponse = onSecurityWorkplace.responses.find((el) => el._id === 'on-security-waddress');

        const internalUserPrivacy = surveyResult.questions.find((el) => el._id === 'on-require-attachment-fisical');
        const onPrivacyPlace = internalUserPrivacy.responses.find((el) => el._id === 'on-require-attach-fplace');
        const onPrivacyDate = internalUserPrivacy.responses.find((el) => el._id === 'on-require-attach-fdate');
        // eslint-disable-next-line max-len
        const onPrivacyDateFormat = onPrivacyDate.typeValue ? moment(onPrivacyDate.typeValue).utcOffset('+0200').format('DD/MM/YYYY') :'';
        // eslint-disable-next-line max-len
        const luogoData = onPrivacyPlace.typeValue ? `${onPrivacyPlace.typeValue}, ${onPrivacyDateFormat}` : `${onPrivacyDateFormat}`;

        const html = await fastify
            .view('pages/autocert-per-fisica', {
              surveyResult,
              customer: customerInfo,
              type: survey.type,
              sections: sectionsFinalList,
              moment,
              cityResponse,
              addressResponse,
              luogoData,
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
