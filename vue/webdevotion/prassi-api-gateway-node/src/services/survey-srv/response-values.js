class ResponseValues {
  constructor({ _id, points, reason, conditionedQuestionId }) {
    this._id = _id;
    this.points = points;
    this.reason = reason;
    this.conditionedQuestionId = conditionedQuestionId;
  }
}

module.exports = ResponseValues;
