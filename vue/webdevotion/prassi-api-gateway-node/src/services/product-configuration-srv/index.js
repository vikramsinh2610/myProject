const ProductConfiguration = require('./product-configuration');
const configurationRepository = require('./product-configuration-repository');
const { seed: tcwSeed } = require('./seed/tcw');
const { seed: sheltiaSeed } = require('./seed/sheltia');

class ProductConfigurationService {
  constructor(mongodb) {
    this.mongodb = mongodb;
  }

  /**
   * @param {number} skip
   * @param {number} limit
   * @returns {Promise<Array<ProductConfiguration>>}
   */
  getAll(skip = 0, limit = 0) {
    return configurationRepository.getAll(this.mongodb, skip, limit);
  }

  /**
   * @param {string} productId
   * @returns {Promise<ProductConfiguration>}
   */
  getByProductId(productId) {
    return configurationRepository.getByProductId(this.mongodb, productId);
  }

  /**
   * @param {ProductConfiguration} productConfiguration
   * @returns {Promise<ProductConfiguration>}
   */
  addProductConfiguration(productConfiguration) {
    return configurationRepository.replace(this.mongodb, productConfiguration);
  }

  addSignalerProductConfiguration(productConfiguration) {
    return this.mongodb
    .collection('signaler-product-configuration')
    .updateOne({ _id: productConfiguration._id }, { $set: productConfiguration }, { upsert: true })
    .then((result) => {
      if (!result.result.ok) return Promise.reject(new Error('Error updating product'));
      return Promise.resolve(productConfiguration);
    });
  }

  /**
   * @param {ProductConfiguration} productConfiguration
   * @returns {Promise<ProductConfiguration>}
   */
  insertProductConfiguration(productConfiguration) {
    return configurationRepository.insert(this.mongodb, productConfiguration);
  }

  insertSeed(edition) {
    const seed = edition === 'tcw' ? tcwSeed : sheltiaSeed;
    return configurationRepository.insertSeed(this.mongodb, seed);
  }

  createIndexes() {
    return configurationRepository.createIndexes(this.mongodb);
  }
}

module.exports = ProductConfigurationService;
