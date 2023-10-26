const Mongo = require('mongodb');
const DossierInsurer = require('./dossier-insurer');

const COLLECTION_NAME = 'dossier-insurer';

/**
 * @param {Mongo.Db} mongodb
 * @param {DossierInsurer} dossierInsurer
 * @returns {Promise<DossierInsurer>}
 */
function insert(mongodb, dossierInsurer) {
  if (
    !Number.isInteger(Number.parseInt(dossierInsurer.productivePeriodYear, 10)) ||
    !Number.isInteger(Number.parseInt(dossierInsurer.productivePeriodMonth, 10))
  ) {
    throw new TypeError('not integer year / month');
  }
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne(
      {
        _id: dossierInsurer._id,
      },
      {
        $set: {
          ...dossierInsurer,
          productivePeriodYear: Number.parseInt(dossierInsurer.productivePeriodYear, 10),
          productivePeriodMonth: Number.parseInt(dossierInsurer.productivePeriodMonth, 10),
        },
      },
      { upsert: true },
    )
    .then(() => dossierInsurer)
    .catch(() => dossierInsurer);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} skip
 * @param {number} limit
 * @param {object} filter
 * @returns {Promise<Array<DossierInsurer>>}
 */
function getAll(mongodb, skip = 0, limit = 0, filter = {}) {
  let query = mongodb
    .collection(COLLECTION_NAME)
    .find(filter);

  query = skip ? query.skip(skip) : query;
  query = limit ? query.limit(limit) : query;

  return query.toArray().then((customers) => customers.map((customer) => new DossierInsurer(customer)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} promoterFilter
 * @returns {Promise<object>}
 */
function getIdsByPromoterFilter(mongodb, promoterFilter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ ...promoterFilter }, { projection: { dossierId: true } })
    .toArray()
    .then(async (result) => {
      if (!result) return Promise.resolve({});
      return { 'DatiBase.NumeroProposta': { $in: [...result.map((el) => el.dossierId)] } };
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} promoterFilter
 * @returns {Promise<object>}
 */
function getIdsAndPromoterByPromoterFilter(mongodb, promoterFilter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(
      { ...promoterFilter },
      {
        projection: {
          dossierId: true,
          promoterId: true,
          networkNodeId: true,
          productivePeriodMonth: true,
          productivePeriodYear: true,
        },
      },
    )
    .toArray()
    .then(async (result) => {
      if (!result) return Promise.resolve({});
      return result.map((el) => ({
        dossierId: el.dossierId,
        promoterId: el.promoterId,
        networkNodeId: el.networkNodeId,
        productivePeriodMonth: el.productivePeriodMonth,
        productivePeriodYear: el.productivePeriodYear,
      }));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} filter
 * @returns {Promise<object>}
 */
function getDossiersByFilter(mongodb, filter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $group: {
          _id: '$dossierId',
        },
      },
    ])
    .toArray()
    .then(async (result) => {
      if (!result) return Promise.resolve({});
      return result;
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} dossierInsurerId
 * @returns {Promise<DossierInsurer>}
 */
function get(mongodb, dossierInsurerId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id: dossierInsurerId })
    .then(async (result) => {
      if (!result) return Promise.reject(new Error('DossierInsurer does not exists'));
      return Promise.resolve(new DossierInsurer(result));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} dossierInsurerId
 * @returns {Promise<DossierInsurer>}
 */
function getLast(mongodb, dossierInsurerId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ dossierId: dossierInsurerId })
    .sort({ productivePeriodYear: -1, productivePeriodMonth: -1 })
    .limit(1)
    .toArray()
    .then(async (result) => {
      if (!result || !result[0]) return Promise.reject(new Error('DossierInsurer does not exists'));
      return Promise.resolve(new DossierInsurer(result[0]));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} dossierInsurerId
 * @returns {Promise<DossierInsurer>}
 */
function getFirst(mongodb, dossierInsurerId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ dossierId: dossierInsurerId })
    .sort({ productivePeriodYear: 1, productivePeriodMonth: 1 })
    .limit(1)
    .toArray()
    .then(async (result) => {
      if (!result || !result[0]) return Promise.reject(new Error('DossierInsurer does not exists'));
      return Promise.resolve(new DossierInsurer(result[0]));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} dossierInsurerId
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 * @returns {Promise<DossierInsurer>}
 */
function getLastBeforePeriod(mongodb, dossierInsurerId, productivePeriodYear, productivePeriodMonth) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({
      dossierId: dossierInsurerId,
      $or: [
        { productivePeriodYear: { $lte: productivePeriodYear } },
        {
          $and: [{ productivePeriodYear }, { productivePeriodMonth: { $lte: productivePeriodMonth } }],
        },
      ],
    })
    .sort({ productivePeriodYear: -1, productivePeriodMonth: -1 })
    .limit(1)
    .toArray()
    .then(async (result) => {
      if (!result || !result[0]) return Promise.reject(new Error('DossierInsurer does not exists'));
      return Promise.resolve(new DossierInsurer(result[0]));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} dossierInsurerId
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 * @returns {Promise<DossierInsurer>}
 */
async function getLastBeforePeriodOrFirst(mongodb, dossierInsurerId, productivePeriodYear, productivePeriodMonth) {
  try {
    // eslint-disable-next-line sonarjs/prefer-immediate-return
    const dossier = await getLastBeforePeriod(mongodb, dossierInsurerId, productivePeriodYear, productivePeriodMonth);

    return new DossierInsurer({
      dossierId: dossierInsurerId,
      productivePeriodYear,
      productivePeriodMonth,
      promoterId: dossier.promoterId,
      networkNodeId: dossier.networkNodeId,
    });
  } catch {
    const dossier = await getFirst(mongodb, dossierInsurerId);
    return new DossierInsurer({
      dossierId: dossierInsurerId,
      productivePeriodYear,
      productivePeriodMonth,
      promoterId: dossier.promoterId,
      networkNodeId: dossier.networkNodeId,
    });
  }
}

/**
 * @param {Mongo.Db} mongodb
 */
function createIndexes(mongodb) {
  return Promise.all([
    mongodb.collection(COLLECTION_NAME).createIndex({ _id: 1 }),
    mongodb.collection(COLLECTION_NAME).createIndex({ promoterId: 1 }),
    mongodb.collection(COLLECTION_NAME).createIndex({ productivePeriodYear: 1, productivePeriodMonth: 1 }),
  ]);
}

module.exports = {
  insert,
  get,
  getAll,
  getFirst,
  getLast,
  getLastBeforePeriod,
  getLastBeforePeriodOrFirst,
  createIndexes,
  getIdsByPromoterFilter,
  getIdsAndPromoterByPromoterFilter,
  getDossiersByFilter,
};
