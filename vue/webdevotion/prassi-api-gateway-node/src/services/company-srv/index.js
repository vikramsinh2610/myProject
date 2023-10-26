const Company = require('./company');
const companyRepository = require('./company-repository');
const { seed } = require('./seed/company');

class CompanyService {
  constructor(mongodb) {
    this.mongodb = mongodb;
  }

  /**
   * @returns {Promise<Array<Company>>}
   */
  getCompanies() {
    return companyRepository.getAll(this.mongodb);
  }

  /**
   * @param {string} companyId
   * @returns {Promise<Company>}
   */
  getCompany(companyId) {
    return companyRepository.getById(this.mongodb, companyId);
  }

  insertSeed() {
    return companyRepository.insertSeed(this.mongodb, seed);
  }

  createIndexes() {
    return companyRepository.createIndexes(this.mongodb);
  }
}

module.exports = CompanyService;
