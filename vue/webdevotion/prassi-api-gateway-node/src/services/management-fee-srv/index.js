/* eslint-disable no-continue */
const TreeModel = require('tree-model');
const NetworkNode = require('../network-srv/network-node');
const PromoterJob = require("../promoter-job-srv/promoter-job");
const ManagementFee = require('./management-fee');
const managementFeeRepository = require('./management-fee-repository');
const ManagementFeeConfigurationService = require('../management-fee-configuration-srv');

class ManagementFeeSrv {
  constructor(mongodb) {
    this.mongodb = mongodb;
    this.managementFeeConfigurationService = new ManagementFeeConfigurationService(mongodb);
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
    const managementFees = await managementFeeRepository.getByProductivePeriodAndInsurer(
      this.mongodb,
      productivePeriodYear,
      productivePeriodMonth,
    );

    const roleIds = [...new Set(promotersJob.map(({ roleId }) => roleId))];
    const roleConfigs = await Promise.all(
      roleIds.map((roleId) =>
        this.managementFeeConfigurationService.getByRoleIdAndProductivePeriod(
          roleId,
          productivePeriodYear,
          productivePeriodMonth,
        ),
      ),
    );

    const networkManagementFeeMap = new Map();
    let income = 0;
    let outcome = 0;

    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < managementFees.length; i += 1) {
      // eslint-disable-next-line security/detect-object-injection
      const mf = managementFees[i];
      income += mf.amount;
      const insurerNode = networkTree.first((node) => node.model.promoterId === mf.insurerId);
      if (!insurerNode) continue;

      const nodes = insurerNode.getPath();
      // eslint-disable-next-line unicorn/no-for-loop
      for (let index = 0; index < nodes.length; index += 1) {
        // eslint-disable-next-line security/detect-object-injection
        const node = nodes[index];
        if (!node.model.promoterId) continue;

        const job = promotersJob.find((x) => x.promoterId === node.model.promoterId);
        if (!job) continue;

        const config = roleConfigs.find((c) => c.roleId === job.roleId);
        if (!config) continue;

        const amount = Math.round((mf.amount * config.percentage) / 10000);
        networkManagementFeeMap.set(
          node.model.promoterId,
          (networkManagementFeeMap.get(node.model.promoterId) || 0) + amount,
        );
        outcome += amount;
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
