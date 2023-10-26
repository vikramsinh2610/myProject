const Mongo = require('mongodb');
const ManagementFee = require('./management-fee');

const COLLECTION_NAME = 'management-fee';

/**
 * @param {Mongo.Db} mongodb
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 * @returns {Promise<Array<ManagementFee>>}
 */
function getByProductivePeriod(mongodb, productivePeriodYear, productivePeriodMonth) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ productivePeriodYear, productivePeriodMonth })
    .toArray()
    .then((results) => results.map((x) => new ManagementFee(x)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 */
function getByProductivePeriodAndInsurer(mongodb, productivePeriodYear, productivePeriodMonth) {
  return mongodb
    .collection(COLLECTION_NAME)
    .aggregate([
      {
        $match: { productivePeriodYear, productivePeriodMonth },
      },
      {
        $group: {
          _id: {
            insurerId: '$insurerId',
          },
          amount: { $sum: '$amount' },
        },
      },
    ])
    .toArray()
    .then((results) => results.map((r) => ({ insurerId: r._id.insurerId, amount: r.amount })));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 */
function getByProductivePeriodAndInsurerAndProduct(mongodb, productivePeriodYear, productivePeriodMonth) {
  return mongodb
    .collection(COLLECTION_NAME)
    .aggregate([
      {
        $match: { productivePeriodYear, productivePeriodMonth },
      },
      {
        $group: {
          _id: {
            insurerId: '$insurerId',
            productId: '$productId',
          },
          amount: { $sum: '$amount' },
        },
      },
      {
        $lookup: {
          from: `product-configuration`,
          localField: '_id.productId',
          foreignField: '_id',
          as: 'product-configuration',
        },
      },
    ])
    .toArray();
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<ManagementFee>} managementFees
 * @returns {Promise<Array<ManagementFee>>}
 */
function insertMany(mongodb, managementFees) {
  return mongodb
    .collection(COLLECTION_NAME)
    .insertMany(managementFees)
    .then(() => managementFees);
}

/**
 * @param {Mongo.Db} mongodb
 */
function createIndexes(mongodb) {
  return mongodb.collection(COLLECTION_NAME).createIndex({ _id: 1 });
}

module.exports = {
  getByProductivePeriod,
  getByProductivePeriodAndInsurer,
  getByProductivePeriodAndInsurerAndProduct,
  insertMany,
  createIndexes,
};
