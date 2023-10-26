const Mongo = require('mongodb');
const Acquittance = require('./acquittance');
const { statuses } = require('./acquittance-statuses');

const COLLECTION_NAME = 'company-acquittance';

/**
 * @param {Mongo.Db} mongodb
 * @param {string} acquittanceId
 * @returns {Promise<Acquittance>}
 */
function get(mongodb, acquittanceId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id: acquittanceId })
    .then((acquittance) => {
      if (acquittance) return Promise.resolve(new Acquittance(acquittance));
      return Promise.reject(new Error('acquittance not found'));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} skip
 * @param {number} limit
 * @returns {Promise<Array<Acquittance>>}
 */
function getAll(mongodb, skip, limit) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ status: {$ne: statuses.DELETED} })
    .sort({ didCreatedDate: -1 })
    .skip(skip)
    .limit(limit)
    .toArray()
    .then((acquittances) => acquittances.map((acquittance) => new Acquittance(acquittance)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Acquittance} acquittance
 */
function insert(mongodb, acquittance) {
  return mongodb
    .collection(COLLECTION_NAME)
    .insertOne(acquittance)
    .then((result) => {
      if (result.result.ok) return Promise.resolve(acquittance);
      return Promise.reject(new Error('Error inserting acquittance'));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} acquittanceId
 * @param {object} fields
 */
function update(mongodb, acquittanceId, fields) {
  return mongodb.collection(COLLECTION_NAME).updateOne({ _id: acquittanceId }, { $set: fields });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<Acquittance>} seed
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

module.exports = { get, insert, getAll, update, insertSeed, createIndexes };
