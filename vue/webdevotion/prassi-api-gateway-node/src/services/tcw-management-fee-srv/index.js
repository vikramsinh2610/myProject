/* eslint-disable no-continue */
const TreeModel = require('tree-model');
const NetworkNode = require('../network-srv/network-node');
const PromoterJob = require('../promoter-job-srv/promoter-job');
const ManagementFee = require('./management-fee');
const managementFeeRepository = require('./management-fee-repository');
const ManagementFeeConfigurationService = require('../management-fee-configuration-srv');
const TcwCommissioningConfigurationService = require('../tcw-commissioning-configuration-srv');
const PayoutPartitionerService = require('../tcw-payout-partitioner-srv');
const ProductConfigurationService = require('../product-configuration-srv');

class ManagementFeeSrv {
  constructor(mongodb) {
    this.mongodb = mongodb;
    this.managementFeeConfigurationService = new ManagementFeeConfigurationService(mongodb);
    this.tcwCommissioningConfigurationService = new TcwCommissioningConfigurationService(this.mongodb);
    this.payoutPartitionerService = new PayoutPartitionerService(mongodb);
    this.productConfigurationService = new ProductConfigurationService(this.mongodb);
  }

  /**
   * @param {Array<ManagementFee>} managementFees
   * @returns {Promise<Array<ManagementFee>>}
   */
  addManagementFees(managementFees) {
    if (managementFees.length === 0) return Promise.resolve([]);
    return managementFeeRepository.insertMany(this.mongodb, managementFees);
  }

  /**
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @returns {Promise<Array<ManagementFee>>}
   */
  getManagementFeesByProductivePeriod(productivePeriodYear, productivePeriodMonth) {
    return managementFeeRepository.getByProductivePeriod(this.mongodb, productivePeriodYear, productivePeriodMonth);
  }

  /**
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @param {TreeModel.Node<NetworkNode>} networkTree
   * @param {Array<PromoterJob>} promotersJob
   */
  async payManagementFeeByProductivePeriod(productivePeriodYear, productivePeriodMonth, networkTree, promotersJob) {
    const managementFees = await managementFeeRepository.getByProductivePeriodAndInsurerAndProduct(
      this.mongodb,
      productivePeriodYear,
      productivePeriodMonth,
    );

    const mfeesMap = new Map();
    managementFees.forEach((mfees) => {
      const option = mfees['product-configuration'][0].options.find((el) => el._id === 'MANAGEMENT-FEE');
      const thisFee = mfeesMap.get(mfees._id.insurerId);
      const amount = thisFee && thisFee.amount? thisFee.amount : undefined;
      if (!amount) {
        mfeesMap.set(mfees._id.insurerId, {
          amount: Math.trunc((mfees.amount * option.retrocessionFee) / 10000),
          productId: mfees['product-configuration'][0]._id,
        });
      } else {
        mfeesMap.set(mfees._id.insurerId, {
          amount: Math.trunc((mfees.amount * option.retrocessionFee) / 10000) + amount,
          productId: mfees['product-configuration'][0]._id,
        });
      }
    });

    const commissioningConfig = await this.tcwCommissioningConfigurationService.getLast();

    const networkManagementFeeMap = new Map();
    let income = 0;
    let outcome = 0;

    // eslint-disable-next-line unicorn/no-for-loop
    // for (let i = 0; i < managementFees.length; i += 1) {

    // eslint-disable-next-line no-restricted-syntax
    for (const mf of mfeesMap) {
      // eslint-disable-next-line security/detect-object-injection
      // const mf = managementFees[i];
      income += mf[1].amount;
      const insurerNode = networkTree.first((node) => node.model.promoterId === mf[0]);
      if (!insurerNode) continue;

      // eslint-disable-next-line no-await-in-loop
      const payouts = await this.payoutPartitionerService.getNetworkPayout(
        networkTree,
        mf[1].amount,
        mf[0],
        mf[1].productId,
        promotersJob,
        commissioningConfig,
        this.productConfigurationService,
      );

      // eslint-disable-next-line unicorn/no-for-loop
      for (let index = 0; index < payouts.length; index += 1) {
        networkManagementFeeMap.set(
          // eslint-disable-next-line security/detect-object-injection
          payouts[index].promoterId,
          // eslint-disable-next-line security/detect-object-injection
          (networkManagementFeeMap.get(payouts[index].promoterId) || 0) + payouts[index].amount,
        );
        // eslint-disable-next-line security/detect-object-injection
        outcome += payouts[index].amount;
      }
    }
    return {
      results: [...networkManagementFeeMap.entries()].map(([key, value]) => ({
        promoterId: key,
        details: {
          managementFee: value,
        },
        totalAmount: value,
      })),
      income,
      outcome,
      margin: income - outcome,
    };
  }

  createIndexes() {
    return managementFeeRepository.createIndexes(this.mongodb);
  }
}

module.exports = ManagementFeeSrv;
