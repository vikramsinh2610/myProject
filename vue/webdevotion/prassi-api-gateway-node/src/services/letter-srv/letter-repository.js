const Mongo = require('mongodb');
const Letter = require('./letter');
const BonusLetter = require('./bonus/bonus-letter');
const CommissioningPaLetter = require('./commissioning/commissioning-pa-letter');
const CommissioningPasLetter = require('./commissioning/commissioning-pas-letter');
const BonusPaLetter = require('./commissioning/bonus-pa-letter');
const BonusPasLetter = require('./commissioning/bonus-pas-letter');
const RappelPaLetter = require('./commissioning/rappel-pa-letter');
const RappelPasLetter = require('./commissioning/rappel-pas-letter');
const JobLetter = require('./job/job-letter');
const ManagementFeeLetter = require('./management-fee/management-fee-letter');
const counters = require("../../utils/counters");
const { statuses } = require('./letter-statuses');
const { mapLetter } = require('./letter-mapper');
const { types } = require('./letter-types');
const productivePeriodHelper = require('../../utils/productive-period-helper');

const COLLECTION_NAME = 'letter';

/**
 * @param {Mongo.Db} mongodb
 */
function getNextId(mongodb) {
  const year = new Date(Date.now()).getUTCFullYear();
  return counters.next(mongodb, `LETTER-ID-${year}`).then((count) => `${count}-${year}`);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Letter|BonusLetter|JobLetter|ManagementFeeLetter} letter
 * @returns {Promise<Letter|BonusLetter|JobLetter|ManagementFeeLetter>}
 */
function insert(mongodb, letter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .insert(letter)
    .then((x) => {
      if (!x.result.ok) return Promise.reject(new Error('Error inserting letter'));
      return Promise.resolve(letter);
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} letterId
 * @param {string} promoterId
 * @returns {Promise<Letter|BonusLetter|JobLetter|ManagementFeeLetter>}
 */
function getById(mongodb, letterId, promoterId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ _id: letterId, promoterId })
    .then((x) => {
      if (!x) return Promise.reject(new Error('Lettera non trovata'));
      return Promise.resolve(mapLetter(x));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Date} date
 * @returns {Promise<Array<Letter|BonusLetter|JobLetter|ManagementFeeLetter>>}
 */
function getOverdueLetters(mongodb, date) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ willExpireDate: { $lt: date }, status: statuses.ACTIVE })
    .toArray()
    .then((x) => {
      if (!x) return Promise.resolve([]);
      return Promise.resolve(x.map((l) => mapLetter(l)));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} productivePeriod
 * @returns {Promise<Array<BonusLetter>>}
 */
function getActiveBonusLetters(mongodb, productivePeriod) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({
      type: {
        $in: [
          types.GUARANTEED,
          types.GUARANTEED_VARIABLE,
          types.GUARANTEED_VARIABLE_MINIMUM,
          types.GUARANTEED_WITH_BONUS,
          types.GUARANTEED_WITH_BONUS_PREPAYD,
          types.RAPPEL,
          types['RAPPEL-2'],
          types['RAPPEL-3'],
          types['RAPPEL-5'],
          types.WELCOME_BONUS,
        ],
      },
      status: statuses.ACTIVE,
    })
    .toArray()
    // eslint-disable-next-line sonarjs/no-identical-functions
    .then((arr) => arr.filter((lt) => {
      const toProductivePeriod = productivePeriodHelper.parse(lt.toProductivePeriodYear, lt.toProductivePeriodMonth);
      const fromProductivePeriod = productivePeriodHelper.parse(
        lt.fromProductivePeriodYear,
        lt.fromProductivePeriodMonth,
      );
      return productivePeriod <= toProductivePeriod && productivePeriod >= fromProductivePeriod;
    }))
    .then((x) => x.map((l) => new BonusLetter(l)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} productivePeriod
 * @returns {Promise<Array<CommissioningPaLetter>>}
 */
function getActiveCommissioningPaLetters(mongodb, productivePeriod) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({
      type: types.COMMISSIONING_PA,
      status: statuses.ACTIVE,
    })
    .toArray()
    // eslint-disable-next-line sonarjs/no-identical-functions
    .then((arr) => arr.filter((lt) => {
      const toProductivePeriod = productivePeriodHelper.parse(lt.toProductivePeriodYear, lt.toProductivePeriodMonth);
      const fromProductivePeriod = productivePeriodHelper.parse(
        lt.fromProductivePeriodYear,
        lt.fromProductivePeriodMonth,
      );
      return productivePeriod <= toProductivePeriod && productivePeriod >= fromProductivePeriod;
    }))
    .then((x) => x.map((l) => new CommissioningPaLetter(l)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} productivePeriod
 * @returns {Promise<Array<CommissioningPasLetter>>}
 */
function getActiveCommissioningPasLetters(mongodb, productivePeriod) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({
      type: types.COMMISSIONING_PAS,
      status: statuses.ACTIVE,
    })
    .toArray()
    // eslint-disable-next-line sonarjs/no-identical-functions
    .then((arr) => arr.filter((lt) => {
      const toProductivePeriod = productivePeriodHelper.parse(lt.toProductivePeriodYear, lt.toProductivePeriodMonth);
      const fromProductivePeriod = productivePeriodHelper.parse(
        lt.fromProductivePeriodYear,
        lt.fromProductivePeriodMonth,
      );
      return productivePeriod <= toProductivePeriod && productivePeriod >= fromProductivePeriod;
    }))
    .then((x) => x.map((l) => new CommissioningPasLetter(l)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} productivePeriod
 * @returns {Promise<Array<BonusPasLetter>>}
 */
function getActiveBonusPasLetters(mongodb, productivePeriod) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({
      type: types.BONUS_PAS,
      status: statuses.ACTIVE,
    })
    .toArray()
    // eslint-disable-next-line sonarjs/no-identical-functions
    .then((arr) => arr.filter((lt) => {
      const toProductivePeriod = productivePeriodHelper.parse(lt.toProductivePeriodYear, lt.toProductivePeriodMonth);
      const fromProductivePeriod = productivePeriodHelper.parse(
        lt.fromProductivePeriodYear,
        lt.fromProductivePeriodMonth,
      );
      return productivePeriod <= toProductivePeriod && productivePeriod >= fromProductivePeriod;
    }))
    .then((x) => x.map((l) => new BonusPasLetter(l)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} productivePeriod
 * @returns {Promise<Array<BonusPaLetter>>}
 */
function getActiveBonusPaLetters(mongodb, productivePeriod) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({
      type: types.BONUS_PA,
      status: statuses.ACTIVE,
    })
    .toArray()
    // eslint-disable-next-line sonarjs/no-identical-functions
    .then((arr) => arr.filter((lt) => {
      const toProductivePeriod = productivePeriodHelper.parse(lt.toProductivePeriodYear, lt.toProductivePeriodMonth);
      const fromProductivePeriod = productivePeriodHelper.parse(
        lt.fromProductivePeriodYear,
        lt.fromProductivePeriodMonth,
      );
      return productivePeriod <= toProductivePeriod && productivePeriod >= fromProductivePeriod;
    }))
    .then((x) => x.map((l) => new BonusPaLetter(l)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} productivePeriod
 * @returns {Promise<Array<RappelPasLetter>>}
 */
function getActiveRappelPasLetters(mongodb, productivePeriod) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({
      type: types.RAPPEL_PAS,
      status: statuses.ACTIVE,
    })
    .toArray()
    // eslint-disable-next-line sonarjs/no-identical-functions
    .then((arr) => arr.filter((lt) => {
      const toProductivePeriod = productivePeriodHelper.parse(lt.toProductivePeriodYear, lt.toProductivePeriodMonth);
      const fromProductivePeriod = productivePeriodHelper.parse(
        lt.fromProductivePeriodYear,
        lt.fromProductivePeriodMonth,
      );
      return productivePeriod <= toProductivePeriod && productivePeriod >= fromProductivePeriod;
    }))
    .then((x) => x.map((l) => new RappelPasLetter(l)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} productivePeriod
 * @returns {Promise<Array<RappelPaLetter>>}
 */
function getActiveRappelPaLetters(mongodb, productivePeriod) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({
      type: types.RAPPEL_PA,
      status: statuses.ACTIVE,
    })
    .toArray()
    // eslint-disable-next-line sonarjs/no-identical-functions
    .then((arr) => arr.filter((lt) => {
      const toProductivePeriod = productivePeriodHelper.parse(lt.toProductivePeriodYear, lt.toProductivePeriodMonth);
      const fromProductivePeriod = productivePeriodHelper.parse(
        lt.fromProductivePeriodYear,
        lt.fromProductivePeriodMonth,
      );
      return productivePeriod <= toProductivePeriod && productivePeriod >= fromProductivePeriod;
    }))
    .then((x) => x.map((l) => new RappelPaLetter(l)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} productivePeriod
 * @returns {Promise<Array<RappelPaLetter>>}
 */
function getActiveRappelPa2021Letters(mongodb, productivePeriod) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({
      type: types.RAPPEL_PA_2021,
      status: statuses.ACTIVE,
    })
    .toArray()
    // eslint-disable-next-line sonarjs/no-identical-functions
    .then((arr) => arr.filter((lt) => {
      const toProductivePeriod = productivePeriodHelper.parse(lt.toProductivePeriodYear, lt.toProductivePeriodMonth);
      const fromProductivePeriod = productivePeriodHelper.parse(
        lt.fromProductivePeriodYear,
        lt.fromProductivePeriodMonth,
      );
      return productivePeriod <= toProductivePeriod && productivePeriod >= fromProductivePeriod;
    }))
    .then((x) => x.map((l) => new RappelPaLetter(l)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Letter} letter
 * @returns {Promise<number>}
 */
function countOverlappingLetters(mongodb, letter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({
      _id: { $ne: letter._id },
      promoterId: letter.promoterId,
      type: letter.type,
      status: statuses.ACTIVE,
    })
    .count();
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Letter|BonusLetter|JobLetter|ManagementFeeLetter} letter
 * @returns {Promise<Letter|BonusLetter|JobLetter|ManagementFeeLetter>}
 */
function replace(mongodb, letter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .replaceOne({ _id: letter._id }, letter)
    .then((x) => {
      if (!x.result.ok) return Promise.reject(new Error('Failed udpdate'));
      return Promise.resolve(letter);
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<Letter|BonusLetter|JobLetter|ManagementFeeLetter>} seed
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
  return Promise.all([
    mongodb.collection(COLLECTION_NAME).createIndex({ _id: 1 }),
    mongodb.collection(COLLECTION_NAME).createIndex({ promoterId: 1 }),
  ]);
}

module.exports = {
  getNextId,
  insert,
  getById,
  replace,
  countOverlappingLetters,
  getActiveBonusLetters,
  getActiveCommissioningPasLetters,
  getActiveCommissioningPaLetters,
  getActiveBonusPasLetters,
  getActiveBonusPaLetters,
  getActiveRappelPasLetters,
  getActiveRappelPaLetters,
  getActiveRappelPa2021Letters,
  getOverdueLetters,
  insertSeed,
  createIndexes,
};
