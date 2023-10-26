const TreeModel = require('tree-model');
const NetworkNode = require('../network-srv/network-node');
const PayoutPartition = require('./payout-partition');
const ProductConfigurationService = require('../product-configuration-srv');
const { partitionPayout } = require('./payout-partitioner');
const PromoterJob = require('../promoter-job-srv/promoter-job');
const TcwCommConfig = require('../tcw-commissioning-configuration-srv/tcw-commissioning-configuration-dynamic');

class PayoutPartitionerService {
  constructor(mongodb) {
    this.mongodb = mongodb;
  }

  /**
   * @param {TreeModel.Node<NetworkNode>} networkTree
   * @param {number} payout
   * @param {string} insurerId
   * @param {string} productId
   * @param {Array<PromoterJob>} promotersJob
   * @param {TcwCommConfig} commissioningConfigs
   * @param {ProductConfigurationService} productConfigurationService
   * @returns {Promise<Array<PayoutPartition>>}
   */
  // eslint-disable-next-line class-methods-use-this
  async getNetworkPayout(
    networkTree,
    payout,
    insurerId,
    productId,
    promotersJob,
    commissioningConfigs,
    productConfigurationService,
  ) {
    return partitionPayout(
      payout,
      networkTree,
      insurerId,
      productId,
      promotersJob,
      commissioningConfigs,
      productConfigurationService,
    );
  }
}

module.exports = PayoutPartitionerService;
