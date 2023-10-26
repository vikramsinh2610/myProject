const Mongo = require('mongodb');
const Debit = require('./debit');

const COLLECTION_NAME = 'promoter-debit';

/**
 * @param {Mongo.Db} mongodb
 * @param {*} promoterId
 * @returns {Promise<Debit|undefined>}
 */
function getFirstUnsettled(mongodb, promoterId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ promoterId, settled: false })
    .sort({ createDate: 1 })
    .limit(1)
    .toArray()
    .then((debits) => {
      if (debits.length === 0) return;
      // eslint-disable-next-line consistent-return
      return new Debit(debits[0]);
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Debit} debit
 */
function upsert(mongodb, debit) {
  return mongodb
    .collection(COLLECTION_NAME)
    .update({ _id: debit._id }, { $set: debit }, { upsert: true })
    .then((result) => {
      if (!result.result.ok) return Promise.reject(new Error('Error inserting debit'));
      return Promise.resolve(debit);
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<Debit>} seed
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

module.exports = { insertSeed, createIndexes, getFirstUnsettled, upsert };
