const Knex = require('knex');
const Mongo = require('mongodb');
const { v4: uuid } = require('uuid');
const moment = require('moment');
const questionRepository = require('./question-repository');
const surveyRepository = require('./survey-repository');
const inquirySurveyRepository = require('./inquiry-survey-repository');
const WorkflowService = require('../workflow-srv');
const CustomerService = require('../customer-srv');
const surveyResultRepository = require('./survey-result-repository');
const Question = require('./question');
const Survey = require('./survey');
const SurveyResult = require('./survey-result');
const { questionSeed } = require('./seed/question-seed');
const { surveySeed } = require('./seed/survey-seed');
const { surveySectionsSeed } = require('./seed/survey-sections-seed');
const { surveyBucketsSeed } = require('./seed/survey-bucket-value-seed');
const { surveyTypesSeed } = require('./seed/survey-type-seed');
const { typesState } = require('../workflow-srv/state-types');
const { typesWorkflow } = require('../workflow-srv/workflow-types');
const Workflow = require('../workflow-srv/workflow');
const { typesSurveyStates } = require('./survey-state-types');
const counters = require('../../utils/counters');

const calcGap = (points) => {
  if (points > 0) return points < 10 ? points * 10 : 100;
  return 0;
};

const filteredQuestions = (questions, questionsList, surveyType) =>
  questions.map((question) => {
    const thisQuestion = questionsList.find((el) => el._id === question._id) || question;
    let filteredTexts = thisQuestion.texts.filter((text) => text._id === surveyType);
    if (!filteredTexts || filteredTexts.length === 0)
      filteredTexts = thisQuestion.texts.filter((text) => text._id === 'default');
    return { ...thisQuestion, texts: filteredTexts };
  });

const calcUpdatedQuestions = (questions, questionsList, surveyType) =>
  questions.map((question) => {
    const thisQuestion = questionsList.find((el) => el._id === question._id) || question;
    let filteredTexts = thisQuestion.texts.filter((text) => text._id === surveyType);
    if (!filteredTexts || filteredTexts.length === 0)
      filteredTexts = thisQuestion.texts.filter((text) => text._id === 'default');
    const responses = thisQuestion.responses.map((response) => {
      const thisResponse = question.responses.find((el) => el._id === response._id) || response;
      return { ...response, selected: thisResponse.selected, typeValue: thisResponse.typeValue };
    });
    return { ...thisQuestion, texts: filteredTexts, responses };
  });

const calcPensionDate = (questions, sex, birthDate) => {
  const firstPaymentDateQuestion = questions.find((el) => el._id === 'first-pension-payment');
  const currentJobQuestion = questions.find((el) => el._id === 'job-situation');
  if (firstPaymentDateQuestion && currentJobQuestion && sex) {
    const currentJob = currentJobQuestion.responses.find((currentJobResponse) => currentJobResponse.selected === true);
    const firstPaymentDate = firstPaymentDateQuestion.responses[0].typeValue;

    const idCurrentJob = currentJob ? currentJob._id : 'voided';
    const age = moment.duration(moment().diff(moment(birthDate))).asMonths();
    let pensionDate = new Date().toISOString();
    switch (idCurrentJob) {
      case 'voided':
        pensionDate = '';
        break;
      case 'public-employee':
        pensionDate = moment(birthDate)
          .add(65 * 12 + 2, 'months')
          .toISOString();
        break;
      default:
        pensionDate = moment(birthDate)
          .add(67 * 12 + 3, 'months')
          .toISOString();
        break;
    }

    return {
      sex,
      birthDate,
      age,
      firstPaymentDate,
      currentJob: currentJob ? currentJob._id : 'voided',
      pensionDate,
    };
  }
  return {};
};

class SurveyService {
  /**
   * @param {Mongo.Db} mongodb
   * @param {Knex} sql
   */
  constructor(mongodb, sql) {
    this.mongodb = mongodb;
    this.sql = sql;
    this.workflowService = new WorkflowService(mongodb);
    this.customerService = new CustomerService(mongodb);
  }

  /**
   * @param {string} id
   * @returns {Promise<Question>}
   */
  getQuestionById(id) {
    return questionRepository.getById(this.mongodb, id);
  }

  /**
   * @param {object} filter
   * @param {number} skip
   * @param {number} count
   * @returns {Promise<Array<Question>>}
   */
  getQuestions(filter, skip, count) {
    return questionRepository.getAll(this.mongodb, filter, skip, count);
  }

  /**
   * @param {Question} question
   * @returns {Promise<Question>}
   */
  addOrUpdateQuestion(question) {
    return questionRepository.replace(this.mongodb, question);
  }

  /**
   * @param {Survey} survey
   * @param {string} customerId
   * @param {string} userId
   * @param {string} practiceId
   * @param {string} dossierId
   * @returns {Promise<SurveyResult>}
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async addSurveyResult(survey, customerId, userId, practiceId, dossierId) {
    const buckets = await this.getBuckets();
    const questionsList = await this.getQuestions({}, 0, 0);
    const surveyBuckets = buckets.filter((el) => el.surveyType === survey.type);

    const updatedQuestions = calcUpdatedQuestions(survey.questions, questionsList, survey.type);

    const values = [];
    updatedQuestions.forEach((question) => {
      question.responses
        .filter((el) => el.selected)
        .forEach((response) => {
          response.values.forEach((value) => {
            values.push(value);
          });
        });
    });

    // eslint-disable-next-line unicorn/no-reduce
    const calculatedBuckets = values.reduce((accumulator, currentValue) => {
      const currentValueType = accumulator.find((el) => el._id === currentValue._id);
      if (currentValueType) {
        currentValueType.points += currentValue.points;
        if (currentValue.reason)
          currentValueType.reasons.push({ rank: currentValue.points, reason: currentValue.reason });
      } else {
        const nextAccumulator = {
          _id: currentValue._id,
          points: currentValue.points,
          reasons: [],
        };
        if (currentValue.reason)
          // @ts-ignore
          nextAccumulator.reasons.push({ rank: currentValue.points, reason: currentValue.reason });
        accumulator.push(nextAccumulator);
      }
      return accumulator;
    }, []);

    let results = surveyBuckets
      .map(
        (bucket) =>
          calculatedBuckets.find((el) => el._id === bucket._id) || {
            _id: bucket._id,
            points: 0,
            reasons: [],
          },
      )
      .map((el) => ({
        ...el,
        gap: calcGap(el.points),
        eligible: el.points < 50,
      }));

    const targets3014 = updatedQuestions.find((el) => el._id === '03-14-obiettivi');
    if (targets3014) {
      const persone = targets3014.responses.find((el) => el._id === '03-14-01-persone').selected;
      const cose = targets3014.responses.find((el) => el._id === '03-14-02-cose').selected;
      const risparmio = targets3014.responses.find((el) => el._id === '03-14-03-risparmio').selected;
      const previdenza = targets3014.responses.find((el) => el._id === '03-14-04-previdenza').selected;
      const caso1 = risparmio && !previdenza && !cose && !persone;
      const caso2 = !risparmio && previdenza && !cose && !persone;
      const caso3 = !risparmio && !previdenza && (cose || persone);
      const caso4 = risparmio && previdenza && (cose || persone);
      const caso5 = risparmio && previdenza && !cose && !persone;
      const caso6 = !risparmio && previdenza && (cose || persone);
      const caso7 = risparmio && !previdenza && (cose || persone);
      let risparmioBucket = 0;
      let previdenzaBucket = 0;
      let protezioneBucket = 0;
      let reason = '';

      if (caso1) {
        risparmioBucket = 10;
        previdenzaBucket = 0;
        protezioneBucket = 0;
        reason = 'RISPARMIO/INVESTIMENTO';
      }

      if (caso2) {
        risparmioBucket = 0;
        previdenzaBucket = 10;
        protezioneBucket = 0;
        reason = 'PREVIDENZA';
      }

      if (caso3) {
        risparmioBucket = 0;
        previdenzaBucket = 0;
        protezioneBucket = 10;
        reason = 'PROTEZIONE';
      }

      if (caso4) {
        risparmioBucket = 3.33;
        previdenzaBucket = 3.33;
        protezioneBucket = 3.33;
        reason = 'RISPARMIO/INVESTIMENTO, PREVIDENZA E PROTEZIONE';
      }

      if (caso5) {
        risparmioBucket = 5;
        previdenzaBucket = 5;
        protezioneBucket = 0;
        reason = 'RISPARMIO/INVESTIMENTO E PREVIDENZA';
      }

      if (caso6) {
        risparmioBucket = 0;
        previdenzaBucket = 50;
        protezioneBucket = 50;
        reason = 'PREVIDENZA E PROTEZIONE';
      }

      if (caso7) {
        risparmioBucket = 5;
        previdenzaBucket = 0;
        protezioneBucket = 5;
        reason = 'RISPARMIO/INVESTIMENTO E PROTEZIONE ';
      }

      results = [
        ...results,
        {
          _id: 'saving',
          points: risparmioBucket,
          reasons: risparmioBucket > 0 ? [{ rank: Math.trunc(risparmioBucket), reason }] : [],
          gap: calcGap(risparmioBucket),
          eligible: risparmioBucket,
        },
        {
          _id: 'pension',
          points: previdenzaBucket,
          reasons: previdenzaBucket > 0 ? [{ rank: Math.trunc(previdenzaBucket), reason }] : [],
          gap: calcGap(previdenzaBucket),
          eligible: previdenzaBucket < 50,
        },
        {
          _id: 'protection',
          points: protezioneBucket,
          reasons: protezioneBucket > 0 ? [{ rank: Math.trunc(protezioneBucket), reason }] : [],
          gap: calcGap(protezioneBucket),
          eligible: protezioneBucket < 50,
        },
      ];
    }

    let pensionObject = {};
    if (customerId) {
      const { sex, birthDate } = await this.customerService.getCustomerById(customerId);
      pensionObject = calcPensionDate(updatedQuestions, sex, birthDate);
    }

    const codeSurveyResult = await counters.next(this.mongodb, `SRV-ID`).then((count) => `SRV-${count}`);
    const result = new SurveyResult({
      idSurvey: survey._id,
      customerId,
      userId,
      practiceId,
      dossierId,
      ...survey,
      codeSurveyResult,
      results,
      state: typesSurveyStates.DRAFT,
      pension: pensionObject,
      questions: updatedQuestions,
      _id: uuid(),
      creationDate: new Date(),
    });

    await this.workflowService.insertWorkflow(
      new Workflow({
        type: typesWorkflow.SURVEY,
        entityId: result._id,
        approverId: undefined,
        approverRoleId: undefined,
        approverDisplayName: undefined,
        state: typesState.TOBE_APPROVED,
        reason: 'da approvare',
      }),
    );

    return surveyResultRepository.replace(this.sql, result);
  }

  /**
   * @param {string} id
   * @param {SurveyResult} surveyResult
   * @param {number} roleId
   * @returns {Promise<SurveyResult>}
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async updateSurveyResult(id, surveyResult, roleId) {
    const questionsList = await this.getQuestions({}, 0, 0);
    const dbSurveyResult = await surveyResultRepository.getById(this.sql, id);
    if (dbSurveyResult.state !== typesSurveyStates.DRAFT && roleId < 7)
      throw new Error('Il questionario è in sola lettura');

    const buckets = await this.getBuckets();
    const surveyBuckets = buckets.filter((el) => el.surveyType === dbSurveyResult.type);

    const updatedQuestions = calcUpdatedQuestions(surveyResult.questions, questionsList, dbSurveyResult.type);

    const values = [];
    // eslint-disable-next-line sonarjs/no-identical-functions
    updatedQuestions.forEach((question) => {
      question.responses
        .filter((el) => el.selected)
        // eslint-disable-next-line sonarjs/no-identical-functions
        .forEach((response) => {
          response.values.forEach((value) => {
            values.push(value);
          });
        });
    });

    // eslint-disable-next-line sonarjs/no-identical-functions,unicorn/no-reduce
    const calculatedBuckets = values.reduce((accumulator, currentValue) => {
      const currentValueType = accumulator.find((el) => el._id === currentValue._id);
      if (currentValueType) {
        currentValueType.points += currentValue.points;
        if (currentValue.reason)
          currentValueType.reasons.push({ rank: currentValue.points, reason: currentValue.reason });
      } else {
        const nextAccumulator = {
          _id: currentValue._id,
          points: currentValue.points,
          reasons: [],
        };
        if (currentValue.reason)
          // @ts-ignore
          nextAccumulator.reasons.push({ rank: currentValue.points, reason: currentValue.reason });
        accumulator.push(nextAccumulator);
      }
      return accumulator;
    }, []);

    let results = surveyBuckets
      .map(
        // eslint-disable-next-line sonarjs/no-identical-functions
        (bucket) =>
          calculatedBuckets.find((el) => el._id === bucket._id) || {
            _id: bucket._id,
            points: 0,
            reasons: [],
          },
      )
      // eslint-disable-next-line sonarjs/no-identical-functions
      .map((el) => ({
        ...el,
        gap: calcGap(el.points),
        eligible: el.points < 50,
      }));

    const targets3014 = updatedQuestions.find((el) => el._id === '03-14-obiettivi');
    if (targets3014) {
      const persone = targets3014.responses.find((el) => el._id === '03-14-01-persone').selected;
      const cose = targets3014.responses.find((el) => el._id === '03-14-02-cose').selected;
      const risparmio = targets3014.responses.find((el) => el._id === '03-14-03-risparmio').selected;
      const previdenza = targets3014.responses.find((el) => el._id === '03-14-04-previdenza').selected;
      const caso1 = risparmio && !previdenza && !cose && !persone;
      const caso2 = !risparmio && previdenza && !cose && !persone;
      const caso3 = !risparmio && !previdenza && (cose || persone);
      const caso4 = risparmio && previdenza && (cose || persone);
      const caso5 = risparmio && previdenza && !cose && !persone;
      const caso6 = !risparmio && previdenza && (cose || persone);
      const caso7 = risparmio && !previdenza && (cose || persone);
      let risparmioBucket = 0;
      let previdenzaBucket = 0;
      let protezioneBucket = 0;
      let reason = '';

      if (caso1) {
        risparmioBucket = 10;
        previdenzaBucket = 0;
        protezioneBucket = 0;
        reason = 'RISPARMIO/INVESTIMENTO';
      }

      if (caso2) {
        risparmioBucket = 0;
        previdenzaBucket = 10;
        protezioneBucket = 0;
        reason = 'PREVIDENZA';
      }

      if (caso3) {
        risparmioBucket = 0;
        previdenzaBucket = 0;
        protezioneBucket = 10;
        reason = 'PROTEZIONE';
      }

      if (caso4) {
        risparmioBucket = 3.33;
        previdenzaBucket = 3.33;
        protezioneBucket = 3.33;
        reason = 'RISPARMIO/INVESTIMENTO, PREVIDENZA E PROTEZIONE';
      }

      if (caso5) {
        risparmioBucket = 5;
        previdenzaBucket = 5;
        protezioneBucket = 0;
        reason = 'RISPARMIO/INVESTIMENTO E PREVIDENZA';
      }

      if (caso6) {
        risparmioBucket = 0;
        previdenzaBucket = 50;
        protezioneBucket = 50;
        reason = 'PREVIDENZA E PROTEZIONE';
      }

      if (caso7) {
        risparmioBucket = 5;
        previdenzaBucket = 0;
        protezioneBucket = 5;
        reason = 'RISPARMIO/INVESTIMENTO E PROTEZIONE ';
      }

      results = [
        ...results,
        {
          _id: 'saving',
          points: risparmioBucket,
          reasons: risparmioBucket > 0 ? [{ rank: Math.trunc(risparmioBucket), reason }] : [],
          gap: calcGap(risparmioBucket),
          eligible: risparmioBucket,
        },
        {
          _id: 'pension',
          points: previdenzaBucket,
          reasons: previdenzaBucket > 0 ? [{ rank: Math.trunc(previdenzaBucket), reason }] : [],
          gap: calcGap(previdenzaBucket),
          eligible: previdenzaBucket < 50,
        },
        {
          _id: 'protection',
          points: protezioneBucket,
          reasons: protezioneBucket > 0 ? [{ rank: Math.trunc(protezioneBucket), reason }] : [],
          gap: calcGap(protezioneBucket),
          eligible: protezioneBucket < 50,
        },
      ];
    }

    let pensionObject = {};
    if (dbSurveyResult.customerId) {
      const { sex, birthDate } = await this.customerService.getCustomerById(dbSurveyResult.customerId);
      pensionObject = calcPensionDate(updatedQuestions, sex, birthDate);
    }

    const nextSurveyResult = new SurveyResult({
      ...dbSurveyResult,
      results,
      pension: pensionObject,
      questions: updatedQuestions,
      filled: surveyResult.filled,
    });

    return surveyResultRepository.replace(this.sql, nextSurveyResult);
  }

  /**
   * @param {string} id
   * @param {object} signature
   * @returns {Promise<object>}
   */
  updateSignature(id, signature) {
    return surveyResultRepository.replaceSignature(this.sql, id, signature);
  }

  /**
   * @param {string} id
   * @param {object} products
   * @param {object} categories
   * @returns {Promise<object>}
   */
  updateProducts(id, products, categories) {
    return surveyResultRepository.replaceProducts(this.sql, id, products, categories);
  }

  /**
   * @param {string} id
   * @returns {Promise<SurveyResult>}
   */
  getSurveyResultById(id) {
    return surveyResultRepository.getById(this.sql, id);
  }

  /**
   * @param {string} id
   * @returns {Promise<SurveyResult>}
   */
  getInquirySurveyById(id) {
    return inquirySurveyRepository.getById(this.sql, id);
  }

  /**
   * @param {object} filter
   * @param {number} skip
   * @param {number} count
   * @returns {Promise<Array<SurveyResult>>}
   */
  getSurveyResults(filter, skip, count) {
    return surveyResultRepository.getAll(this.sql, filter, skip, count);
  }

  /**
   * @param {object} filter
   * @param {number} skip
   * @param {number} count
   * @returns {Promise<Array<SurveyResult>>}
   */
  getSurveyResultsIds(filter, skip, count) {
    return surveyResultRepository.getAllIds(this.sql, filter, skip, count);
  }

  /**
   * @param {SurveyResult} surveyResult
   * @returns {Promise<SurveyResult>}
   */
  async replaceInquirySurvey(surveyResult) {
    return inquirySurveyRepository.replace(this.sql, surveyResult);
  }

  /**
   * @param {string} id
   * @returns {Promise<SurveyResult>}
   */
  async confirmSurveyResult(id) {
    const result = await surveyResultRepository.getById(this.sql, id);
    if (result.state !== typesSurveyStates.DRAFT) throw new Error('Stato non ammesso');
    const nextResult = new SurveyResult({ ...result, state: typesSurveyStates.CONFIRMED });
    return surveyResultRepository.replace(this.sql, nextResult);
  }

  /**
   * @param {string} id
   * @returns {Promise<SurveyResult>}
   */
  async publishSurveyResult(id) {
    const result = await surveyResultRepository.getById(this.sql, id);
    if (result.state !== typesSurveyStates.CONFIRMED) throw new Error('Stato non ammesso');
    const nextResult = new SurveyResult({ ...result, state: typesSurveyStates.PUBLISHED });

    const workflow = await this.workflowService.getLastByEntityId(result._id);

    if (workflow && workflow.state === typesState.INCOMPLETE) {
      await this.workflowService.insertWorkflow(
        new Workflow({
          type: typesWorkflow.SURVEY,
          entityId: result._id,
          approverId: undefined,
          approverRoleId: undefined,
          approverDisplayName: undefined,
          state: typesState.TOBE_APPROVED,
          reason: 'da approvare',
        }),
      );
    }

    return surveyResultRepository.replace(this.sql, nextResult);
  }

  /**
   * @param {string} id
   * @returns {Promise<SurveyResult>}
   */
  async unPublishSurveyResult(id) {
    const result = await surveyResultRepository.getById(this.sql, id);
    if (result.state !== typesSurveyStates.PUBLISHED) throw new Error('Stato non ammesso');
    const nextResult = new SurveyResult({ ...result, state: typesSurveyStates.CONFIRMED });

    return surveyResultRepository.replace(this.sql, nextResult);
  }

  /**
   * @param {string} id
   * @returns {Promise<SurveyResult>}
   */
  async unConfirmSurveyResult(id) {
    const result = await surveyResultRepository.getById(this.sql, id);
    if (result.state !== typesSurveyStates.CONFIRMED) throw new Error('Stato non ammesso');
    const nextResult = new SurveyResult({ ...result, state: typesSurveyStates.DRAFT });

    return surveyResultRepository.replace(this.sql, nextResult);
  }

  /**
   * @param {string} id
   * @returns {Promise<Survey>}
   */
  async getSurveyById(id) {
    const questionsList = await this.getQuestions({}, 0, 0);
    return surveyRepository.getById(this.mongodb, id).then((surveyFromDb) => ({
      ...surveyFromDb,
      questions: filteredQuestions(surveyFromDb.questions, questionsList, surveyFromDb.type),
    }));
  }

  /**
   * @param {object} filter
   * @param {number} skip
   * @param {number} count
   * @returns {Promise<Array<Survey>>}
   */
  async getSurveys(filter, skip, count) {
    const questionsList = await this.getQuestions({}, 0, 0);
    return surveyRepository.getAll(this.mongodb, filter, skip, count).then((surveys) =>
      // eslint-disable-next-line max-len
      surveys.map((survey) => ({
        ...survey,
        questions: filteredQuestions(survey.questions, questionsList, survey.type),
      })),
    );
  }

  /**
   * @param {Survey} survey
   * @returns {Promise<Survey>}
   */
  async addOrUpdateSurvey(survey) {
    const questionsList = await this.getQuestions({}, 0, 0);
    return surveyRepository.replace(this.mongodb, survey).then((surveyFromDb) => ({
      ...surveyFromDb,
      questions: filteredQuestions(surveyFromDb.questions, questionsList, surveyFromDb.type),
    }));
  }

  /**
   * @returns {Promise<object>}
   */
  insertSeed() {
    return Promise.all([
      surveyRepository.insertSeed(this.mongodb, surveySeed),
      questionRepository.insertSeed(this.mongodb, questionSeed),
      surveyTypesSeed.map((s) =>
        this.mongodb.collection('survey-type').replaceOne({ _id: s._id }, s, { upsert: true }),
      ),
      surveyBucketsSeed.map((s) =>
        this.mongodb.collection('survey-bucket').replaceOne({ _id: s._id }, s, { upsert: true }),
      ),
      surveySectionsSeed.map((s) =>
        this.mongodb.collection('survey-section').replaceOne({ _id: s._id }, s, { upsert: true }),
      ),
    ]);
  }

  /**
   * @returns {Promise<Array<object>>}
   */
  getSections() {
    return this.mongodb.collection('survey-section').find({}).toArray();
  }

  /**
   * @returns {Promise<Array<object>>}
   */
  getBuckets() {
    return this.mongodb.collection('survey-bucket').find({}).toArray();
  }

  /**
   * @returns {Promise<Array<object>>}
   */
  getTypes() {
    return this.mongodb.collection('survey-type').find({}).toArray();
  }

  /**
   * @returns {Promise<object>}
   */
  createIndexes() {
    return questionRepository.createIndexes(this.mongodb);
  }
}

module.exports = SurveyService;
