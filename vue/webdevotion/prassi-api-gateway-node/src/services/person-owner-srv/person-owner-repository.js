const Knex = require('knex');
const PersonOwner = require('./person-owner');

/**
 * @param {Knex} sql
 * @param {PersonOwner} personOwner
 * @returns {Promise<PersonOwner | undefined>}
 */
async function insert(sql, personOwner) {
  const existPersonOwner = await sql
    .select()
    .from('person_owner')
    .where('uuid', personOwner._id)
    .andWhere('productivePeriodMonth', personOwner.productivePeriodMonth)
    .andWhere('productivePeriodYear', personOwner.productivePeriodYear)
    .then((results) => results);

  const result = (existPersonOwner && existPersonOwner.length > 0 ? await sql('person_owner')
      .update({
        legacy: personOwner,
        personId: personOwner.customerId,
        networkNodeId: personOwner.networkNodeId,
        ownerId: personOwner.promoterId,
        productivePeriodMonth: personOwner.productivePeriodMonth,
        productivePeriodYear: personOwner.productivePeriodYear,
      })
      .where('uuid', personOwner._id) : await sql('person_owner').insert({
      uuid: personOwner._id,
      legacy: personOwner,
      personId: personOwner.customerId,
      networkNodeId: personOwner.networkNodeId,
      ownerId: personOwner.promoterId,
      productivePeriodMonth: personOwner.productivePeriodMonth,
      productivePeriodYear: personOwner.productivePeriodYear,
    }));

  // @ts-ignore
  if (result.rowCount !== 1 && result !== 1) {
    // eslint-disable-next-line unicorn/no-useless-undefined
    return undefined;
  }

  return personOwner;
}

module.exports = {
  insert,
};
