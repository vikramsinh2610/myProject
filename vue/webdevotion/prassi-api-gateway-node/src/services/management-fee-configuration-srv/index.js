const ManagementFeeConfiguration = require('./management-fee-configuration');
const managementFeeConfigurationRepository = require('./management-fee-configuration-repository');
const { seed } = require('./seed/seed');

class ManagementFeeConfigurationSrv {
  constructor(mongodb) {
    this.mongodb = mongodb;
  }

  /**
   * @param {string} roleId
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @returns {Promise<ManagementFeeConfiguration>}
   */
  getByRoleIdAndProductivePeriod(roleId, productivePeriodYear, productivePeriodMonth) {
    return managementFeeConfigurationRepository.getByRoleIdAndProductivePeriod(
      this.mongodb,
      roleId,
      productivePeriodYear,
      productivePeriodMonth,
    );
  }

  /**
   * @param {ManagementFeeConfiguration} productConfiguration
   * @returns {Promise<ManagementFeeConfiguration>}
   */
  addOrUpdateConfiguration(productConfiguration) {
    return managementFeeConfigurationRepository.replace(this.mongodb, productConfiguration);
  }

  insertSeed() {
    return managementFeeConfigurationRepository.insertSeed(this.mongodb, seed);
  }

  createIndexes() {
    return managementFeeConfigurationRepository.createIndexes(this.mongodb);
  }
}

module.exports = ManagementFeeConfigurationSrv;
