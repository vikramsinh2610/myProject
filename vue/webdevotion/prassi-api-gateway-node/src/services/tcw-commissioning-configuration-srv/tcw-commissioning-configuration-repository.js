const Mongo = require('mongodb');
const TcwCommissioningConfiguration = require('./tcw-commissioning-configuration');
const TcwCommissioningConfigurationDynamic = require('./tcw-commissioning-configuration-dynamic');

const COLLECTION_NAME = 'tcw-commissioning-configuration';
const COLLECTION_NAME_DYNAMIC = 'tcw-commissioning-configuration-dynamic';

/**
 * @param {Mongo.Db} mongodb
 * @param {string} roleId
 */
function getLastByRole(mongodb, roleId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ roleId })
    .sort({ creationDate: -1 })
    .next()
    .then((config) => {
      if (config) return new TcwCommissioningConfiguration(config);
      throw Promise.reject(new Error(`Configuration does not exist for role ${roleId}`));
    });
}

/**
 * @param {Mongo.Db} mongodb
 */
function getLast(mongodb) {
  return mongodb
    .collection(COLLECTION_NAME_DYNAMIC)
    .find({})
    .sort({ _id: -1 })
    .next()
    .then((config) => {
      if (config) return new TcwCommissioningConfigurationDynamic(config);
      throw Promise.reject(new Error(`Configuration does not exist`));
    });
}

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
 * @param {Array<TcwCommissioningConfiguration>} seed
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
  return Promise.resolve(mongodb);
}

module.exports = { getLastByRole, getLast, replace, insertSeed, createIndexes };
