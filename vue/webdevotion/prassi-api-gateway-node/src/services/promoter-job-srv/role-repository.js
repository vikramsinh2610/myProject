const Mongo = require('mongodb');

const COLLECTION_NAME = 'roles';

/**
 * @param {Mongo.Db} mongodb
 * @param {import('../promoter-job-srv/role-ids').Role} Role
 * @return {Promise<void>}
 */
function insert(mongodb, Role) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne({ networkId: Role.networkId }, { $set: Role }, { upsert: true })
    .then((x) => {
      if (!x.result.ok) return Promise.reject(new Error('Error inserting promoter job'));
      return Promise.resolve();
    });
}

// @ts-ignore
/**
 * @param {Mongo.Db} mongodb
 * @return {Promise<void>}
 * @param {object} Role
 */
function updateRole(mongodb, Role) {
  const roleId = Role._id;
  const updateRoleId = roleId.includes('-') ? roleId : new Mongo.ObjectId(roleId);
  return (
    mongodb
      .collection(COLLECTION_NAME)
      .updateOne(
        { _id: updateRoleId },
        { $set: Role },
        { upsert: true },
      )
      // @ts-ignore
      .then((x) => {
        if (!x.result.ok) return Promise.reject(new Error('Error inserting promoter job'));
        return Promise.resolve(Role);
      })
  );
}

// @ts-ignore
/**
 * @param {Mongo.Db} mongodb
 * @return {Promise<void>}
 * @param {object} Role
 */
function insertRole(mongodb, Role) {
  return (
    mongodb
      .collection(COLLECTION_NAME)
      .insertOne(Role)
      // @ts-ignore
      .then((x) => {
        if (!x.result.ok) return Promise.reject(new Error('Error inserting promoter job'));
        return Promise.resolve(Role);
      })
  );
}
/**
 * @param {Mongo.Db} mongodb
 * @param {string} networkId
 * @return {Promise<void>}
 */
function remove(mongodb, networkId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .deleteMany({ networkId })
    .then((result, err) => {
      if (err) return Promise.reject(new Error('Document does not exists'));
      return Promise.resolve();
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} roleId
 * @return {Promise<void>}
 */
function deleteRole(mongodb, roleId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .deleteOne({ _id: roleId })
    .then((result, err) => {
      if (err) return Promise.reject(new Error('Document does not exists'));
      return Promise.resolve(result);
    });
}

/**
 *
 * @param {Mongo.Db} mongodb
 * @param {string} networkId
 * @return {Promise<import('../promoter-job-srv/role-ids').Role>}
 */
function getOne(mongodb, networkId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ networkId })
    .then((x) => {
      if (!x) return Promise.reject(new Error(`Role not found: ${networkId}`));
      return Promise.resolve(x);
    });
}

/**
 *
 * @param {Mongo.Db} mongodb
 * @param {string} roleId
 * @return {Promise<import('../promoter-job-srv/role-ids').Role>}
 */
function getRoleById(mongodb, roleId) {
  const updateRoleId = roleId.includes('-') ? roleId : new Mongo.ObjectId(roleId);
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id: updateRoleId })
    .then((x) => {
      if (!x) return Promise.reject(new Error(`Role not found: ${roleId}`));
      return Promise.resolve(x);
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @return {Promise<Array<import('../promoter-job-srv/role-ids').Role>>}
 */
function getList(mongodb) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({})
    .sort({ authenticationId: 1 })
    .toArray()
    .then((x) => {
      if (!x) return Promise.reject(new Error(`Promoter jobs not found`));
      return Promise.resolve(x);
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @return {Promise<Array<import('../promoter-job-srv/role-ids').Role>>}
 * @param {number} skip
 * @param {object} filter
 */
function getRollList(mongodb, skip, filter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(filter)
    .sort({ authenticationId: 1 })
    .skip(skip)
    .limit(20)
    .toArray()
    .then((x) => {
      if (!x) return Promise.reject(new Error(`Promoter jobs not found`));
      return Promise.resolve(x);
    });
}
/**
 * @param {Mongo.Db} mongodb
 * @param {Array<import('../promoter-job-srv/role-ids').Role>} seed
 */
function insertSeed(mongodb, seed) {
  return Promise.all(
    seed.map((s) => mongodb.collection(COLLECTION_NAME).replaceOne({ networkId: s.networkId }, s, { upsert: true })),
  );
}

/**
 * @param {Mongo.Db} mongodb
 */
function createIndexes(mongodb) {
  return Promise.all([
    mongodb.collection(COLLECTION_NAME).createIndex({ _id: 1 }),
    mongodb.collection(COLLECTION_NAME).createIndex({ authenticationId: 1 }),
    mongodb.collection(COLLECTION_NAME).createIndex({ networkId: 1 }),
  ]);
}

module.exports = {
  insert,
  insertRole,
  updateRole,
  deleteRole,
  remove,
  getOne,
  getRoleById,
  getList,
  getRollList,
  insertSeed,
  createIndexes,
};
