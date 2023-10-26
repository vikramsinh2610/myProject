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

        const onActStart = surveyResult.questions.find((el) => el._id === 'on-act-start-date');
        const onActSartDate = onActStart.responses.find((el) => el._id === 'on-act-start');
        const onActDate = onActStart.responses.find((el) => el._id === 'on-act-date');
        const onActType = surveyResult.questions.find((el) => el._id === 'on-act-type');
        const onActPas = onActType.responses.find((el) => el._id === 'on-act-pas');
        const onActNoCont = onActType.responses.find((el) => el._id === 'on-act-nocont');
        const onActProf = onActType.responses.find((el) => el._id === 'on-act-prof');
        const onActJun = onActType.responses.find((el) => el._id === 'on-act-jun');

        const onRuiBoolean = surveyResult.questions.find((el) => el._id === 'on-rui-boolean');
        const onRuiBooleanNo = onRuiBoolean.responses.find((el) => el._id === 'on-rui-bool-no');
        const onRuiNumber = surveyResult.questions.find((el) => el._id === 'on-rui-number');
        const onRuiN = onRuiNumber.responses.find((el) => el._id === 'on-rui-n');

        const titleName = customerInfo.sex === 'F' ? 'Sig.ra' : 'Sig.';

        // eslint-disable-next-line max-len
        const onActDateFormat = onActDate.typeValue ? moment(onActDate.typeValue).utcOffset('+0200').format('DD/MM/YYYY') :'';
        // eslint-disable-next-line max-len
        const onActSartDateFormat = onActSartDate.typeValue ? moment(onActSartDate.typeValue).utcOffset('+0200').format('DD/MM/YYYY') :'';

        const onSecurityWorkplace = surveyResult.questions.find((el) => el._id === 'on-security-workplace');
        const nomeFiliale = onSecurityWorkplace.responses.find((el) => el._id === 'on-security-wfilia');
        const indirizzoFiliale = onSecurityWorkplace.responses.find((el) => el._id === 'on-security-waddress');

        const html = await fastify
            .view('pages/atto-nomina', {
              customer: customerInfo,

              onRuiBooleanNo,
              onRuiN,
              onActDateFormat,
              onActSartDateFormat,
              onActPas,
              onActNoCont,
              onActProf,
              onActJun,
              titleName,
              nomeFiliale,
              indirizzoFiliale,
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
