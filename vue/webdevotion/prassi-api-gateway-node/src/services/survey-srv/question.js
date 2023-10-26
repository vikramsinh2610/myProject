const { v4: uuid } = require('uuid');
const Response = require('./response');
const QuestionText = require('./question-text');

class Question {
  constructor({
    _id = uuid(),
    creationDate = new Date(),
    multiple,
    multipleObligatory,
    multipleQuestion,
    texts,
    responses,
    dontCopy = false,
    required = false,
  }) {
    this._id = _id;
    this.creationDate = creationDate;
    this.multiple = multiple;
    this.multipleObligatory = multipleObligatory;
    this.multipleQuestion = multipleQuestion;
    this.texts = texts.map((text) => new QuestionText(text));
    this.responses = responses.map((response) => new Response(response));
    this.dontCopy = dontCopy;
    this.required = required;
  }
}

module.exports = Question;
