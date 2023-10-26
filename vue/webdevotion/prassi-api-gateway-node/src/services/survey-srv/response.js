const ResponseValues = require('./response-values');

class Response {
  constructor({ _id, text, selected, type, typeText, typeValue, values, relatedUserField = null }) {
    this._id = _id;
    this.text = text;
    this.selected = selected;
    this.type = type;
    this.typeText = typeText;
    this.typeValue = typeValue;
    this.relatedUserField = relatedUserField;
    this.values = values.map((value) => new ResponseValues(value));
  }
}

module.exports = Response;
