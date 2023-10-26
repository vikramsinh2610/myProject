const tcwCommissioningConfigurationRepository = require('./tcw-commissioning-configuration-repository');
const TcwCommissioningConfiguration = require('./tcw-commissioning-configuration');
const TcwCommissioningConfigurationDynamic = require('./tcw-commissioning-configuration-dynamic');
const { seed } = require('./seed/seed');

class TcwCommissioningConfigurationService {
  constructor(mongodb) {
    this.mongodb = mongodb;
  }

  /**
   * @param {string} roleId
   * @returns {Promise<TcwCommissioningConfiguration>}
   */
  getLastByRoleId(roleId) {
    return tcwCommissioningConfigurationRepository.getLastByRole(this.mongodb, roleId);
  }

  /**
   * @returns {Promise<TcwCommissioningConfigurationDynamic>}
   */
  getLast() {
    return tcwCommissioningConfigurationRepository.getLast(this.mongodb);
  }

  /**
   * @param {TcwCommissioningConfiguration} config
   */
  insert(config) {
    return tcwCommissioningConfigurationRepository.replace(this.mongodb, config);
  }

  addOrUpdateConfiguration(productConfiguration) {
    return tcwCommissioningConfigurationRepository.replace(this.mongodb, productConfiguration);
  }

  insertSeed() {
    return tcwCommissioningConfigurationRepository.insertSeed(this.mongodb, seed);
  }

  createIndexes() {
    return tcwCommissioningConfigurationRepository.createIndexes(this.mongodb);
  }
}

module.exports = TcwCommissioningConfigurationService;
