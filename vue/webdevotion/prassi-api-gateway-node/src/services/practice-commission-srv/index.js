const Mongo = require('mongodb');
const Knex = require('knex');
const Practice = require('../practice-srv/practice');
const payinService = require('../payin-srv');
const tcwPayoutService = require('../tcw-payout-srv');
const sheltiaPayoutService = require('../sheltia-payout-srv');
const ProductConfigurationService = require('../product-configuration-srv');
const DossierInsurerService = require('../dossier-insurer-srv');
const NetworkService = require('../network-srv');
const { generatePracticeFees } = require('./utils');
const practiceFeeRepository = require('./practice-commission-installment-repository');
const productivePeriodHelper = require('../../utils/productive-period-helper');
const CommissionInstallment = require('./commission-installment');
const { parse } = require('../../utils/productive-period-helper');
require('../../utils/foreach');

class PracticeFeeService {
  /**
   * @param {Mongo.Db} mongodb
   * @param {Knex} sql
   *
   */
  constructor(mongodb, sql) {
    this.mongodb = mongodb;
    this.sql = sql;
    this.productConfigurationService = new ProductConfigurationService(this.mongodb);
    this.dossierInsurerService = new DossierInsurerService(this.mongodb, sql);
    this.networkService = new NetworkService(this.mongodb);
    this.payinService = payinService;
    this.tcwPayoutService = tcwPayoutService;
    this.sheltiaPayoutService = sheltiaPayoutService;
    this.nodeListMap = new Map();
  }

  /**
   * @param {Practice} practice
   * @param {string} edition
   * @param {boolean} overrideConfirmed
   */
  addNewPractice(practice, edition, overrideConfirmed = false) {
    return practiceFeeRepository
      .removeEntries(this.mongodb, this.sql, practice.practiceId, edition, overrideConfirmed)
      .then(async (lastInstallment) => {
        try {
          const entries = await generatePracticeFees(
            this.payinService,
            edition === 'tcw' ? this.tcwPayoutService : this.sheltiaPayoutService,
            this.productConfigurationService,
            practice,
          );
          return Promise.resolve(entries.filter((d) => d.installment >= lastInstallment));
        } catch (error) {
          return Promise.reject(error);
        }
      })
      .then(async (entries) => {
        if (entries.length > 0) {
          if (edition !== 'sheltia' && !overrideConfirmed) {
            const changedEntries = [];

            // @ts-ignore
            await entries.forEachAsync(async (entry) => {
              // eslint-disable-next-line promise/no-nesting
              const installment = await practiceFeeRepository
                .getByPracticeIdAndInstallment(this.mongodb, this.sql, entry.practiceId, entry.installment)
                .then((res) => res)
                .catch(() => ({ paymentDate: null, confirmed: false, payin: 0, margin: 0, payout: 0 }));

              if (installment.confirmed) {
                const changedEntry = {
                  ...entry,
                  paymentDate: installment.paymentDate,
                  confirmed: installment.confirmed,
                  payin: installment.payin,
                  margin: installment.margin,
                  payout: installment.payout,
                };
                changedEntries.push(changedEntry);
              } else {
                changedEntries.push(entry);
              }
            });

            await practiceFeeRepository.removeEntries(this.mongodb, this.sql, practice.practiceId, edition, true);

            // @ts-ignore
            await changedEntries.forEachAsync(async (changedEntry) => {
              await practiceFeeRepository.insertPractice(this.sql, changedEntry);
            });
          } else {
            // @ts-ignore
            await entries.forEachAsync(async (entry) => {
              await practiceFeeRepository.insertPractice(this.sql, entry);
            });
          }
        }
        return Promise.resolve([]);
      });
  }

  /**
   * @param {string} practiceId
   */
  removePractice(practiceId) {
    return practiceFeeRepository
      .removeEntries(this.mongodb, this.sql, practiceId, 'tcw', true)
      .then(() => Promise.resolve());
  }

  /**
   *
   * @param {*} practiceId
   * @param {*} productivePeriodYear
   * @param {*} productivePeriodMonth
   * @returns {Promise<Array<CommissionInstallment>>}
   */
  getEntriesByProductivePeriod(practiceId, productivePeriodYear, productivePeriodMonth) {
    return practiceFeeRepository.getByPracticeIdsAndProductivePeriods(
      this.mongodb,
      this.sql,
      practiceId,
      productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth),
    );
  }

  getInstallment(practiceId, installment, dossierId, productivePeriodYear, productivePeriodMonth) {
    return Promise.all([
      practiceFeeRepository.getByPracticeIdAndInstallment(this.mongodb, this.sql, practiceId, installment),
      this.dossierInsurerService.getDossierInsurer(dossierId, productivePeriodYear, productivePeriodMonth),
    ]).then(async ([commissionInstallment, dossierInsurer]) => {
      const dossierPeriod = parse(productivePeriodYear, productivePeriodMonth);
      let nodeList = this.nodeListMap.get(dossierPeriod);
      if (!nodeList) {
        nodeList = await this.networkService.getNetworkListFlatPeriod(
          7,
          '',
          productivePeriodYear,
          productivePeriodMonth,
          true,
        );
        this.nodeListMap.set(dossierPeriod, nodeList);
      }

      const nodeOriginalPeriod = nodeList.find((item) => item._id === dossierInsurer.networkNodeId);
      if (!nodeOriginalPeriod)
        throw new Error(
          `rete non trovata per dossier ${dossierInsurer.dossierId} nodo ${dossierInsurer.networkNodeId}`,
        );

      return new CommissionInstallment({
        ...commissionInstallment,
        insurerId: nodeOriginalPeriod.validPromoterId,
      });
    });
  }

  getInstallmentAll(practiceId, installment, dossierId, productivePeriodYear, productivePeriodMonth) {
    return Promise.all([
      practiceFeeRepository.getByPracticeIdAndInstallmentAll(this.mongodb, this.sql, practiceId, installment),
      this.dossierInsurerService.getDossierInsurer(dossierId, productivePeriodYear, productivePeriodMonth),
    ]).then(
      // eslint-disable-next-line sonarjs/no-identical-functions
      async ([commissionInstallment, dossierInsurer]) => {
        const dossierPeriod = parse(productivePeriodYear, productivePeriodMonth);
        let nodeList = this.nodeListMap.get(dossierPeriod);
        if (!nodeList) {
          nodeList = await this.networkService.getNetworkListFlatPeriod(
            7,
            '',
            productivePeriodYear,
            productivePeriodMonth,
            true,
          );
          this.nodeListMap.set(dossierPeriod, nodeList);
        }

        const nodeOriginalPeriod = nodeList.find((item) => item._id === dossierInsurer.networkNodeId);
        if (!nodeOriginalPeriod)
          throw new Error(
            `rete non trovata per dossier ${dossierInsurer.dossierId} nodo ${dossierInsurer.networkNodeId}`,
          );

        return new CommissionInstallment({
          ...commissionInstallment,
          insurerId: nodeOriginalPeriod.validPromoterId,
        });
      },
    );
  }

  setInstallmentAsPaid(installmentId, insurerId, payout, reminder, commissioningId) {
    return practiceFeeRepository.updateMany(this.mongodb, this.sql, [installmentId], {
      reminder,
      insurerId,
      payout,
      paidToNetwork: true,
      forecast: false,
      commissioningId,
    });
  }

  setInstallmentAsUnpaid(installmentId) {
    return practiceFeeRepository.updateMany(this.mongodb, this.sql, [installmentId], {
      reminder: 0,
      insurerId: undefined,
      paidToNetwork: false,
      forecast: true,
      commissioningId: undefined,
    });
  }

  setCommissioningIdInstallmentAsUnpaid(commissioningId) {
    return practiceFeeRepository.updateManyCommissioningId(this.mongodb, this.sql, commissioningId, {
      reminder: 0,
      insurerId: undefined,
      paidToNetwork: false,
      forecast: true,
      commissioningId: undefined,
    });
  }

  /**
   * @param {string} practiceId
   * @param {number} installment
   * @param {boolean} forecast
   * @param {Date} paymentDate
   */
  confirmInstallment(practiceId, installment, forecast, paymentDate) {
    return practiceFeeRepository.confirmInstallment(
      this.mongodb,
      this.sql,
      practiceId,
      installment,
      forecast,
      paymentDate,
    );
  }

  /**
   * @param {string} id
   */
  setInstallmentConfirmed(id) {
    return practiceFeeRepository.setInstallmentConfirmed(this.mongodb, this.sql, id);
  }

  /**
   * @param {string} id
   */
  setInstallmentPaid(id) {
    return practiceFeeRepository.setInstallmentPaid(this.mongodb, this.sql, id);
  }

  /**
   * @param {string} id
   */
  setInstallmentUnConfirmed(id) {
    return practiceFeeRepository.setInstallmentUnConfirmed(this.mongodb, this.sql, id);
  }

  /**
   * @param {string} id
   */
  setInstallmentUnPaid(id) {
    return practiceFeeRepository.setInstallmentUnPaid(this.mongodb, this.sql, id);
  }

  /**
   * @param {string} practiceId
   * @param {number} installment
   * @param {number} payin
   * @param {number} payout
   * @param {number} margin
   */
  updateInstallmentPayin(practiceId, installment, payin, payout, margin) {
    return practiceFeeRepository.updateInstallmentPayin(
      this.mongodb,
      this.sql,
      practiceId,
      installment,
      payin,
      payout,
      margin,
    );
  }

  /**
   * @param {string} dossierId
   * @param {number} companyId
   * @param {number} companyName
   * @param {number} customerId
   * @param {number} insuredName
   * @param {number} postForce
   */
  updateInstallmentFix(dossierId, companyId, companyName, customerId, insuredName, postForce) {
    return practiceFeeRepository.updateInstallmentFix(
      this.mongodb,
      this.sql,
      dossierId,
      companyId,
      companyName,
      customerId,
      insuredName,
      postForce,
    );
  }
}

module.exports = PracticeFeeService;
