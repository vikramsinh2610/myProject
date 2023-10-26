const PromoterJob = require('./promoter-job');
const promoterJobRepository = require('./promoter-job-repository');
const promoterRepository = require('../promoter-srv/promoter-repository');
const { mapNetworkToAuthRole } = require('./role-ids');
const { seed: tcwSeed } = require('./seed/tcw');
const { seed: sheltiaSeed } = require('./seed/sheltia');

class PromoterJobService {
  constructor(mongodb) {
    this.mongodb = mongodb;
  }

  /**
   * @param {string} promoterId
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @returns {Promise<PromoterJob>}
   */
  getPromoterJob(promoterId, productivePeriodYear, productivePeriodMonth) {
    return promoterJobRepository.get(this.mongodb, promoterId, productivePeriodYear, productivePeriodMonth);
  }

  /**
   * @param {string} promoterId
   * @returns {Promise<PromoterJob>}
   */
  getOnePromoterJob(promoterId) {
    return promoterJobRepository.getOne(this.mongodb, promoterId);
  }

  getAllPromoterJobs(promoterId) {
    return promoterJobRepository.getList(this.mongodb, promoterId);
  }

  getLastPromoterJob(promoterId) {
    return promoterJobRepository.get(this.mongodb, promoterId, 2099, 12);
  }

  // eslint-disable-next-line jsdoc/require-param
  /**
   * @param {*} params
   * @returns {Promise<PromoterJob>}
   */
  async updatePromoterJob({ promoterId, fromProductivePeriodYear, fromProductivePeriodMonth, roleId }) {
    const promoterJob = new PromoterJob({
      promoterId,
      fromProductivePeriodYear,
      fromProductivePeriodMonth,
      roleId,
    });
    await promoterRepository.saveUserRole(this.mongodb, promoterId, await mapNetworkToAuthRole(this.mongodb, roleId));
    return promoterJobRepository.insert(this.mongodb, promoterJob);
  }

  async updatePromoterJobs(promoterId, jobs) {
    await promoterJobRepository.remove(this.mongodb, promoterId);

    await jobs.forEachAsync((item) => {
        const promoterJob = new PromoterJob({
          promoterId,
          fromProductivePeriodYear: item.fromProductivePeriodYear,
          fromProductivePeriodMonth: item.fromProductivePeriodMonth,
          roleId: item.roleId,
        });
        promoterJobRepository.insert(this.mongodb, promoterJob);
    });

    return jobs;
  }

  insertSeed(edition) {
    const seed = edition === 'tcw' ? tcwSeed : sheltiaSeed;
    return promoterJobRepository.insertSeed(this.mongodb, seed);
  }

  createIndexes() {
    return promoterJobRepository.createIndexes(this.mongodb);
  }
}

module.exports = PromoterJobService;
