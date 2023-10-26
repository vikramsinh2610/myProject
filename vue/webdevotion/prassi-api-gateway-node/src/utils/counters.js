const Mongo = require('mongodb');

const COLLECTION_NAME = 'counters';

/**
 * @param {Mongo.Db} mongodb
 * @param {string} name
 * @returns {Promise<number>}
 */
function next(mongodb, name) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOneAndUpdate({ _id: name }, { $inc: { value: 1 } }, { upsert: true, returnOriginal: false })
    .then((x) => (x.value && x.value.value ? x.value.value : 1));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} name
 * @param {number} value
 * @returns {Promise<number>}
 */
function set(mongodb, name, value) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOneAndUpdate({ _id: name }, { $set: { value } }, { upsert: true, returnOriginal: false })
    .then((x) => (x.value && x.value.value ? x.value.value : 1));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} name
 * @returns {Promise<number>}
 */
function preview(mongodb, name) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id: name })
    .then((x) => (x && x.value ? x.value + 1 : 1));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} name
 * @returns {Promise<number>}
 */
function current(mongodb, name) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id: name })
    .then((x) => (x && x.value ? x.value : 0));
}

/**
 * @param {Mongo.Db} mongodb
 * @returns {Promise<number>}
 */
function lastInvoiceCounter(mongodb) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ _id: { $regex: /EXPORT-INVOICES-ID-.*/, $options: 'si' } })
    .sort({ value: -1 })
    .toArray()
    .then((x) => (x && x.length > 0 && x[0].value ? x[0].value : 0));
}

/**
 * @param {Mongo.Db} mongodb
 * @returns {Promise<number>}
 */
function lastInvoiceCounterTCA(mongodb) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ _id: { $regex: /EXPORT-INVOICES-TCA-ID-.*/, $options: 'si' } })
    .sort({ value: -1 })
    .toArray()
    .then((x) => (x && x.length > 0 && x[0].value ? x[0].value : 0));
}

/**
 * @param {Mongo.Db} mongodb
 * @returns {Promise<number>}
 */
function previousInvoiceCounter(mongodb) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ _id: { $regex: /EXPORT-INVOICES-ID-.*/, $options: 'si' } })
    .sort({ value: -1 })
    .toArray()
    .then((x) => x && x.length > 1 && x[1].value ? x[1].value : 0);
}

/**
 * @param {Mongo.Db} mongodb
 * @returns {Promise<number>}
 */
function previousInvoiceCounterTCA(mongodb) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ _id: { $regex: /EXPORT-INVOICES-TCA-ID-.*/, $options: 'si' } })
    .sort({ value: -1 })
    .toArray()
    .then((x) => x && x.length > 1 && x[1].value ? x[1].value : 0);
}

module.exports = {
  next,
  preview,
  current,
  set,
  lastInvoiceCounter,
  previousInvoiceCounter,
  lastInvoiceCounterTCA,
  previousInvoiceCounterTCA,
};
