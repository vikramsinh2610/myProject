// eslint-disable-next-line max-classes-per-file
class ProductId {
  constructor({ id, productNumber }) {
    this.id = id;
    this.productNumber = productNumber;
  }
}

class AdjustedBonus {
  constructor({ productIds, adjustedPercentageSubscription, adjustedPercentageAdditionalIncome }) {
    this.productIds = productIds.map((productId) => new ProductId(productId));
    this.adjustedPercentageSubscription = adjustedPercentageSubscription;
    this.adjustedPercentageAdditionalIncome = adjustedPercentageAdditionalIncome;
  }
}

class ProductConfiguration {
  constructor({
    productId,
    productName,
    adjustedPercentageSubscription,
    adjustedPercentageAdditionalIncome,
    adjustedBonus = null,
  }) {
    this.productId = productId;
    this.productName = productName;
    this.adjustedPercentageSubscription = adjustedPercentageSubscription;
    this.adjustedPercentageAdditionalIncome = adjustedPercentageAdditionalIncome;
    this.adjustedBonus = adjustedBonus ? new AdjustedBonus(adjustedBonus) : null;
  }
}
class AdjustedPremiumConfiguration {
  constructor({ _id, products = [] }) {
    this._id = _id;
    this.products = products.map((product) => new ProductConfiguration(product));
  }
}

module.exports = AdjustedPremiumConfiguration;
