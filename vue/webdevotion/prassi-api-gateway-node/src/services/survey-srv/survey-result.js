const { v4: uuid } = require('uuid');
const Question = require('./question');
const { typesSurveyStates } = require('./survey-state-types');

class SurveyResult {
  constructor({
    _id = uuid(),
    codeSurveyResult,
    creationDate = new Date('2017-09-12T00:00:00.000Z'),
    type,
    idSurvey,
    customerId,
    userId = null,
    practiceId,
    dossierId,
    results = [],
    questions = [],
    state = typesSurveyStates.DRAFT,
    pension = {},
    signature = null,
    products = [],
    categories = [],
    filled = false,
  }) {
    this._id = _id;
    this.codeSurveyResult = codeSurveyResult;
    this.creationDate = creationDate;
    this.type = type;
    this.idSurvey = idSurvey;
    this.customerId = customerId;
    this.userId = userId;
    this.practiceId = practiceId;
    this.dossierId = dossierId;
    this.state = state;
    this.results = results.map((result) => ({
      _id: result._id,
      points: result.points,
      gap: result.gap,
      reasons: result.reasons,
      eligible: result.eligible,
    }));
    this.questions = questions.map((question) => new Question(question));
    this.pension = pension;
    this.signature = signature;
    this.products = products;
    this.categories = categories;
    this.filled = filled;
  }
}

module.exports = SurveyResult;
