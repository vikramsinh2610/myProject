const Mongo = require('mongodb');
const { unparse } = require('uuid-parse');
const Product = require('./product');
const { uuidToBinary } = require("../../utils/uuid-to-binary");

const COLLECTION_NAME = 'Product';

const PROJECTION = {
  _id: true,
  Title: true,
  'AnagraficaProdotto.CodiceProdotto': true,
};

function mapProduct(data) {
  return new Product({
    _id: unparse(data._id.buffer),
    name: data.Title,
    code: data.AnagraficaProdotto.CodiceProdotto,
  });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} filter
 * @returns {Promise<Array<Product>>}
 */
function getAll(mongodb, filter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(filter, { projection: PROJECTION })
    .toArray()
    .then((results) => results.map((data) => mapProduct(data)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} productId
 * @returns {Promise<Product>}
 */
function getById(mongodb, productId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id: uuidToBinary(productId) }, { projection: PROJECTION })
    .then((result) => {
      if (result) return Promise.resolve(mapProduct(result));
      return Promise.reject(new Error('Product not found'));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<Product>} seed
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
  mapProduct,
  getAll,
  getById,
  insertSeed,
  createIndexes,
};
