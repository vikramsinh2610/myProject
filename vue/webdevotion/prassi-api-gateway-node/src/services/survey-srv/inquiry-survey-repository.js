const Knex = require('knex');
const SurveyResult = require('./survey-result');

/**
 * @param {Knex} sql
 * @param {string} id
 * @returns {Promise<SurveyResult>}
 */
function getById(sql, id) {
  return sql
    .select()
    .from('inquiry_survey')
    .where('id', id)
    .then((x) => {
      if (x.length !== 1) return Promise.reject(new Error('Risultato analisi dei bisogni non trovato'));
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
    .from('inquiry_survey')
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

  if (filter.status) {
    query.andWhere('status', filter.status);
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
 * @param {object} filter
 * @param {number} skip
 * @param {number} count
 * @returns {Promise<Array<SurveyResult>>}
 */
function getAllIds(sql, filter, skip, count) {
  let query = sql.select('id as _id', 'customerId').from('inquiry_survey');

  if (filter.customerId) {
    query.andWhere('customerId', filter.customerId);
  }

  if (filter.userId) {
    query.andWhere('userId', filter.userId);
  }

  if (filter.status) {
    query.andWhere('status', filter.status);
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
  let status = 'draft';

  if (surveyResult.signature) {
    status = surveyResult.signature.procedureCompleted ? 'signed' : 'ready';
  }

  const thisSurveyResult = await sql
    .select()
    .from('inquiry_survey')
    .where('id', surveyResult._id)
    .then((results) => results);

  if (thisSurveyResult && thisSurveyResult.length > 0) {
    return sql('inquiry_survey')
      .update({
        customerId: surveyResult.customerId,
        promoterId: surveyResult.userId,
        surveyCode: surveyResult.codeSurveyResult,
        categories: surveyResult.categories,
        status,
        signedDate: surveyResult.signature ? surveyResult.signature.signedDate : null,
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

  return sql('inquiry_survey')
    .insert({
      id: surveyResult._id,
      customerId: surveyResult.customerId,
      promoterId: surveyResult.userId,
      surveyCode: surveyResult.codeSurveyResult,
      categories: surveyResult.categories,
      status,
      signedDate: surveyResult.signature ? surveyResult.signature.signedDate : null,
      // @ts-ignore
      creationDate:
        surveyResult.creationDate instanceof Date
          ? surveyResult.creationDate.toISOString()
          : surveyResult.creationDate,
      survey_data: surveyResult,
    })
    .then(() => Promise.resolve(surveyResult));
}

module.exports = {
  getById,
  getAll,
  getAllIds,
  replace,
};
