const Mongo = require('mongodb');
const Question = require('./question');

const COLLECTION_NAME = 'survey-question';

/**
 * @param {Mongo.Db} mongodb
 * @param {string} id
 * @returns {Promise<Question>}
 */
function getById(mongodb, id) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id: id })
    .then((x) => {
      if (!x) return Promise.reject(new Error('Domanda non trovata'));
      return Promise.resolve(new Question(x));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} filter
 * @param {number} skip
 * @param {number} count
 * @returns {Promise<Array<Question>>}
 */
function getAll(mongodb, filter, skip, count) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(filter)
    .skip(skip)
    .limit(count)
    .toArray()
    .then((results) => results.map((data) => new Question(data)));
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
 * @param {Question} question
 * @returns {Promise<Question>}
 */
function replace(mongodb, question) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne({ _id: question._id }, { $set: question }, { upsert: true })
    .then((result) => {
      if (!result.result.ok) return Promise.reject(new Error('Error updating question'));
      return Promise.resolve(question);
    });
}

module.exports = {
  getById,
  getAll,
  insertSeed,
  createIndexes,
  replace,
};
