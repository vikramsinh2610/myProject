const Mongo = require('mongodb');
const CustomerInsurer = require('./customer-insurer');

const COLLECTION_NAME = 'customer-insurer';

/**
 * @param {Mongo.Db} mongodb
 * @param {CustomerInsurer} customerInsurer
 * @returns {Promise<CustomerInsurer>}
 */
function insert(mongodb, customerInsurer) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne({ _id: customerInsurer._id }, { $set: customerInsurer }, { upsert: true })
    .then(() => customerInsurer)
    .catch(() => customerInsurer);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} skip
 * @param {number} limit
 * @param {object} filter
 * @returns {Promise<Array<CustomerInsurer>>}
 */
function getAll(mongodb, skip = 0, limit = 0, filter = {}) {
  let query = mongodb
    .collection(COLLECTION_NAME)
    .find(filter);

  query = skip ? query.skip(skip) : query;
  query = limit ? query.limit(limit) : query;

  return query.toArray().then((customers) => customers.map((customer) => new CustomerInsurer(customer)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} promoterFilter
 * @returns {Promise<object>}
 */
function getIdsByPromoterFilter(mongodb, promoterFilter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ ...promoterFilter }, { projection: { customerId: true } })
    .toArray()
    .then(async (result) => {
      if (!result) return Promise.resolve({});
      return { 'DatiBase.ClienteIdentifier': { $in: [...result.map((el) => el.customerId)] } };
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} customerId
 * @returns {Promise<Array>}
 */
function getListByCustomerId(mongodb, customerId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ customerId })
    .toArray()
    .then(async (result) => {
      if (!result) return Promise.resolve([]);
      return result;
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
    .find({ ...promoterFilter }, { projection: { customerId: true, promoterId: true } })
    .sort({ productivePeriodYear: -1, productivePeriodMonth: -1 })
    .toArray()
    .then(async (result) => {
      if (!result) return Promise.resolve({});
      return result.map((el) => ({ customerId: el.customerId, promoterId: el.promoterId }));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} filter
 * @returns {Promise<object>}
 */
function getCustomersByFilter(mongodb, filter) {
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
          _id: '$customerId',
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
 * @param {string} customerInsurerId
 * @returns {Promise<CustomerInsurer>}
 */
function get(mongodb, customerInsurerId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id: customerInsurerId })
    .then(async (result) => {
      if (!result) return Promise.reject(new Error('CustomerInsurer does not exists'));
      return Promise.resolve(new CustomerInsurer(result));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} customerInsurerId
 * @returns {Promise<CustomerInsurer>}
 */
function getLast(mongodb, customerInsurerId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ customerId: customerInsurerId })
    .sort({ productivePeriodYear: -1, productivePeriodMonth: -1 })
    .limit(1)
    .toArray()
    .then(async (result) => {
      if (!result || !result[0]) return Promise.reject(new Error('CustomerInsurer does not exists'));
      return Promise.resolve(new CustomerInsurer(result[0]));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} customerInsurerId
 * @returns {Promise<CustomerInsurer>}
 */
function getFirst(mongodb, customerInsurerId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ customerId: customerInsurerId })
    .sort({ productivePeriodYear: 1, productivePeriodMonth: 1 })
    .limit(1)
    .toArray()
    .then(async (result) => {
      if (!result || !result[0])
        return Promise.reject(new Error(`CustomerInsurer does not exists: ${customerInsurerId}`));
      return Promise.resolve(new CustomerInsurer(result[0]));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} customerInsurerId
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 * @returns {Promise<CustomerInsurer>}
 */
function getLastBeforePeriod(mongodb, customerInsurerId, productivePeriodYear, productivePeriodMonth) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({
      customerId: customerInsurerId,
      $and: [
        { productivePeriodYear: { $lte: productivePeriodYear } },
        {
          $or: [
            { productivePeriodMonth: { $lte: productivePeriodMonth } },
            { productivePeriodYear: { $lt: productivePeriodYear } },
          ],
        },
      ],
    })
    .sort({ productivePeriodYear: -1, productivePeriodMonth: -1 })
    .limit(1)
    .toArray()
    // eslint-disable-next-line sonarjs/no-identical-functions
    .then(async (result) => {
      if (!result || !result[0])
        return Promise.reject(new Error(`CustomerInsurer does not exists: ${customerInsurerId}`));
      return Promise.resolve(new CustomerInsurer(result[0]));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} customerInsurerId
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 * @returns {Promise<boolean>}
 */
async function existLastBeforePeriod(mongodb, customerInsurerId, productivePeriodYear, productivePeriodMonth) {
  try {
    await getLastBeforePeriod(mongodb, customerInsurerId, productivePeriodYear, productivePeriodMonth);
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} customerInsurerId
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 * @returns {Promise<CustomerInsurer>}
 */
async function getLastBeforePeriodOrFirst(mongodb, customerInsurerId, productivePeriodYear, productivePeriodMonth) {
  try {
    // eslint-disable-next-line sonarjs/prefer-immediate-return
    const customer = await getLastBeforePeriod(mongodb, customerInsurerId, productivePeriodYear, productivePeriodMonth);

    return new CustomerInsurer({
      customerId: customerInsurerId,
      productivePeriodYear,
      productivePeriodMonth,
      promoterId: customer.promoterId,
      networkNodeId: customer.networkNodeId,
    });
  } catch {
    const customer = await getFirst(mongodb, customerInsurerId);
    return new CustomerInsurer({
      customerId: customerInsurerId,
      productivePeriodYear,
      productivePeriodMonth,
      promoterId: customer.promoterId,
      networkNodeId: customer.networkNodeId,
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
  existLastBeforePeriod,
  getLastBeforePeriod,
  getLastBeforePeriodOrFirst,
  createIndexes,
  getIdsByPromoterFilter,
  getIdsAndPromoterByPromoterFilter,
  getCustomersByFilter,
  getListByCustomerId,
};
