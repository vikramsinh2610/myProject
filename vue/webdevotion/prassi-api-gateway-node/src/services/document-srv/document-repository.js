const Mongo = require('mongodb');
const DocumentObject = require('./document');

const COLLECTION_NAME = 'document';

/**
 * @param {Mongo.Db} mongodb
 * @param {DocumentObject} doc
 * @returns {Promise<DocumentObject>}
 */
function insert(mongodb, doc) {
  return mongodb
    .collection(COLLECTION_NAME)
    .insert(doc)
    .then((result) => {
      if (!result.result.ok) return Promise.reject(new Error('Errore in inserimento documento'));
      return Promise.resolve(new DocumentObject(doc));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} documentId
 * @returns {Promise<DocumentObject>}
 */
function get(mongodb, documentId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id: documentId })
    .then((result) => {
      if (!result) return Promise.reject(new Error('Document does not exists'));
      return Promise.resolve(new DocumentObject(result));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} exportId
 * @returns {Promise<DocumentObject>}
 */
function getByExportId(mongodb, exportId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ 'additionalData.exportId': exportId })
    .then((result) => {
      if (!result) return Promise.reject(new Error('Document does not exists'));
      return Promise.resolve(new DocumentObject(result));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} documentId
 * @returns {Promise<DocumentObject>}
 */
function remove(mongodb, documentId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .deleteOne({ _id: documentId })
    .then((result, err) => {
      if (err) return Promise.reject(new Error('Document does not exists'));
      return Promise.resolve(result);
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} documentId
 * @param {object} fields
 */
function update(mongodb, documentId, fields) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne({ _id: documentId }, { $set: fields })
    .then((result) => {
      if (!result.result.ok) return Promise.reject(new Error('Error updating document'));
      return Promise.resolve();
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<DocumentObject>} seed
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

module.exports = { insert, get, getByExportId, insertSeed, createIndexes, remove, update };
