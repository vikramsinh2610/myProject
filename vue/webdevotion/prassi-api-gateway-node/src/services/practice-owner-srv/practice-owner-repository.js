const Knex = require('knex');
const PracticeOwner = require('./practice-owner');

/**
 * @param {Knex} sql
 * @param {PracticeOwner} practiceOwner
 * @returns {Promise<PracticeOwner>}
 */
async function insert(sql, practiceOwner) {
  const existPracticeOwner = await sql
    .select()
    .from('practice_owner')
    .where('uuid', practiceOwner._id)
    .andWhere('productivePeriodMonth', practiceOwner.productivePeriodMonth)
    .andWhere('productivePeriodYear', practiceOwner.productivePeriodYear)
    .then((results) => results);

  // eslint-disable-next-line no-unused-vars
  const result = (existPracticeOwner && existPracticeOwner.length > 0 ? await sql('practice_owner')
      .update({
        legacy: practiceOwner,
        dossierId: practiceOwner.dossierId,
        networkNodeId: practiceOwner.networkNodeId,
        ownerId: practiceOwner.promoterId,
        productivePeriodMonth: practiceOwner.productivePeriodMonth,
        productivePeriodYear: practiceOwner.productivePeriodYear,
      })
      .where('uuid', practiceOwner._id)
      .andWhere('productivePeriodMonth', practiceOwner.productivePeriodMonth)
      .andWhere('productivePeriodYear', practiceOwner.productivePeriodYear) : await sql('practice_owner').insert({
      uuid: practiceOwner._id,
      legacy: practiceOwner,
      dossierId: practiceOwner.dossierId,
      networkNodeId: practiceOwner.networkNodeId,
      ownerId: practiceOwner.promoterId,
      productivePeriodMonth: practiceOwner.productivePeriodMonth,
      productivePeriodYear: practiceOwner.productivePeriodYear,
    }));

  return practiceOwner;
}

module.exports = {
  insert,
};
