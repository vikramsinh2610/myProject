const Mongo = require('mongodb');
const SheltiaPromoterTarget = require('./sheltia-promoter-target');
const { parse } = require('../../utils/productive-period-helper');
const { uuidToBinary } = require('../../utils/uuid-to-binary');

const COLLECTION_NAME = 'sheltia-promoter-target';

/**
 * @param {Mongo.Db} mongodb
 * @param {string} promoterId
 * @param {number} year
 * @returns {Promise<Array<SheltiaPromoterTarget>>}
 */
function getByPromoterIdAndYear(mongodb, promoterId, year) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ promoterId, productivePeriodYear: Number(year) })
    .toArray()
    .then((targets) => {
      const values = [];
      for (let i = 1; i <= 12; i += 1) {
        const found = targets.find((el) => el.productivePeriodMonth === i);
        if (found) {
          values.push(found);
        } else {
          values.push(
            new SheltiaPromoterTarget({
              _id: undefined,
              promoterId,
              targetIv: 0,
              productivePeriodYear: year,
              productivePeriodMonth: i,
              productivePeriod: Number(`${year}${i.toString().padStart(2, '0')}`),
            }),
          );
        }
      }
      return values;
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} promoterId
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 * @returns {Promise<SheltiaPromoterTarget>}
 */
function getByPromoterIdAndProductivePeriod(mongodb, promoterId, productivePeriodYear, productivePeriodMonth) {
  const productivePeriod = parse(productivePeriodYear, productivePeriodMonth);
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id: `${promoterId}-${productivePeriod}` })
    .then((result) => {
      if (!result) {
        return Promise.resolve(
          new SheltiaPromoterTarget({
            _id: undefined,
            promoterId,
            targetIv: 0,
            productivePeriodYear,
            productivePeriodMonth,
            productivePeriod: Number(`${productivePeriodYear}${productivePeriodMonth.toString().padStart(2, '0')}`),
          }),
        );
      }
      return Promise.resolve(new SheltiaPromoterTarget(result));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} promoterId
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 * @param {string} roleId
 * @returns {Promise<SheltiaPromoterTarget>}
 */
function getByPromoterIdAndProductivePeriodFromLegacy(
  mongodb,
  promoterId,
  productivePeriodYear,
  productivePeriodMonth,
  roleId,
) {
  return mongodb
    .collection('TargetMensile')
    .findOne({
      AnnoProduttivo: productivePeriodYear,
      MeseProduttivo: productivePeriodMonth,
      UtenteInternoIdentifier: uuidToBinary(promoterId),
    })
    .then((result) => {
      let targetIv = 0;
      if (result) {
        switch (roleId) {
          case 'promoter':
            targetIv = (result.QuotePromotore || 0) * 100;
            break;
          case 'senior-promoter':
          case 'team-manager':
            targetIv = (result.QuoteTM || 0) * 100;
            break;
          case 'branch-manager':
            targetIv = (result.QuoteBM || 0) * 100;
            break;
          case 'district-manager':
            targetIv = (result.QuoteDM || 0) * 100;
            break;
          default:
            targetIv = 0;
            break;
        }
      }
      return Promise.resolve(
        new SheltiaPromoterTarget({
          _id: undefined,
          promoterId,
          targetIv,
          productivePeriodYear,
          productivePeriodMonth,
          productivePeriod: Number(`${productivePeriodYear}${productivePeriodMonth.toString().padStart(2, '0')}`),
        }),
      );
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {SheltiaPromoterTarget} targetConfiguration
 * @returns {Promise<SheltiaPromoterTarget>}
 */
function replace(mongodb, targetConfiguration) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne({ _id: targetConfiguration._id }, { $set: targetConfiguration }, { upsert: true })
    .then((result) => {
      if (!result.result.ok) return Promise.reject(new Error('Error updating target'));
      return Promise.resolve(targetConfiguration);
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<SheltiaPromoterTarget>} seed
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
  getByPromoterIdAndProductivePeriod,
  getByPromoterIdAndProductivePeriodFromLegacy,
  getByPromoterIdAndYear,
  replace,
  insertSeed,
  createIndexes,
};
