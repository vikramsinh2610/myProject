const SurveyService = require('../../../services/survey-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Update matching products for a survey result',
      tags: ['survey'],
    },
  };

  fastify.post('/', options, async (req, reply) => {
    const surveyService = new SurveyService(fastify.mongo.db, fastify.knex);
    const { surveyResultId } = req.params;
    const { products, categories } = req.body;

    await surveyService.updateProducts(surveyResultId, products, categories);

    const doc = await surveyService.getInquirySurveyById(surveyResultId);
    doc.products = products;
    doc.categories = categories;
    await surveyService.replaceInquirySurvey(doc);

    return reply.send({ result: 'ok' });
  });

  next();
};
