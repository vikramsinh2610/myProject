const Product = require('./product');
const productRepository = require('./product-repository');
const { seed } = require('./seed/product');

class ProductService {
  constructor(mongodb) {
    this.mongodb = mongodb;
  }

  /**
   * @param {object} filter
   * @returns {Promise<Array<Product>>}
   */
  getProducts(filter) {
    return productRepository.getAll(this.mongodb, filter);
  }

  /**
   * @param {string} productId
   * @returns {Promise<Product>}
   */
  getProduct(productId) {
    return productRepository.getById(this.mongodb, productId);
  }

  insertSeed() {
    return productRepository.insertSeed(this.mongodb, seed);
  }

  createIndexes() {
    return productRepository.createIndexes(this.mongodb);
  }
}

module.exports = ProductService;
