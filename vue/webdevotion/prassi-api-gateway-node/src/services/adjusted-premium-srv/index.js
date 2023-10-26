const adjustedRepository = require('./adjusted-premium-repository');
const AdjustedPremiumConfiguration = require('./adjusted-premium-configuration');
const { seed } = require('./seed/adjusted-premium-configurations');

class AdjustedPremiumService {
  constructor(mongodb) {
    this.mongodb = mongodb;
  }

  /**
   * @param {string} id
   * @returns {Promise<AdjustedPremiumConfiguration>}
   */
  getById(id) {
    return adjustedRepository.getById(this.mongodb, id);
  }

  /**
   * @returns {Promise<object>}
   */
  insertSeed() {
    return adjustedRepository.insertSeed(this.mongodb, seed);
  }

  /**
   * @returns {Promise<object>}
   */
  createIndexes() {
    return adjustedRepository.createIndexes(this.mongodb);
  }

  /**
   * @param {AdjustedPremiumConfiguration} adjustedPremiumConfiguration
   * @returns {Promise<AdjustedPremiumConfiguration>}
   */
  addOrUpdateConfiguration(adjustedPremiumConfiguration) {
    return adjustedRepository.replace(this.mongodb, adjustedPremiumConfiguration);
  }
}

module.exports = AdjustedPremiumService;
