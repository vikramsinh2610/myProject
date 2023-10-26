const configurationRepository = require('./menu-permissions-repository');
const MenuPermissionsConfiguration = require('./menu-permissions-configuration');
const { seed } = require('./seed/seed');

class MenuPermissionsConfigurationService {
  constructor(mongodb) {
    this.mongodb = mongodb;
  }

  /**
   * @returns {Promise<MenuPermissionsConfiguration>}
   */
  getLast() {
    // @ts-ignore
    return configurationRepository.getLast(this.mongodb);
  }

  /**
   * @param {MenuPermissionsConfiguration} config
   */
  insert(config) {
    return configurationRepository.replace(this.mongodb, config);
  }

  /**
   * @param {MenuPermissionsConfiguration} productConfiguration
   * @returns {Promise<MenuPermissionsConfiguration>}
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

module.exports = MenuPermissionsConfigurationService;
