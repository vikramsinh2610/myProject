const Mongo = require('mongodb');
const { unparse } = require('uuid-parse');
const Company = require('./company');
const { uuidToBinary } = require("../../utils/uuid-to-binary");

const COLLECTION_NAME = 'CompanyConfiguration';

const PROJECTION = {
  _id: true,
  NomeCompagnia: true,
  CodiceCompagnia: true,
};

function mapCompany(data) {
  return new Company({
    _id: unparse(data._id.buffer),
    name: data.NomeCompagnia,
    code: data.CodiceCompagnia,
  });
}

/**
 * @param {Mongo.Db} mongodb
 * @returns {Promise<Array<Company>>}
 */
function getAll(mongodb) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({}, { projection: PROJECTION })
    .toArray()
    .then((results) => results.map((data) => mapCompany(data)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} companyId
 * @returns {Promise<Company>}
 */
function getById(mongodb, companyId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id: uuidToBinary(companyId) }, { projection: PROJECTION })
    .then((result) => {
      if (result) return Promise.resolve(mapCompany(result));
      return Promise.reject(new Error('Company not found'));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<Company>} seed
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
  mapCompany,
  getAll,
  getById,
  insertSeed,
  createIndexes,
};
