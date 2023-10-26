class ExcelInputData {
  constructor({
    headers = [],
    data = [],
  }) {
    this.headers = headers;
    this.data = data;
  }
}

module.exports = ExcelInputData;
