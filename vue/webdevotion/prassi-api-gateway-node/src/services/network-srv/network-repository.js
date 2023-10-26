const Mongo = require('mongodb');
const Knex = require('knex');
const productivePeriodHelper = require('../../utils/productive-period-helper');
require('../../utils/foreach');

/**
 * @param {Mongo.Db} mongodb
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 */
function getNetwork(mongodb, productivePeriodYear, productivePeriodMonth) {
  return mongodb
    .collection('network')
    .findOne({ _id: productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth) });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 * @param {object} tree
 */
function insertNetwork(mongodb, productivePeriodYear, productivePeriodMonth, tree) {
  return mongodb.collection('network').insert({
    _id: productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth),
    createDate: new Date(Date.now()),
    tree,
  });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 * @param {object} tree
 */
function updateNetwork(mongodb, productivePeriodYear, productivePeriodMonth, tree) {
  return mongodb
    .collection('network')
    .findOneAndUpdate(
      { _id: productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth) },
      { $set: { tree } },
      { upsert: true, returnOriginal: false },
    )
    .then((x) => x);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 */
function deleteNetwork(mongodb, productivePeriodYear, productivePeriodMonth) {
  return mongodb
    .collection('network')
    .deleteOne({ _id: productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth) });
}

/**
 * @param {Mongo.Db} mongodb
 */
function getLastNetwork(mongodb) {
  return mongodb
    .collection('network')
    .find({})
    .sort({ _id: -1 })
    .toArray()
    .then((x) => {
      if (!x) return Promise.resolve({ _id: '0', children: [] });
      return Promise.resolve(x[0]);
    });
}

/**
 * @param {Knex} sql
 * @param {object} node
 * @param {string} node._id
 * @param {string} node.name
 * @param {string} node.roleId
 * @param {boolean} node.enabled
 * @param {string} node.promoterId
 * @param {string} node.promoterName
 * @param {string} node.displayHierarchy
 * @param {string} node.displayPromoterNames
 * @param {Array} node.displayPromoterNamesIds
 * @param {string} node.validPromoterId
 * @param {string} node.validPromoterName
 * @param {boolean} node.inherited
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 */
async function updateNode(sql, node, productivePeriodYear, productivePeriodMonth) {
  const networkNode = await sql
    .select()
    .from('network_node')
    .where('uuid', node._id)
    .andWhere('productivePeriodMonth', productivePeriodMonth)
    .andWhere('productivePeriodYear', productivePeriodYear)
    .then((results) => results);

  if (networkNode && networkNode.length > 0) {
    return sql('network_node')
      .update({
        uuid: node._id,
        name: node.name,
        enabled: node.enabled,
        roleId: node.roleId,
        promoterId: node.promoterId,
        promoterName: node.promoterName,
        displayHierarchy: node.displayHierarchy,
        displayPromoterNames: node.displayPromoterNames,
        displayPromoterNamesIds: { ids: [...node.displayPromoterNamesIds] },
        validPromoterId: node.validPromoterId,
        validPromoterName: node.validPromoterName,
        inherited: node.inherited,
        productivePeriodYear,
        productivePeriodMonth,
      })
      .where('uuid', node._id)
      .andWhere('productivePeriodMonth', productivePeriodMonth)
      .andWhere('productivePeriodYear', productivePeriodYear)
      .returning('*')
      .then((result) => result);
  }
  return sql('network_node')
    .insert({
      uuid: node._id,
      name: node.name,
      enabled: node.enabled,
      roleId: node.roleId,
      promoterId: node.promoterId,
      promoterName: node.promoterName,
      displayHierarchy: node.displayHierarchy,
      displayPromoterNames: node.displayPromoterNames,
      displayPromoterNamesIds: { ids: [...node.displayPromoterNamesIds] },
      validPromoterId: node.validPromoterId,
      validPromoterName: node.validPromoterName,
      inherited: node.inherited,
      productivePeriodYear,
      productivePeriodMonth,
    })
    .returning('*')
    .then((result) => result);
}

/**
 * @param {Knex} sql
 * @param {string} _id
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 */
async function deleteNode(sql, _id, productivePeriodYear, productivePeriodMonth) {
  const networkNode = await sql
    .select()
    .from('network_node')
    .where('uuid', _id)
    .then((results) => results);

  if (networkNode && networkNode.length > 0) {
    await sql('network_node')
      .delete()
      .where('uuid', _id)
      .andWhere('productivePeriodMonth', productivePeriodMonth)
      .andWhere('productivePeriodYear', productivePeriodYear);
  }
}

module.exports = {
  getNetwork,
  deleteNetwork,
  insertNetwork,
  updateNetwork,
  getLastNetwork,
  updateNode,
  deleteNode,
};
