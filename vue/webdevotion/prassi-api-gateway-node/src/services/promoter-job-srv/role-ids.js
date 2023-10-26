const Mongo = require('mongodb');
const { v4: uuid } = require('uuid');
const roleRepository = require('./role-repository');

/**
 * @typedef {object} Role
 * @property {number} authenticationId
 * @property {string} authenticationName
 * @property {string} networkId
 * @property {string} name
 * @property {string} color
 * @property {string} shortName
 * @property {string} area
 */

/**
 * @typedef {object} AuthRole
 * @property {string} value
 * @property {number} key
 */

const NONE = 'none';
const BASIC = 'promoter';
const SIGNALLER = 'signaller';

/**
 * @param {Mongo.Db} mongodb
 * @param {string} origin
 * @returns {Promise<string>}
 */
async function translateRoleId(mongodb, origin) {
  if (origin === NONE) {
    return 'Nessuno';
  }

  try {
    const role = await roleRepository.getOne(mongodb, origin);
    return role.name;
  } catch {
    return 'Non esistente';
  }
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} roleId
 * @returns {Promise<AuthRole>}
 */
async function mapNetworkToAuthRole(mongodb, roleId) {
  const role = await roleRepository.getOne(mongodb, roleId);
  return {
    value: role.authenticationName,
    key: role.authenticationId,
  };
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} roleId
 */
async function getRole(mongodb, roleId) {
  return roleRepository.getRoleById(mongodb, roleId);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} role
 */
async function insertRoleIds(mongodb, role) {
  role._id = uuid();
  // role._id = 'abcdefgh123456ok';
  return roleRepository.insertRole(mongodb, role);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} role
 */
async function updateRoleIds(mongodb, role) {
  return roleRepository.updateRole(mongodb, role);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} roleId
 */
async function deleteRoleIds(mongodb, roleId) {
  return roleRepository.deleteRole(mongodb, roleId);
}

/**
 * @param {Mongo.Db} mongodb
 * @returns {Promise<Array<Role>>}
 */
async function getRoleIds(mongodb) {
  return roleRepository.getList(mongodb);
}


/**
 * @param {Mongo.Db} mongodb
 * @returns {Promise<Array<Role>>}
 * @param {number} skip
 * @param {object} filter
 */
 async function getAllRoleIds(mongodb, skip, filter) {
  return roleRepository.getRollList(mongodb, skip , filter);
}

module.exports = {
  NONE,
  BASIC,
  SIGNALLER,
  getRoleIds,
  getAllRoleIds,
  getRole,
  insertRoleIds,
  updateRoleIds,
  deleteRoleIds,
  translateRoleId,
  mapNetworkToAuthRole,
};
