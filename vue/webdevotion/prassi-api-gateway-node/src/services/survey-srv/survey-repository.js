const Mongo = require('mongodb');
const Survey = require('./survey');

const COLLECTION_NAME = 'survey';

/**
 * @param {Mongo.Db} mongodb
 * @param {string} id
 * @returns {Promise<Survey>}
 */
function getById(mongodb, id) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id: id })
    .then((x) => {
      if (!x) return Promise.reject(new Error('Questionario non trovato'));
      return Promise.resolve(new Survey(x));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} filter
 * @param {number} skip
 * @param {number} count
 * @returns {Promise<Array<Survey>>}
 */
function getAll(mongodb, filter, skip, count) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(filter)
    .skip(skip)
    .limit(count)
    .toArray()
    .then((results) => results.map((data) => new Survey(data)));
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
 * @param {Survey} survey
 * @returns {Promise<Survey>}
 */
function replace(mongodb, survey) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne({ _id: survey._id }, { $set: survey }, { upsert: true })
    .then((result) => {
      if (!result.result.ok) return Promise.reject(new Error('Error updating survey'));
      return Promise.resolve(survey);
    });
}

module.exports = {
  getById,
  getAll,
  insertSeed,
  createIndexes,
  replace,
};
