const Mongo = require('mongodb');
const AdjustedPremiumConfiguration = require('./adjusted-premium-configuration');

const COLLECTION_NAME = 'adjusted-premium-configuration';

/**
 * @param {Mongo.Db} mongodb
 * @param {string} id
 * @returns {Promise<AdjustedPremiumConfiguration>}
 */
function getById(mongodb, id) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id: id })
    .then((x) => {
      if (!x) return Promise.reject(new Error('Il periodo non è configurato'));
      return Promise.resolve(new AdjustedPremiumConfiguration(x));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<object>} seed
 * @returns {Promise<object>}
 */
function insertSeed(mongodb, seed) {
  return Promise.all(
    seed.map((s) => mongodb.collection(COLLECTION_NAME).replaceOne({ _id: s._id }, s, { upsert: true })),
  );
}

/**
 * @param {Mongo.Db} mongodb
 * @returns {Promise<object>}
 */
function createIndexes(mongodb) {
  return mongodb.collection(COLLECTION_NAME).createIndex({ _id: 1 });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {AdjustedPremiumConfiguration} adjustedPremiumConfiguration
 * @returns {Promise<AdjustedPremiumConfiguration>}
 */
function replace(mongodb, adjustedPremiumConfiguration) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne({ _id: adjustedPremiumConfiguration._id }, { $set: adjustedPremiumConfiguration }, { upsert: true })
    .then((result) => {
      if (!result.result.ok) return Promise.reject(new Error('Error updating configuration'));
      return Promise.resolve(adjustedPremiumConfiguration);
    });
}

module.exports = {
  getById,
  insertSeed,
  createIndexes,
  replace,
};
