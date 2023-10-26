const Mongo = require('mongodb');
const InvoicingState = require('./invoicing-state');

const COLLECTION_NAME = 'invoicing';

/**
 * @param {Mongo.Db} mongodb
 * @param {string} id
 * @returns {Promise<boolean>}
 */
function exists(mongodb, id) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ _id: id })
    .count()
    .then((x) => x === 1);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} id
 * @returns {Promise<InvoicingState>}
 */
function getById(mongodb, id) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id: id })
    .then((x) => {
      if (!x) return Promise.reject(new Error('Invoicing non trovato'));
      return Promise.resolve(new InvoicingState(x));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {InvoicingState} state
 */
function update(mongodb, state) {
  const { _id } = state;
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne({ _id }, { $set: state }, { upsert: true })
    .then((result) => {
      if (!result.result.ok) return Promise.reject(new Error('Aggiornamento fallito'));
      return Promise.resolve(state);
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<InvoicingState>} seed
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
  exists,
  getById,
  update,
  insertSeed,
  createIndexes,
};
