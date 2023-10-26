const Mongo = require('mongodb');
const PromoterJob = require('./promoter-job');
const { parse } = require("../../utils/productive-period-helper");

const COLLECTION_NAME = 'promoter-job';

/**
 * @param {Mongo.Db} mongodb
 * @param {PromoterJob} promoterJob
 * @returns {Promise<PromoterJob>}
 */
function insert(mongodb, promoterJob) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne({ _id: promoterJob._id }, { $set: promoterJob }, { upsert: true })
    .then((x) => {
      if (!x.result.ok) return Promise.reject(new Error('Error inserting promoter job'));
      return Promise.resolve(promoterJob);
    });
}

function remove(mongodb, promoterId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .deleteMany({ promoterId })
    .then((result, err) => {
      if (err) return Promise.reject(new Error('Document does not exists'));
      return Promise.resolve(result);
    });
}

/**
 *
 * @param {Mongo.Db} mongodb
 * @param {string} promoterId
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 */
function get(mongodb, promoterId, productivePeriodYear, productivePeriodMonth) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({
      _id: {
        $lte: `${promoterId}-${parse(productivePeriodYear, productivePeriodMonth)}`,
      },
      promoterId,
    })
    .sort({ _id: -1 })
    .limit(1)
    .toArray()
    .then((x) => {
      if (x.length === 0) return Promise.reject(new Error(`Promoter job not found: ${promoterId}`));
      return Promise.resolve(new PromoterJob(x[0]));
    });
}

/**
 *
 * @param {Mongo.Db} mongodb
 * @param {string} promoterId
 */
function getOne(mongodb, promoterId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({
      promoterId,
    })
    .then((x) => {
      if (!x) return Promise.reject(new Error(`Promoter job not found: ${promoterId}`));
      return Promise.resolve(new PromoterJob(x));
    });
}

function getList(mongodb, promoterId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ promoterId })
    .sort({ _id: 1 })
    .toArray()
    .then((x) => {
      if (!x) return Promise.reject(new Error(`Promoter jobs not found: ${promoterId}`));
      return Promise.resolve(x);
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<PromoterJob>} seed
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
  return Promise.all([
    mongodb.collection(COLLECTION_NAME).createIndex({ _id: 1 }),
    mongodb.collection(COLLECTION_NAME).createIndex({ _id: 1, promoterId: 1 }),
  ]);
}

module.exports = {
  insert,
  remove,
  get,
  getOne,
  getList,
  insertSeed,
  createIndexes,
};
