const Promoter = require('./promoter');
const promoterRepository = require('./promoter-repository');
const { seed } = require('./seed/promoter');

class PromoterService {
  constructor(mongodb) {
    this.mongodb = mongodb;
  }

  /**
   * @param {string} promoterId
   * @returns {Promise<Promoter>}
   */
  getPromoterById(promoterId) {
    return promoterRepository.getById(this.mongodb, promoterId);
  }

  /**
   * @param {string} serialNumber
   * @returns {Promise<Promoter>}
   */
  getPromoterBySerialNumber(serialNumber) {
    return promoterRepository.getBySerialNumber(this.mongodb, serialNumber);
  }

  /**
   * @param {number} skip
   * @param {number} limit
   * @param {object} filter
   * @param {string} sortBy
   * @param {number} sortDirection
   * @returns {Promise<Array<Promoter>>}
   */
  getPromoters(skip = 0, limit = 0, filter = {}, sortBy = 'name', sortDirection = 1) {
    return promoterRepository.getAll(this.mongodb, skip, limit, filter, sortBy, sortDirection);
  }

  /**
   * @param {object} promoter
   */
  updateMobilePhone(promoter) {
    return promoterRepository.updateMobilePhone(this.mongodb, promoter);
  }

  /**
   * @param {Array<string>} promoterIds
   * @returns {Promise<Array<Promoter>>}
   */
  getByIds(promoterIds) {
    return promoterRepository.getByIds(this.mongodb, promoterIds);
  }

  insertSeed() {
    return promoterRepository.insertSeed(this.mongodb, seed);
  }

  createIndexes() {
    return promoterRepository.createIndexes(this.mongodb);
  }
}

module.exports = PromoterService;
