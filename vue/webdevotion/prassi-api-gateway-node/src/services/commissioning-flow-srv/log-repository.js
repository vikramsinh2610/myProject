const Mongo = require('mongodb');
const LogEvent = require('./log-event');

const COLLECTION_NAME = 'log-event';

/**
 * @param {Mongo.Db} mongodb
 * @param {LogEvent} event
 * @returns {Promise<LogEvent>}
 */
function insert(mongodb, event) {
  return mongodb
    .collection(COLLECTION_NAME)
    .insertOne(event)
    .then((x) => {
      if (!x.result.ok) return Promise.reject(new Error('Error inserting event'));
      return Promise.resolve(event);
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} eventId
 * @param {object} fields
 * @returns {Promise}
 */
function update(mongodb, eventId, fields) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne({ _id: eventId }, { $set: fields })
    .then((x) => {
      if (!x.result.ok) return Promise.reject(new Error('Error inserting event'));
      return Promise.resolve();
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} eventId
 * @returns {Promise<LogEvent>}
 */
function getById(mongodb, eventId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id: eventId })
    .then((x) => {
      if (!x) return Promise.reject(new Error('LogEvent not found'));
      return Promise.resolve(new LogEvent(x));
    });
}

module.exports = { insert, getById, update, };
