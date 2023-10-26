const Mongo = require('mongodb');
const SheltiaCommissioningConfiguration = require('./sheltia-commissioning-configuration');
const { parse } = require('../../utils/productive-period-helper');

const COLLECTION_NAME = 'sheltia-commissioning-configuration';

/**
 * @param {Mongo.Db} mongodb
 * @param {string} roleId
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 * @returns {Promise<SheltiaCommissioningConfiguration>}
 */
function getByRoleIdAndProductivePeriod(mongodb, roleId, productivePeriodYear, productivePeriodMonth) {
  const productivePeriod = parse(productivePeriodYear, productivePeriodMonth);
  return mongodb
    .collection(COLLECTION_NAME)
    .find({
      _id: {
        $lte: `${roleId}-${productivePeriod}`,
      },
      roleId,
    })
    .sort({ _id: -1 })
    .limit(1)
    .toArray()
    .then((x) => {
      if (x.length === 0) return Promise.reject(new Error(`La configurazione del ruolo '${roleId}' non esiste`));
      return Promise.resolve(new SheltiaCommissioningConfiguration(x[0]));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {SheltiaCommissioningConfiguration} commissioningConfiguration
 * @returns {Promise<SheltiaCommissioningConfiguration>}
 */
function replace(mongodb, commissioningConfiguration) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne({ _id: commissioningConfiguration._id }, { $set: commissioningConfiguration }, { upsert: true })
    .then((result) => {
      if (!result.result.ok) return Promise.reject(new Error('Error updating configuration'));
      return Promise.resolve(commissioningConfiguration);
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<SheltiaCommissioningConfiguration>} seed
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
  getByRoleIdAndProductivePeriod,
  replace,
  insertSeed,
  createIndexes,
};
