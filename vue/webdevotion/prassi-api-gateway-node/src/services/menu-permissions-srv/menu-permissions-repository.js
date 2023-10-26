const Mongo = require('mongodb');
const MenuPermissionsConfiguration = require('./menu-permissions-configuration');

const COLLECTION_NAME = 'menu-permissions';

/**
 * @param {Mongo.Db} mongodb
 * @param {string} id
 * @returns {Promise<MenuPermissionsConfiguration>}
 */
function getById(mongodb, id) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id: id })
    .then((x) => {
      if (!x) return Promise.reject(new Error('Menu permission non trovato'));
      return Promise.resolve(new MenuPermissionsConfiguration(x));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<object>} seed
 * @returns {Promise<object>}
 */
function insertSeed(mongodb, seed) {
  return Promise.all(
    seed.map((s) => mongodb.collection(COLLECTION_NAME).replaceOne({ _id: s._id }, s, { upsert: true })),
  );
}

/**
 * @param {Mongo.Db} mongodb
 * @returns {Promise<object>}
 */
function createIndexes(mongodb) {
  return mongodb.collection(COLLECTION_NAME).createIndex({ _id: 1 });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {MenuPermissionsConfiguration} menuPermissionsConfiguration
 * @returns {Promise<MenuPermissionsConfiguration>}
 */
function replace(mongodb, menuPermissionsConfiguration) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne(
      { roleId: menuPermissionsConfiguration.roleId, menuId: menuPermissionsConfiguration.menuId },
      { $set: menuPermissionsConfiguration },
      { upsert: true },
    )
    .then((result) => {
      if (!result.result.ok) return Promise.reject(new Error('Error updating configuration'));
      return Promise.resolve(menuPermissionsConfiguration);
    });
}

module.exports = {
  getById,
  insertSeed,
  createIndexes,
  replace,
};
