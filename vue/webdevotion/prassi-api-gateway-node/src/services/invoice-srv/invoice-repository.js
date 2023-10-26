const Mongo = require('mongodb');
const Invoice = require('./invoice');
const counters = require('../../utils/counters');

const COLLECTION_NAME = 'invoice';

/**
 * @param {Mongo.Db} mongodb
 * @param {Invoice} invoice
 * @returns {Promise<Invoice>}
 */
function insert(mongodb, invoice) {
  return mongodb
    .collection(COLLECTION_NAME)
    .insert(invoice)
    .then((x) => {
      if (!x.result.ok) return Promise.reject(new Error('Error inserting invoices'));
      return Promise.resolve(invoice);
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} invoiceId
 * @param {object} fields
 * @returns {Promise}
 */
function update(mongodb, invoiceId, fields) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne({ _id: invoiceId }, { $set: fields })
    .then((x) => {
      if (!x.result.ok) return Promise.reject(new Error('Error inserting invoices'));
      return Promise.resolve();
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} promoterId
 * @param {number} year
 */
function getNumber(mongodb, promoterId, year) {
  return counters.next(mongodb, `INVOICE-ID-${promoterId}-${year}`).then((count) => `${count}/${year}`);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} promoterId
 * @param {number} year
 * @param {string} prefix
 */
function getNumberCustom(mongodb, promoterId, year, prefix) {
  return counters.next(mongodb, `INVOICE-ID-${prefix}-${promoterId}-${year}`).then((count) => `${count}/${year}`);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} promoterId
 * @param {number} year
 */
function getCurrentNumber(mongodb, promoterId, year) {
  return counters.current(mongodb, `INVOICE-ID-${promoterId}-${year}`).then((count) => `${count}/${year}`);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} promoterId
 * @param {number} year
 * @param {string} prefix
 */
function getCurrentNumberCustom(mongodb, promoterId, year, prefix) {
  return counters.current(mongodb, `INVOICE-ID-${prefix}-${promoterId}-${year}`).then((count) => `${count}/${year}`);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} promoterId
 * @param {number} year
 */
function getCurrentOrdinal(mongodb, promoterId, year) {
  return counters.current(mongodb, `INVOICE-ID-${promoterId}-${year}`).then((count) => count);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} promoterId
 * @param {number} year
 * @param {string} prefix
 */
function getCurrentOrdinalCustom(mongodb, promoterId, year, prefix) {
  return counters.current(mongodb, `INVOICE-ID-${prefix}-${promoterId}-${year}`).then((count) => count);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} promoterId
 * @param {number} year
 * @param {number} number
 */
function setNumber(mongodb, promoterId, year, number) {
  return counters.set(mongodb, `INVOICE-ID-${promoterId}-${year}`, number).then((count) => `${count}/${year}`);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} promoterId
 * @param {number} year
 * @param {number} number
 * @param {string} prefix
 */
function setNumberCustom(mongodb, promoterId, year, number, prefix) {
  return counters
    .set(mongodb, `INVOICE-ID-${prefix}-${promoterId}-${year}`, number)
    .then((count) => `${count}/${year}`);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} promoterId
 * @param {number} year
 */
function getPreviewNumber(mongodb, promoterId, year) {
  return counters.preview(mongodb, `INVOICE-ID-${promoterId}-${year}`).then((count) => `${count}/${year}`);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} promoterId
 * @param {number} year
 * @param {string} prefix
 */
function getPreviewNumberCustom(mongodb, promoterId, year, prefix) {
  return counters.preview(mongodb, `INVOICE-ID-${prefix}-${promoterId}-${year}`).then((count) => `${count}/${year}`);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} invoiceId
 * @returns {Promise<Invoice>}
 */
function getById(mongodb, invoiceId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id: invoiceId })
    .then((x) => {
      if (!x) return Promise.reject(new Error('Invoice not found'));
      return Promise.resolve(new Invoice(x));
    });
}

function getAll(mongodb, skip = 0, limit = 0, filter = {}) {
  let query = mongodb.collection(COLLECTION_NAME).find(filter).sort({ issueDate: 1 });

  query = skip ? query.skip(skip) : query;
  query = limit ? query.limit(limit) : query;

  return query.toArray();
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} invoiceId
 */
function deleteById(mongodb, invoiceId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .deleteOne({ _id: invoiceId, issued: false })
    .then((x) => {
      if (!x) return Promise.reject(new Error('Error deleting Invoice'));
      return Promise.resolve({ _id: invoiceId });
    });
}

/**
 *
 * @param {Mongo.Db} mongodb
 * @param {string} productivePeriodYear
 * @param {string} productivePeriodMonth
 */
function deleteManyCommissioning(mongodb, productivePeriodYear, productivePeriodMonth) {
  return mongodb
    .collection(COLLECTION_NAME)
    .deleteMany({ commissioning: true, productivePeriodYear, productivePeriodMonth, issued: false })
    .then((x) => {
      if (!x.result.ok) return Promise.reject(new Error('Error deleting invoicing of a commissioning period'));
      return Promise.resolve({ commissioning: true });
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} productivePeriodYear
 * @param {string} productivePeriodMonth
 * @returns {Promise<Array<Invoice>>}
 */
function getByCommissioning(mongodb, productivePeriodYear, productivePeriodMonth) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ commissioning: true, productivePeriodYear, productivePeriodMonth })
    .toArray()
    .then((x) => {
      if (!x) return Promise.resolve([]);
      return Promise.resolve(x.map((i) => new Invoice(i)));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<string>} invoiceIds
 * @returns {Promise<Array<Invoice>>}
 */
function getByIds(mongodb, invoiceIds) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ _id: { $in: invoiceIds } })
    .toArray()
    .then((x) => {
      if (!x) return Promise.reject(new Error('Invoices not found'));
      return Promise.resolve(x.map((i) => new Invoice(i)));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<Invoice>} seed
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
  getNumber,
  getNumberCustom,
  getCurrentNumber,
  getCurrentNumberCustom,
  getCurrentOrdinal,
  getCurrentOrdinalCustom,
  setNumber,
  setNumberCustom,
  getPreviewNumber,
  getPreviewNumberCustom,
  insert,
  getById,
  deleteById,
  update,
  getByIds,
  getAll,
  insertSeed,
  createIndexes,
  deleteManyCommissioning,
  getByCommissioning,
};
