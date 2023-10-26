const Knex = require('knex');
const SurveyResult = require('./survey-result');
const inquirySurveyRepository = require('./inquiry-survey-repository');

/**
 * @param {Knex} sql
 * @param {string} id
 * @returns {Promise<SurveyResult>}
 */
function getById(sql, id) {
  return sql
    .select()
    .from('survey_results')
    .where('id', id)
    .then((x) => {
      if (x.length !== 1) return Promise.reject(new Error('Risultato questionario non trovato'));
      return Promise.resolve(new SurveyResult(x[0].survey_data));
    });
}

/**
 * @param {Knex} sql
 * @param {object} filter
 * @param {number} skip
 * @param {number} count
 * @returns {Promise<Array<SurveyResult>>}
 */
function getAll(sql, filter, skip, count) {
  let query = sql
    .select()
    .from('survey_results')
    // eslint-disable-next-line func-names
    .where(function () {
      // @ts-ignore
      this.where('creationDate', '>=', '2022-01-01T00:00:00Z').orWhere('type', 'onboarding');
    });

  if (filter.customerId) {
    query.andWhere('customerId', filter.customerId);
  }

  if (filter.userId) {
    query.andWhere('promoterId', filter.userId);
  }

  if (filter.practiceId) {
    query.andWhere('practiceId', filter.practiceId);
  }

  if (filter.state) {
    query.andWhere('state', filter.state);
  }

  if (filter.codeSurveyResult) {
    query.andWhere('surveyCode', filter.codeSurveyResult);
  }

  if (filter.type) {
    query.andWhere('type', filter.type);
  }

  query = skip ? query.skip(skip) : query;
  query = count ? query.limit(count) : query;

  // eslint-disable-next-line promise/always-return
  return query
    .orderBy('creationDate', 'desc')
    .then((results) => results.map((myres) => new SurveyResult(myres.survey_data)));
}

/**
 * @param {Knex} sql
 * @param {object} filter
 * @param {number} skip
 * @param {number} count
 * @returns {Promise<Array<SurveyResult>>}
 */
function getAllIds(sql, filter, skip, count) {
  let query = sql.select('id as _id', 'customerId').from('survey_results');

  if (filter.customerId) {
    query.andWhere('customerId', filter.customerId);
  }

  if (filter.userId) {
    query.andWhere('userId', filter.userId);
  }

  if (filter.practiceId) {
    query.andWhere('practiceId', filter.practiceId);
  }

  if (filter.state) {
    query.andWhere('state', filter.state);
  }

  if (filter.codeSurveyResult) {
    query.andWhere('surveyCode', filter.codeSurveyResult);
  }

  query = skip ? query.skip(skip) : query;
  query = count ? query.limit(count) : query;

  return query.orderBy('creationDate', 'desc').then((results) => results.map((x) => new SurveyResult(x.survey_data)));
}

/**
 * @param {Knex} sql
 * @param {SurveyResult} surveyResult
 * @returns {Promise<SurveyResult>}
 */
async function replace(sql, surveyResult) {
  if (surveyResult.type === 'inquiry' || surveyResult.type === 'company-inquiry') {
    await inquirySurveyRepository.replace(sql, surveyResult);
  }

  const thisSurveyResult = await sql
    .select()
    .from('survey_results')
    .where('id', surveyResult._id)
    .then((results) => results);

  if (thisSurveyResult && thisSurveyResult.length > 0) {
    return sql('survey_results')
      .update({
        customerId: surveyResult.customerId,
        promoterId: surveyResult.userId,
        surveyCode: surveyResult.codeSurveyResult,
        type: surveyResult.type,
        state: surveyResult.state,
        practiceId: surveyResult.practiceId,
        // @ts-ignore
        creationDate:
          surveyResult.creationDate instanceof Date
            ? surveyResult.creationDate.toISOString()
            : surveyResult.creationDate,
        survey_data: surveyResult,
      })
      .where('id', surveyResult._id)
      .then(() => Promise.resolve(surveyResult));
  }

  return sql('survey_results')
    .insert({
      id: surveyResult._id,
      customerId: surveyResult.customerId,
      promoterId: surveyResult.userId,
      surveyCode: surveyResult.codeSurveyResult,
      type: surveyResult.type,
      state: surveyResult.state,
      practiceId: surveyResult.practiceId,
      // @ts-ignore
      creationDate:
        surveyResult.creationDate instanceof Date ? surveyResult.creationDate.toISOString() : surveyResult.creationDate,
      survey_data: surveyResult,
    })
    .then(() => Promise.resolve(surveyResult));
}

/**
 * @param {Knex} sql
 * @param {string} id
 * @param {object} signature
 * @returns {Promise<object>}
 */
async function replaceSignature(sql, id, signature) {
  const thisSurveyResult = await sql
    .select()
    .from('survey_results')
    .where('id', id)
    .then((results) => results);

  if (thisSurveyResult && thisSurveyResult.length > 0) {
    return sql('survey_results')
      .update({ survey_data: { ...thisSurveyResult[0].survey_data, signature } })
      .where('id', id)
      .then(() => Promise.resolve(signature));
  }

  return Promise.reject(new Error(`Error updating survey signature: survey not existing ${id}`));
}

/**
 * @param {Knex} sql
 * @param {string} id
 * @param {object} products
 * @param {object} categories
 * @returns {Promise<object>}
 */
async function replaceProducts(sql, id, products, categories) {
  const thisSurveyResult = await sql
    .select()
    .from('survey_results')
    .where('id', id)
    .then((results) => results);

  if (thisSurveyResult && thisSurveyResult.length > 0) {
    return sql('survey_results')
      .update({ survey_data: { ...thisSurveyResult[0].survey_data, products, categories } })
      .where('id', id)
      .then(() => Promise.resolve(products));
  }

  return Promise.reject(new Error(`Error updating survey products: survey not existing ${id}`));
}

module.exports = {
  getById,
  getAll,
  getAllIds,
  replace,
  replaceSignature,
  replaceProducts,
};
