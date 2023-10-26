class ProductConfiguration {
  constructor({ _id, productName, productCode, amount }) {
    this._id = _id;
    this.productName = productName;
    this.productCode = productCode;
    this.amount = amount;
  }
}

module.exports = ProductConfiguration;
