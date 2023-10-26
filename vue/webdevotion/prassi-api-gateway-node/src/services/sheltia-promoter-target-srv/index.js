const promoterTargetRepository = require('./sheltia-promoter-target-repository');
const SheltiaPromoterTarget = require('./sheltia-promoter-target');
const { seed } = require('./seed/seed');

class SheltiaCommissioningConfigurationService {
  constructor(mongodb) {
    this.mongodb = mongodb;
  }

  /**
   * @param {string} promoterId
   * @param {number} year
   * @returns {Promise<Array<SheltiaPromoterTarget>>}
   */
  getByPromoterIdAndYear(promoterId, year) {
    return promoterTargetRepository.getByPromoterIdAndYear(this.mongodb, promoterId, year);
  }

  /**
   * @param {string} promoterId
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @param {string} roleId
   * @returns {Promise<SheltiaPromoterTarget>}
   */
  getByPromoterIdAndProductivePeriod(promoterId, productivePeriodYear, productivePeriodMonth, roleId) {
    // Temporary Workaround: get Target from Legacy
    return promoterTargetRepository.getByPromoterIdAndProductivePeriodFromLegacy(
      this.mongodb,
      promoterId,
      productivePeriodYear,
      productivePeriodMonth,
      roleId,
    );
    /* return promoterTargetRepository.getByPromoterIdAndProductivePeriod(
      this.mongodb,
      promoterId,
      productivePeriodYear,
      productivePeriodMonth,
    ); */
  }

  /**
   * @param {SheltiaPromoterTarget} productConfiguration
   * @returns {Promise<SheltiaPromoterTarget>}
   */
  addOrUpdateConfiguration(productConfiguration) {
    return promoterTargetRepository.replace(this.mongodb, productConfiguration);
  }

  insertSeed() {
    return promoterTargetRepository.insertSeed(this.mongodb, seed);
  }

  createIndexes() {
    return promoterTargetRepository.createIndexes(this.mongodb);
  }
}

module.exports = SheltiaCommissioningConfigurationService;
