const Mongo = require('mongodb');
const Workflow = require('./workflow');

const COLLECTION_NAME = 'workflow';

/**
 * @param {Mongo.Db} mongodb
 * @param {string} id
 * @returns {Promise<Workflow>}
 */
function getById(mongodb, id) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id: id })
    .then((x) => {
      if (!x) return Promise.reject(new Error('Workflow non trovato'));
      return Promise.resolve(new Workflow(x));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} id
 * @returns {Promise<Workflow>}
 */
function getLastByEntityId(mongodb, id) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ entityId: id })
    .sort({ creationDate: -1 })
    .toArray()
    .then((x) => {
      if (!x || x.length === 0) return Promise.reject(new Error('Workflow non trovato'));
      return Promise.resolve(new Workflow(x[0]));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} filter
 * @param {number} skip
 * @param {number} count
 * @returns {Promise<Array<Workflow>>}
 */
function getAll(mongodb, filter, skip, count) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(filter)
    .skip(skip)
    .limit(count)
    .toArray()
    .then((results) => results.map((data) => new Workflow(data)));
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
  return Promise.all([
    mongodb.collection(COLLECTION_NAME).createIndex({ _id: 1 }),
    mongodb.collection(COLLECTION_NAME).createIndex({ creationDate: -1 }),
    mongodb.collection(COLLECTION_NAME).createIndex({ entityId: 1, creationDate: -1 }),
  ]);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Workflow} workflow
 * @returns {Promise<Workflow>}
 */
function replace(mongodb, workflow) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne({ _id: workflow._id }, { $set: workflow }, { upsert: true })
    .then((result) => {
      if (!result.result.ok) return Promise.reject(new Error('Error updating workflow'));
      return Promise.resolve(workflow);
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Workflow} workflow
 * @returns {Promise<Workflow>}
 */
function insert(mongodb, workflow) {
  return mongodb
    .collection(COLLECTION_NAME)
    .insertOne(workflow)
    .then((result) => {
      if (!result.result.ok) return Promise.reject(new Error('Error inserting workflow'));
      return Promise.resolve(workflow);
    });
}

module.exports = {
  getById,
  getAll,
  insertSeed,
  createIndexes,
  replace,
  insert,
  getLastByEntityId,
};
