const configurationRepository = require('./sheltia-commissioning-configuration-repository');
const SheltiaCommissioningConfiguration = require('./sheltia-commissioning-configuration');
const { seed } = require('./seed/seed');

class SheltiaCommissioningConfigurationService {
  constructor(mongodb) {
    this.mongodb = mongodb;
  }

  /**
   * @param {string} roleId
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @returns {Promise<SheltiaCommissioningConfiguration>}
   */
  getByRoleIdAndProductivePeriod(roleId, productivePeriodYear, productivePeriodMonth) {
    return configurationRepository.getByRoleIdAndProductivePeriod(
      this.mongodb,
      roleId,
      productivePeriodYear,
      productivePeriodMonth,
    );
  }

  /**
   * @param {SheltiaCommissioningConfiguration} productConfiguration
   * @returns {Promise<SheltiaCommissioningConfiguration>}
   */
  addOrUpdateConfiguration(productConfiguration) {
    return configurationRepository.replace(this.mongodb, productConfiguration);
  }

  insertSeed() {
    return configurationRepository.insertSeed(this.mongodb, seed);
  }

  createIndexes() {
    return configurationRepository.createIndexes(this.mongodb);
  }
}

module.exports = SheltiaCommissioningConfigurationService;
