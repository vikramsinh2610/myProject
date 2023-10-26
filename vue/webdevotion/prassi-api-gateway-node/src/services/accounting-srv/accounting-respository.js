const Mongo = require('mongodb');
const AccountingNote = require('./accounting-note');

const COLLECTION_NAME = 'accounting';

/**
 * @param {Mongo.Db} mongodb
 * @param {string} _id
 */
function getAccountingNote(mongodb, _id) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id })
    .then((x) => {
      if (!x) return Promise.reject(new Error(`Nota non trovata ${_id}`));
      return Promise.resolve(new AccountingNote(x));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} promoterId
 */
function getUnsettledAccountingNotes(mongodb, promoterId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ promoterId, settled: false, invoiceId: null })
    .sort({ productivePeriodYear: -1, productivePeriodMonth: -1 })
    .toArray()
    .then((results) => results.map((x) => new AccountingNote(x)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} filter
 */
function getAccountingNotes(mongodb, filter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(filter)
    .sort({ productivePeriodYear: -1, productivePeriodMonth: -1 })
    .toArray()
    .then((results) => results.map((x) => new AccountingNote(x)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 */
function getUnsettledWelcomeAccountingNotes(mongodb, productivePeriodYear, productivePeriodMonth) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({
      origin: 'conditioned+welcome-bonus+prepayment',
      settled: false,
      invoiceId: null,
      productivePeriodYear,
      productivePeriodMonth,
    })
    .toArray()
    .then((results) => results.map((x) => new AccountingNote(x)));
}

/**
 *
 * @param {Mongo.Db} mongodb
 * @param {AccountingNote} accountingNote
 */
function upsert(mongodb, accountingNote) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne({ _id: accountingNote._id }, { $set: accountingNote }, { upsert: true })
    .then((x) => {
      if (!x.result.ok) return Promise.reject(new Error('Error upserting accounting note'));
      if (!x.result.ok) return Promise.reject(new Error(`Impossibile aggiornare Nota ${accountingNote._id}`));
      return Promise.resolve(accountingNote);
    });
}

/**
 *
 * @param {Mongo.Db} mongodb
 * @param {string} id
 */
function deleteOne(mongodb, id) {
  return mongodb
    .collection(COLLECTION_NAME)
    .deleteOne({ _id: id })
    .then((x) => {
      if (!x.result.ok) return Promise.reject(new Error('Error deleting accounting note'));
      return Promise.resolve({ _id: id });
    });
}

/**
 *
 * @param {Mongo.Db} mongodb
 * @param {string} id
 */
function deleteManyCommissioning(mongodb, id) {
  return mongodb
    .collection(COLLECTION_NAME)
    .deleteMany({ commissioningId: id, settled: false })
    .then((x) => {
      if (!x.result.ok) return Promise.reject(new Error('Error deleting accounting note of a commissioning period'));
      return Promise.resolve({ commissioningId: id });
    });
}

/**
 *
 * @param {Mongo.Db} mongodb
 * @param {string} id
 */
function deleteManyInvoicing(mongodb, id) {
  return mongodb
    .collection(COLLECTION_NAME)
    .deleteMany({ invoicingId: id, settled: false })
    .then((x) => {
      if (!x.result.ok) return Promise.reject(new Error('Error deleting accounting note of a invoicing period'));
      return Promise.resolve({ invoicingId: id });
    });
}

/**
 *
 * @param {Mongo.Db} mongodb
 * @param {string} id
 */
function resetManyCommissioning(mongodb, id) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateMany({ commissioningId: id, settled: false }, { $set: { invoiceId: null } })
    .then((x) => {
      if (!x.result.ok) return Promise.reject(new Error('Error updating accounting notes'));
      return Promise.resolve();
    });
}

module.exports = {
  getAccountingNote,
  getAccountingNotes,
  getUnsettledAccountingNotes,
  getUnsettledWelcomeAccountingNotes,
  upsert,
  deleteOne,
  deleteManyInvoicing,
  deleteManyCommissioning,
  resetManyCommissioning,
};
