const DossierInsurer = require('./dossier-insurer');
const dossierInsurerRepository = require('./dossier-insurer-repository');
const practiceOwnerRepository = require('../practice-owner-srv/practice-owner-repository');
const PracticeService = require('../practice-srv');
const { parse, dateToPeriod } = require('../../utils/productive-period-helper');
require('../../utils/foreach');

class DossierInsurerService {
  constructor(mongodb, sql = null) {
    this.mongodb = mongodb;
    this.sql = sql;
    this.practiceService = new PracticeService(this.mongodb);
  }

  /**
   * @param {number} skip
   * @param {number} limit
   * @param {object} filter
   * @returns {Promise<Array<DossierInsurer>>}
   */
  async getDossierInsurers(skip = 0, limit = 0, filter = {}) {
    return dossierInsurerRepository.getAll(this.mongodb, skip, limit, filter);
  }

  /**
   * @param {string} dossierId
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @returns {Promise<DossierInsurer>}
   */
  getDossierInsurer(dossierId, productivePeriodYear, productivePeriodMonth) {
    const id = DossierInsurer.buildId(dossierId, productivePeriodYear, productivePeriodMonth);
    return dossierInsurerRepository.get(this.mongodb, id).catch(async () => {
      try {
        const firstDossierInsurer = await dossierInsurerRepository.getFirst(this.mongodb, dossierId);

        const lastDossierInsurer = await dossierInsurerRepository.getLastBeforePeriodOrFirst(
            this.mongodb,
            dossierId,
            productivePeriodYear,
            productivePeriodMonth,
        );

        if (parse(productivePeriodYear, productivePeriodMonth) > dateToPeriod()) return lastDossierInsurer;

        if (
            parse(productivePeriodYear, productivePeriodMonth) <
            parse(firstDossierInsurer.productivePeriodYear, firstDossierInsurer.productivePeriodMonth)
        )
          return firstDossierInsurer;

        return dossierInsurerRepository.insert(this.mongodb, lastDossierInsurer);
      } catch (error) {
        return Promise.reject(error);
      }
    });
  }

  /**
   * @param {string} dossierId
   * @returns {Promise<DossierInsurer>}
   */
  getLastDossierInsurer(dossierId) {
    return dossierInsurerRepository.getLast(this.mongodb, dossierId);
  }

  /**
   * @param {string} dossierId
   * @returns {Promise<DossierInsurer>}
   */
  getFirstDossierInsurer(dossierId) {
    return dossierInsurerRepository.getFirst(this.mongodb, dossierId);
  }

  /**
   * @param {string} dossierId
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @returns {Promise<DossierInsurer | undefined>}
   */
  getDossierInsurerOrNull(dossierId, productivePeriodYear, productivePeriodMonth) {
    const id = DossierInsurer.buildId(dossierId, productivePeriodYear, productivePeriodMonth);
    // eslint-disable-next-line unicorn/no-useless-undefined
    return dossierInsurerRepository.get(this.mongodb, id).catch(async () => Promise.resolve(undefined));
  }

  addDossierInsurer(dossier) {
    const newDossier = {
      ...dossier,
      _id: DossierInsurer.buildId(dossier.dossierId, dossier.productivePeriodYear, dossier.productivePeriodMonth),
    };
    return dossierInsurerRepository.insert(this.mongodb, newDossier);
  }

  async removePromoterOfNodeId(nodeId, productivePeriodYear, productivePeriodMonth) {
    const dossiers = await dossierInsurerRepository.getDossiersByFilter(this.mongodb, { networkNodeId: nodeId });

    // @ts-ignore
    await dossiers.forEachAsync(async (dossier) => {
      const lastDossier = await this.getDossierInsurer(dossier._id, productivePeriodYear, productivePeriodMonth);
      if (lastDossier && lastDossier.networkNodeId === nodeId) {
        const newDossier = {
          ...lastDossier,
          promoterId: null,
          productivePeriodYear,
          productivePeriodMonth,
          _id: `${dossier._id}-${parse(productivePeriodYear, productivePeriodMonth)}`,
        };
        await practiceOwnerRepository.insert(this.sql, newDossier);
        await dossierInsurerRepository.insert(this.mongodb, newDossier);
      }
    });
  }

  async changePromoterOfNodeId(nodeId, promoterId, productivePeriodYear, productivePeriodMonth) {
    const dossiers = await dossierInsurerRepository.getDossiersByFilter(this.mongodb, { networkNodeId: nodeId });

    // @ts-ignore
    await dossiers.forEachAsync(async (dossier) => {
      const lastDossier = await this.getDossierInsurer(dossier._id, productivePeriodYear, productivePeriodMonth);
      if (lastDossier && lastDossier.networkNodeId === nodeId) {
        const newDossier = {
          ...lastDossier,
          promoterId,
          productivePeriodYear,
          productivePeriodMonth,
          _id: `${dossier._id}-${parse(productivePeriodYear, productivePeriodMonth)}`,
        };
        await practiceOwnerRepository.insert(this.sql, newDossier);
        await dossierInsurerRepository.insert(this.mongodb, newDossier);
      }
    });
  }

  async changeNodeIdOfNodeId(nodeId, previousNodeId, productivePeriodYear, productivePeriodMonth) {
    const dossiers = await dossierInsurerRepository.getDossiersByFilter(this.mongodb, {
      networkNodeId: previousNodeId,
    });

    // @ts-ignore
    await dossiers.forEachAsync(async (dossier) => {
      const lastDossier = await this.getDossierInsurer(dossier._id, productivePeriodYear, productivePeriodMonth);
      if (lastDossier && lastDossier.networkNodeId === previousNodeId) {
        const newDossier = {
          ...lastDossier,
          networkNodeId: nodeId,
          productivePeriodYear,
          productivePeriodMonth,
          _id: `${dossier._id}-${parse(productivePeriodYear, productivePeriodMonth)}`,
        };
        await practiceOwnerRepository.insert(this.sql, newDossier);
        await dossierInsurerRepository.insert(this.mongodb, newDossier);
      }
    });
  }

  async existNodeId(nodeId, productivePeriodYear, productivePeriodMonth) {
    const dossiers = await dossierInsurerRepository.getDossiersByFilter(this.mongodb, {
      networkNodeId: nodeId,
      productivePeriodYear,
      productivePeriodMonth,
    });

    return dossiers.length > 0;
  }

  async existPromoterId(promoterId, productivePeriodYear, productivePeriodMonth) {
    const dossiers = await dossierInsurerRepository.getDossiersByFilter(this.mongodb, {
      promoterId,
      productivePeriodYear,
      productivePeriodMonth,
    });

    return dossiers.length > 0;
  }

  async changeNodeIdOfPromoterId(nodeId, promoterId, productivePeriodYear, productivePeriodMonth) {
    const dossiers = await dossierInsurerRepository.getDossiersByFilter(this.mongodb, {
      promoterId,
    });

    // @ts-ignore
    await dossiers.forEachAsync(async (dossier) => {
      const lastDossier = await this.getDossierInsurer(dossier._id, productivePeriodYear, productivePeriodMonth);
      if (lastDossier && lastDossier.promoterId === promoterId) {
        const newDossier = {
          ...lastDossier,
          networkNodeId: nodeId,
          productivePeriodYear,
          productivePeriodMonth,
          _id: `${dossier._id}-${parse(productivePeriodYear, productivePeriodMonth)}`,
        };
        await dossierInsurerRepository.insert(this.mongodb, newDossier);
      }
    });
  }

  async changeNodePromoterOfCustomer(customerId, nodeId, promoterId, productivePeriodYear, productivePeriodMonth) {
    const dossiers = await this.practiceService.getPracticesByCustomerId(customerId);

    // @ts-ignore
    await dossiers.forEachAsync(async (dossier) => {
      const newDossier = {
        dossierId: dossier.dossierId,
        networkNodeId: nodeId,
        promoterId,
        productivePeriodYear,
        productivePeriodMonth,
        _id: `${dossier.dossierId}-${parse(productivePeriodYear, productivePeriodMonth)}`,
      };

      await practiceOwnerRepository.insert(this.sql, newDossier);
      await dossierInsurerRepository.insert(this.mongodb, newDossier);
    });
  }

  createIndexes() {
    return dossierInsurerRepository.createIndexes(this.mongodb);
  }
}

module.exports = DossierInsurerService;
