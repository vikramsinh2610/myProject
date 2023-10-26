const { v4: uuid } = require('uuid');
const Question = require('./question');

class Survey {
  constructor({ _id = uuid(), creationDate = new Date(), type, questions }) {
    this._id = _id;
    this.creationDate = creationDate;
    this.type = type;
    this.questions = questions.map((question) => new Question(question));
  }
}

module.exports = Survey;
