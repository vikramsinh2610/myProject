const Mongo = require('mongodb');
const Knex = require('knex');
const PracticeFee = require('./commission-installment');
const productivePeriodHelper = require('../../utils/productive-period-helper');

/**
 * @param {Knex} sql
 * @param {PracticeFee} practice
 *
 */
async function insertPractice(sql, practice) {
  const thisPractice = await sql
    .select()
    .from('practice_commission')
    .where('_id', practice._id)
    .then((results) => results);

  try {
    // eslint-disable-next-line no-unused-vars
    const result =
      thisPractice && thisPractice.length > 0
        ? await sql('practice_commission')
            .update({
              dossierId: practice.dossierId,
              practiceType: practice.practiceType,
              practiceBaseType: practice.practiceBaseType === null ? practice.practiceType : practice.practiceBaseType,
              practiceId: practice.practiceId,
              contractId: practice.contractId,
              productId: practice.productId,
              productName: practice.productName,
              companyId: practice.companyId,
              companyName: practice.companyName,
              customerId: practice.customerId,
              insuredName: practice.insuredName,
              effectDate: practice.effectDate,
              termDate: practice.termDate,
              insurerId: practice.insurerId,
              premiumNet: practice.premiumNet,
              premiumGross: practice.premiumGross,
              optionId: practice.optionId,
              createDate: practice.createDate,
              installment: practice.installment,
              productivePeriodYear: practice.productivePeriodYear,
              productivePeriodMonth: practice.productivePeriodMonth,
              commissioningProductivePeriodYear: practice.commissioningProductivePeriodYear,
              commissioningProductivePeriodMonth: practice.commissioningProductivePeriodMonth,
              payin: practice.payin,
              margin: practice.margin,
              payout: practice.payout,
              advance: practice.advance,
              forecast: practice.forecast,
              paidToNetwork: practice.paidToNetwork,
              reminder: practice.reminder,
              dueDate: practice.dueDate,
              confirmed: practice.confirmed,
              paymentDate: practice.paymentDate,
              commissionType: practice.commissionType,
              installmentsPerYear: practice.installmentsPerYear,
              _id: practice._id || `${practice.practiceId}-${practice.installment}`,
              iv: practice.iv,
              legacyPraticaIncassoId: practice.legacyPraticaIncassoId,
              commissioningId: practice.commissioningId,
              postForce: practice.postForce,
              productivePeriod: productivePeriodHelper.parse(
                practice.productivePeriodYear,
                practice.productivePeriodMonth,
              ),
              commissioningProductivePeriod: productivePeriodHelper.parse(
                practice.commissioningProductivePeriodYear,
                practice.commissioningProductivePeriodMonth,
              ),
            })
            .where('_id', practice._id)
        : await sql('practice_commission').insert({
            dossierId: practice.dossierId,
            practiceType: practice.practiceType,
            practiceBaseType: practice.practiceBaseType === null ? practice.practiceType : practice.practiceBaseType,
            practiceId: practice.practiceId,
            contractId: practice.contractId,
            productId: practice.productId,
            productName: practice.productName,
            companyId: practice.companyId,
            companyName: practice.companyName,
            customerId: practice.customerId,
            insuredName: practice.insuredName,
            effectDate: practice.effectDate,
            termDate: practice.termDate,
            insurerId: practice.insurerId,
            premiumNet: practice.premiumNet,
            premiumGross: practice.premiumGross,
            optionId: practice.optionId,
            createDate: practice.createDate,
            installment: practice.installment,
            productivePeriodYear: practice.productivePeriodYear,
            productivePeriodMonth: practice.productivePeriodMonth,
            commissioningProductivePeriodYear: practice.commissioningProductivePeriodYear,
            commissioningProductivePeriodMonth: practice.commissioningProductivePeriodMonth,
            payin: practice.payin,
            margin: practice.margin,
            payout: practice.payout,
            advance: practice.advance,
            forecast: practice.forecast,
            paidToNetwork: practice.paidToNetwork,
            reminder: practice.reminder,
            dueDate: practice.dueDate,
            confirmed: practice.confirmed,
            paymentDate: practice.paymentDate,
            commissionType: practice.commissionType,
            installmentsPerYear: practice.installmentsPerYear,
            _id: practice._id || `${practice.practiceId}-${practice.installment}`,
            iv: practice.iv,
            legacyPraticaIncassoId: practice.legacyPraticaIncassoId,
            commissioningId: practice.commissioningId,
            postForce: practice.postForce,
            productivePeriod: productivePeriodHelper.parse(
              practice.productivePeriodYear,
              practice.productivePeriodMonth,
            ),
            commissioningProductivePeriod: productivePeriodHelper.parse(
              practice.commissioningProductivePeriodYear,
              practice.commissioningProductivePeriodMonth,
            ),
          });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Knex} sql
 * @param {Array<string>} idsToUpdate
 * @param {object} fieldsToUpdate
 */
async function updateMany(mongodb, sql, idsToUpdate, fieldsToUpdate) {
  return sql('practice_commission')
    .update(fieldsToUpdate)
    .whereIn('_id', idsToUpdate)
    .then(() => Promise.resolve());
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Knex} sql
 * @param {string} commissioningId
 * @param {object} fieldsToUpdate
 */
async function updateManyCommissioningId(mongodb, sql, commissioningId, fieldsToUpdate) {
  return sql('practice_commission')
    .update(fieldsToUpdate)
    .where('commissioningId', commissioningId)
    .then(() => Promise.resolve());
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Knex} sql
 * @param {string} practiceId
 * @param {number} installment
 * @param {boolean} forecast
 * @param {Date} paymentDate
 */
async function confirmInstallment(mongodb, sql, practiceId, installment, forecast, paymentDate) {
  return sql('practice_commission')
    .update({ confirmed: true, forecast, paymentDate })
    .where('practiceId', practiceId)
    .andWhere('installment', installment)
    .then(() => Promise.resolve());
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Knex} sql
 * @param {string} id
 */
async function setInstallmentConfirmed(mongodb, sql, id) {
  return sql('practice_commission')
    .update({ confirmed: true })
    .where('_id', id)
    .then(() => Promise.resolve());
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Knex} sql
 * @param {string} id
 */
async function setInstallmentPaid(mongodb, sql, id) {
  return sql('practice_commission')
    .update({ paidToNetwork: true, forecast: false })
    .where('_id', id)
    .then(() => Promise.resolve());
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Knex} sql
 * @param {string} id
 */
async function setInstallmentUnConfirmed(mongodb, sql, id) {
  return sql('practice_commission')
    .update({ confirmed: false })
    .where('_id', id)
    .then(() => Promise.resolve());
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Knex} sql
 * @param {string} id
 */
async function setInstallmentUnPaid(mongodb, sql, id) {
  return sql('practice_commission')
    .update({ paidToNetwork: false, forecast: true })
    .where('_id', id)
    .then(() => Promise.resolve());
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Knex} sql
 * @param {string} practiceId
 * @param {number} installment
 * @param {number} payin
 * @param {number} payout
 * @param {number} margin
 */
async function updateInstallmentPayin(mongodb, sql, practiceId, installment, payin, payout, margin) {
  // if (fastify.edition === 'sheltia') {
  //   return sql('practice_commission')
  //     .update({ payin, iv: payout, margin })
  //     .where('practiceId', practiceId)
  //     .andWhere('installment', installment)
  //     .then(() => Promise.resolve());
  // }

  return sql('practice_commission')
    .update({ payin, payout, margin })
    .where('practiceId', practiceId)
    .andWhere('installment', installment)
    .then(() => Promise.resolve());
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Knex} sql
 * @param {string} dossierId
 * @param {number} companyId
 * @param {number} companyName
 * @param {number} customerId
 * @param {number} insuredName
 * @param {number} postForce
 */
async function updateInstallmentFix(
  mongodb,
  sql,
  dossierId,
  companyId,
  companyName,
  customerId,
  insuredName,
  postForce,
) {
  return sql('practice_commission')
    .update({ companyId, companyName, customerId, insuredName, postForce })
    .where('dossierId', dossierId)
    .then(() => Promise.resolve());
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Knex} sql
 * @param {string} entryId
 * @returns {Promise<PracticeFee>}
 */
function getByEntryId(mongodb, sql, entryId) {
  return sql
    .select('*')
    .from('practice_commission')
    .where('_id', entryId)
    .then((results) => {
      if (results.length !== 1) {
        return Promise.reject(new Error(`Entry '${entryId}' does not exist`));
      }
      return Promise.resolve(new PracticeFee(results[0]));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Knex} sql
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 * @returns {Promise<Array<PracticeFee>>}
 */
function getPayableByProductivePeriod(mongodb, sql, productivePeriodYear, productivePeriodMonth) {
  return sql
    .select('*')
    .from('practice_commission')
    .where('paidToNetwork', false)
    // eslint-disable-next-line func-names
    .andWhere(function () {
      this.where(
        'productivePeriod',
        '<=',
        productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth),
        // eslint-disable-next-line func-names
      ).orWhere(function () {
        this.where('confirmed', true).andWhere('advance', true);
      });
    })
    .then((results) => Promise.resolve(results.map((x) => new PracticeFee(x))));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Knex} sql
 * @param {string} practiceId
 * @param {number} productivePeriod
 * @returns {Promise<Array<PracticeFee>>}
 */
function getByPracticeIdsAndProductivePeriods(mongodb, sql, practiceId, productivePeriod) {
  return sql
    .select('*')
    .from('practice_commission')
    .andWhere('practiceId', practiceId)
    .andWhere('productivePeriod', productivePeriod)
    .then((results) => Promise.resolve(results.map((x) => new PracticeFee(x))));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Knex} sql
 * @param {string} practiceId
 * @param {number} installment
 * @returns {Promise<PracticeFee>}
 */
function getByPracticeIdAndInstallment(mongodb, sql, practiceId, installment) {
  return sql
    .select('*')
    .from('practice_commission')
    .andWhere('paidToNetwork', false)
    .andWhere('practiceId', practiceId)
    .andWhere('installment', installment)
    .then((results) => {
      if (results.length !== 1) {
        return Promise.reject(new Error(`Cannot find practice commission installment: ${practiceId}, ${installment}`));
      }
      return Promise.resolve(new PracticeFee(results[0]));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Knex} sql
 * @param {string} practiceId
 * @param {number} installment
 * @returns {Promise<PracticeFee>}
 */
function getByPracticeIdAndInstallmentAll(mongodb, sql, practiceId, installment) {
  return (
    sql
      .select('*')
      .from('practice_commission')
      .andWhere('practiceId', practiceId)
      .andWhere('installment', installment)
      // eslint-disable-next-line sonarjs/no-identical-functions
      .then((results) => {
        if (results.length !== 1) {
          return Promise.reject(
            new Error(`Cannot find practice commission installment: ${practiceId}, ${installment}`),
          );
        }
        return Promise.resolve(new PracticeFee(results[0]));
      })
  );
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Knex} sql
 * @param {string} practiceId
 * @param {string} edition
 * @param {boolean} overrideConfirmed
 * @returns {Promise<number>}
 */
async function removeEntries(mongodb, sql, practiceId, edition, overrideConfirmed) {
  return sql
    .select('*')
    .from('practice_commission')
    .andWhere('practiceId', practiceId)
    .andWhere('paidToNetwork', true)
    .then(async (entries) => {
      // eslint-disable-next-line unicorn/no-reduce
      const lastInstallment = entries.reduce((acc, item) => Math.max(acc, item.installment), 0) + 1;
      try {
        // eslint-disable-next-line unicorn/prefer-ternary
        if (edition !== 'sheltia' && !overrideConfirmed) {
          await sql('practice_commission')
            .del()
            .andWhere('practiceId', practiceId)
            .andWhere('confirmed', false)
            .andWhere('installment', '>=', lastInstallment);
        } else {
          await sql('practice_commission')
            .del()
            .andWhere('practiceId', practiceId)
            .andWhere('installment', '>=', lastInstallment);
        }
        return Promise.resolve(lastInstallment);
      } catch (error) {
        return Promise.reject(error);
      }
    });
}

module.exports = {
  insertPractice,
  updateMany,
  updateManyCommissioningId,
  confirmInstallment,
  updateInstallmentPayin,
  updateInstallmentFix,
  getByEntryId,
  getPayableByProductivePeriod,
  getByPracticeIdsAndProductivePeriods,
  getByPracticeIdAndInstallment,
  getByPracticeIdAndInstallmentAll,
  removeEntries,
  setInstallmentConfirmed,
  setInstallmentPaid,
  setInstallmentUnConfirmed,
  setInstallmentUnPaid,
};
