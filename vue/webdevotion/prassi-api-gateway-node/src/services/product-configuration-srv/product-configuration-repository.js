const Mongo = require('mongodb');

const ProductConfiguration = require('./product-configuration');
const Option = require('./option');

const COLLECTION_NAME = 'product-configuration';

/**
 * @param {Mongo.Db} mongodb
 * @param {number} skip
 * @param {number} limit
 * @returns {Promise<Array<ProductConfiguration>>}
 */
function getAll(mongodb, skip, limit) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({})
    .skip(skip)
    .limit(limit)
    .toArray()
    .then((products) =>
      products.map(
        (product) =>
          new ProductConfiguration({
            ...product,
            options: product.options.map((o) => new Option(o)),
          }),
      ),
    );
}

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
        return Promise.reject(new Error(`La configurazione del prodotto '${productId}' non esiste`));
      }
      return Promise.resolve(
        new ProductConfiguration({
          ...result,
          options: result.options.map((o) => new Option(o)),
        }),
      );
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
 * @param {ProductConfiguration} productConfiguration
 * @returns {Promise<ProductConfiguration>}
 */
function insert(mongodb, productConfiguration) {
  return mongodb
    .collection(COLLECTION_NAME)
    .insertOne(productConfiguration)
    .then((result) => {
      if (!result.result.ok) return Promise.reject(new Error('Impossibile inserire il prodotto'));
      return Promise.resolve(productConfiguration);
    })
    .catch((error) => Promise.reject(error));
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
  getAll,
  getByProductId,
  replace,
  insert,
  insertSeed,
  createIndexes,
};
