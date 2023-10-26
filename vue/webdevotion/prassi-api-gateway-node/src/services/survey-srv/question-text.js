class QuestionText {
  constructor({ _id, text, section, description }) {
    this._id = _id;
    this.text = text;
    this.description = description;
    this.section = section;
  }
}

module.exports = QuestionText;
