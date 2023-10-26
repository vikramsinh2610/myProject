const tcwCommissioningConfigurationDynamicRepository = require('./tcw-commissioning-configuration-dynamic-repository');
const TcwCommissioningConfigurationDynamic = require('./tcw-commissioning-configuration-dynamic');
const { seed } = require('./seed/seed');

class TcwCommissioningConfigurationDynamicService {
  constructor(mongodb) {
    this.mongodb = mongodb;
  }

  /**
   * @param {string} roleId
   * @returns {Promise<TcwCommissioningConfigurationDynamic>}
   */
  getLastByRoleId(roleId) {
    return tcwCommissioningConfigurationDynamicRepository.getLastByRole(this.mongodb, roleId);
  }

  /**
   * @param {TcwCommissioningConfigurationDynamic} config
   */
  insert(config) {
    return tcwCommissioningConfigurationDynamicRepository.replace(this.mongodb, config);
  }

  addOrUpdateConfiguration(productConfiguration) {
    return tcwCommissioningConfigurationDynamicRepository.replace(this.mongodb, productConfiguration);
  }

  insertSeed() {
    return tcwCommissioningConfigurationDynamicRepository.insertSeed(this.mongodb, seed);
  }

  createIndexes() {
    return tcwCommissioningConfigurationDynamicRepository.createIndexes(this.mongodb);
  }
}

module.exports = TcwCommissioningConfigurationDynamicService;
