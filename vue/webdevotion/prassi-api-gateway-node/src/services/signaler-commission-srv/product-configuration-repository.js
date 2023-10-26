const Mongo = require('mongodb');
const ProductConfiguration = require('./product-configuration');

const COLLECTION_NAME = 'signaler-product-configuration';

/**
 * @param {Mongo.Db} mongodb
 * @param {*} productId
 * @returns {Promise<ProductConfiguration>}
 */
function getByProductId(mongodb, productId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id: productId })
    .then((result) => {
      if (!result) {
        return Promise.reject(new Error(`La configurazione segnalatore del prodotto '${productId}' non esiste`));
      }
      return Promise.resolve(new ProductConfiguration(result));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {ProductConfiguration} productConfiguration
 * @returns {Promise<ProductConfiguration>}
 */
function replace(mongodb, productConfiguration) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne({ _id: productConfiguration._id }, { $set: productConfiguration }, { upsert: true })
    .then((result) => {
      if (!result.result.ok) return Promise.reject(new Error('Error updating product'));
      return Promise.resolve(productConfiguration);
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<ProductConfiguration>} seed
 */
function insertSeed(mongodb, seed) {
  return Promise.all(
    seed.map((s) => mongodb.collection(COLLECTION_NAME).replaceOne({ _id: s._id }, s, { upsert: true })),
  );
}

/**
 * @param {Mongo.Db} mongodb
 */
function createIndexes(mongodb) {
  return mongodb.collection(COLLECTION_NAME).createIndex({ _id: 1 });
}

module.exports = {
  getByProductId,
  replace,
  insertSeed,
  createIndexes,
};
