const TreeModel = require('tree-model');
const NetworkNode = require("../network-srv/network-node");
const PayoutPartition = require('./payout-partition');
const ProductConfigurationService = require('../product-configuration-srv');
const PromoterJob = require("../promoter-job-srv/promoter-job");
const TcwCommConfig = require('../tcw-commissioning-configuration-srv/tcw-commissioning-configuration');
const TcwCommConfigDynamic = require('../tcw-commissioning-configuration-srv/tcw-commissioning-configuration-dynamic');

function mapToPayoutPartition(promoterId, percentage, payout, productionType) {
  const amount = Math.trunc((payout * percentage) / 10000);
  return new PayoutPartition({ promoterId, amount, percentage, productionType });
}

/**
 *
 * @param {TreeModel.Node<NetworkNode>} tree
 * @param {string} insurerId
 */
function getNetworkBranch(tree, insurerId) {
  if (!insurerId) return [];
  const insurerNode = tree.first((node) => node.model.promoterId === insurerId);
  if (!insurerNode) return [];
  return insurerNode
    .getPath()
    .reverse()
    .slice(1);
}

/**
 *
 * @param {TreeModel.Node<NetworkNode>} tree
 * @param {string} insurerId
 */
function getNetworkAllBranches(tree, insurerId) {
  if (!insurerId) return [];
  const insurerNode = tree.first((node) => node.model.promoterId === insurerId);
  if (!insurerNode) return [];
  return insurerNode.getPath().reverse();
}

/**
 *
 * @param {Array<PromoterJob>} promotersJob
 * @param {Array<TcwCommConfig>} commissioningConfigs
 * @param {string} promoterId
 */
function getJobConfig(promotersJob, commissioningConfigs, promoterId) {
  const promoterJob = promotersJob.find((pj) => pj.promoterId === promoterId);
  if (!promoterJob) return null;

  const config = commissioningConfigs.find((c) => c.roleId === promoterJob.roleId);
  if (!config) return null;

  return config;
}

/**
 *
 * @param {Array} branch
 * @param {Array} commissioningConfigs
 */
function selectJobConfigArray(branch, commissioningConfigs) {
  const firstRole = branch[0].model.roleId;
  const commissioningConfigsValues = commissioningConfigs.map((el) => {
    const indexFirstRole = el.roles.findIndex((role) => role.roleId === firstRole);
    if (indexFirstRole !== -1) {
      return { id: el.id, roles: el.roles.slice(0, indexFirstRole + 1), match: 0 };
    }
    return { id: el.id, roles: [...el.roles], match: 0 };
  });

  branch.forEach((node) => {
    commissioningConfigsValues.forEach((commissioningConfigsItems) => {
      const indexRole = commissioningConfigsItems.roles.findIndex((el) => el.roleId === node.model.roleId);
      // eslint-disable-next-line no-param-reassign
      if (indexRole !== -1) commissioningConfigsItems.match += 1;
    });
  });

  const selected = commissioningConfigsValues
    .filter((el) => el.roles.length === el.match)
    // eslint-disable-next-line unicorn/no-reduce
    .reduce((previous, current) => (previous.roles.length > current.roles.length ? previous : current), {
      id: '',
      roles: [],
    });
  const defaultConfig = commissioningConfigs.find((el) => el.id === 'all');
  const selectedConfig = commissioningConfigs.find((el) => el.id === selected.id);

  if (selected.roles.length > 0) return selectedConfig;
  return defaultConfig;
}

/**
 *
 * @param {TcwCommConfig} config
 * @param {number} reminder
 */
function calculatePercentage(config, reminder) {
  const extra = config.isIndirectProductionCombinable ? reminder : 0;
  return config.indirectProductionPercentage + extra;
}

/**
 * @param {number} payout
 * @param {TreeModel.Node<NetworkNode>} tree
 * @param {string} insurerId
 * @param {string} productId
 * @param {Array<PromoterJob>} promotersJob
 * @param {TcwCommConfigDynamic} commissioningConfigs
 * @param {ProductConfigurationService} productConfigurationService
 */
// eslint-disable-next-line no-unused-vars,max-len
async function partitionPayout(payout, tree, insurerId, productId, promotersJob, commissioningConfigs, productConfigurationService) {
  const partitions = [];
  const productConfiguration = await productConfigurationService.getByProductId(productId);

  const branch = getNetworkBranch(tree, insurerId);
  const branchForCheck = getNetworkAllBranches(tree, insurerId);
  if (branch.length === 0) return partitions;

  // eslint-disable-next-line no-param-reassign
  const newCommissioningConfigs = selectJobConfigArray(branchForCheck, commissioningConfigs.config);

  const config = getJobConfig(promotersJob, newCommissioningConfigs.roles, insurerId);
  if (!config) return partitions;

  if (productConfiguration.promoter100) {
    const directProductionPercentage = 10000;
    partitions.push(mapToPayoutPartition(insurerId, directProductionPercentage, payout, 'direct'));
    return partitions;
  }

  const { directProductionPercentage } = config;
  partitions.push(mapToPayoutPartition(insurerId, directProductionPercentage, payout, 'direct'));

  let reminder = 0;
  branch.forEach((node) => {
    if (!node.model.promoterId) {
      const responsibleConfig = newCommissioningConfigs.roles.find((c) => c.roleId === node.model.roleId);
      if (!responsibleConfig) return;

      reminder += responsibleConfig.indirectProductionPercentage;
      return;
    }

    const responsibleConfig = getJobConfig(promotersJob, newCommissioningConfigs.roles, node.model.promoterId);
    if (!responsibleConfig) return;

    const percentage = calculatePercentage(
      responsibleConfig,
      responsibleConfig.indirectProductionPercentage === 1500 && directProductionPercentage === 8500 ? 0 : reminder,
    );
    if (percentage !== 0) {
      partitions.push(mapToPayoutPartition(node.model.promoterId, percentage, payout, 'indirect'));
    }
    reminder = 0;
  });
  return partitions;
}

module.exports = { partitionPayout };
