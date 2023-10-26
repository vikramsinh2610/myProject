const Mongo = require('mongodb');
const Knex = require('knex');
const Acquittance = require('./acquittance');
const DocumentService = require('../document-srv');
const PracticeService = require('../practice-srv');
const LegacyBridgeService = require('../legacy-bridge-srv');
const PracticeCommissionService = require('../practice-commission-srv');
const acquittanceRepository = require('./acquittance-repository');
const Payment = require('./payment');
const fsm = require('./acquittance-fsm');
const { parse, parseMetlife, parseNobis, parseZurich, parseItaliana, parseCf, parseCfLife } = require('./parser');
const { events } = require('./acquittance-events');
const { types: paymentTypes } = require('./payment-types');
const { types: practiceTypes } = require('../practice-srv/practice-types');
const { seed } = require('./seed/company-acquittance');
const tcwPayoutService = require('../tcw-payout-srv');
const sheltiaPayoutService = require('../sheltia-payout-srv');
const ProductConfigurationService = require('../product-configuration-srv');
const { calculatePayoutFromPayin } = require('../practice-commission-srv/utils');
require('../../utils/foreach');

class CompanyAcquittanceService {
  /**
   * @param {Mongo.Db} mongodb
   * @param {DocumentService} documentService
   * @param {Knex} sql
   */
  constructor(mongodb, documentService, sql) {
    this.mongodb = mongodb;
    this.sql = sql;
    this.documentService = documentService;
    this.practiceCommissionService = new PracticeCommissionService(mongodb, sql);
    this.practiceService = new PracticeService(mongodb);
    this.legacyBridgeService = new LegacyBridgeService(mongodb);
    this.tcwPayoutService = tcwPayoutService;
    this.sheltiaPayoutService = sheltiaPayoutService;
    this.productConfigurationService = new ProductConfigurationService(this.mongodb);
  }

  /**
   * @param {string} companyId
   * @param {string} companyName
   * @param {string} documentId
   * @returns {Promise<Acquittance>}
   */
  addAcquittance(companyId, companyName, documentId) {
    return this.documentService
      .getDocument(documentId)
      .then((doc) => this.documentService.getDocumentBuffer(doc))
      .then((buffer) => {
        if (companyName.toLowerCase().includes('metlife')) {
          return parseMetlife(buffer);
        }
        if (companyName.toLowerCase().includes('nobis')) {
          return parseNobis(buffer);
        }
        if (companyName.toLowerCase().includes('zurich')) {
          return parseZurich(buffer);
        }
        if (companyName.toLowerCase().includes('italiana')) {
          return parseItaliana(buffer);
        }
        if (companyName.toLowerCase().includes('cf') && companyName.toLowerCase().includes('life')) {
          return parseCfLife(buffer);
        }
        if (companyName.toLowerCase().includes('cf')) {
          return parseCf(buffer);
        }
        return parse(buffer);
      })
      .then((payments) =>
        acquittanceRepository.insert(
          this.mongodb,
          fsm.initState(
            new Acquittance({
              companyId,
              companyName,
              documentId,
              payments,
            }),
          ),
        ),
      );
  }

  /**
   * @param {string} acquittanceId
   * @returns {Promise<Acquittance>}
   */
  getAcquittance(acquittanceId) {
    return acquittanceRepository.get(this.mongodb, acquittanceId);
  }

  /**
   * @param {number} skip
   * @param {number} limit
   * @returns {Promise<Array<Acquittance>>}
   */
  getAllAcquittance(skip = 0, limit = 20) {
    return acquittanceRepository.getAll(this.mongodb, skip, limit);
  }

  /**
   * @param {Acquittance} acquittance
   * @param {string} edition
   * @returns {Promise<Acquittance>}
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  processAcquittance(acquittance, edition) {
    const confirmPromises = acquittance.payments.map((payment) =>
      this.practiceService.getPracticesByContractId(payment.contractId).then(async (practices) => {
        if (!practices || practices.length === 0)
          return new Payment({ ...payment, notFoundBase: true, status: 'non presente in BasePraticaApprovable' });

        let practice;
        if (payment.type === paymentTypes.SUBSCRIPTION || payment.type === paymentTypes.INCOME) {
          const practiceSub = practices.find((el) => el.type === practiceTypes.SUBSCRIPTION);
          if (!practiceSub)
            return new Payment({
              ...payment,
              notFoundBase: true,
              ok: false,
              notFoundPractice: false,
              alreadyConfirmed: false,
              alreadyPaid: false,
              errorPayin: false,
              status: 'presente in BasePraticaApprovable, ma tipo PraticaSottoscrizione non trovato',
            });
          practice = practiceSub;
        } else if (payment.type === practiceTypes.ADDITIONAL_INCOME) {
          let practiceAdditional;
          // eslint-disable-next-line prefer-const,max-len
          practiceAdditional = payment.practiceId
            ? practices.find((el) => el.practiceId === payment.practiceId)
            : practices.find(
                (el) =>
                  el.type === practiceTypes.ADDITIONAL_INCOME &&
                  payment.productivePeriodYear === el.effectProductivePeriodYear &&
                  payment.productivePeriodMonth === el.effectProductivePeriodMonth,
              );
          if (!practiceAdditional)
            return new Payment({
              ...payment,
              notFoundBase: true,
              ok: false,
              notFoundPractice: false,
              alreadyConfirmed: false,
              alreadyPaid: false,
              errorPayin: false,
              status: 'presente in BasePraticaApprovable, ma tipo VA non trovato o periodo produttivo diverso',
            });
          practice = practiceAdditional;
        } else {
          return new Payment({
            ...payment,
            notFoundBase: true,
            ok: false,
            notFoundPractice: false,
            alreadyConfirmed: false,
            alreadyPaid: false,
            errorPayin: false,
            status: `presente in BasePraticaApprovable, ma con tipo pratica non gestito ${payment.type}`,
          });
        }

        try {
          const entries = await this.practiceCommissionService.getEntriesByProductivePeriod(
            practice.practiceId,
            payment.productivePeriodYear,
            payment.productivePeriodMonth,
          );

          if (entries.length === 0)
            return new Payment({
              ...payment,
              notFoundPractice: true,
              ok: false,
              notFoundBase: false,
              alreadyConfirmed: false,
              alreadyPaid: false,
              errorPayin: false,
              status:
                'rata non presente in practice-commission: è stato fatto il sync? il numero delle rate corrisponde?',
            });

          // eslint-disable-next-line unicorn/no-reduce
          let calculatedPayin = entries.reduce((acc, item) => acc + item.payin, 0);

          if (!payment.ok && payment.errorPayin && (payment.manuallyModified || payment.select)) {
            const productConfig = await this.productConfigurationService.getByProductId(practice.productId);

            if (payment.manuallyModified) {
              calculatedPayin = payment.calculatedPayin;
            } else if (payment.select === 'calculated-value') {
              calculatedPayin = payment.calculatedPayin;
            } else {
              calculatedPayin = payment.payin;
            }

            let installmentsOnSubscription = 1;
            if (practice.installmentsPerYear === 12 || productConfig.productCode !== '17_AC TCW') {
              installmentsOnSubscription = Math.max(
                Math.ceil(productConfig.monthsOnSubscription / (12 / practice.installmentsPerYear)),
                1,
              );
            }

            // default is calculated payin per number of installments (tipically 12)
            let calculatedPayinRate = (calculatedPayin / entries.length) * entries[0].installmentsPerYear;

            // if advance and first installment, installmentsOnSubscription are in the first installments
            if (productConfig.advance && entries[0].installment === 1) {
              calculatedPayinRate =
                (calculatedPayin / entries.length / installmentsOnSubscription) * entries[0].installmentsPerYear;
            }

            // if companyAdvance and first installment, everything is in the first installment for the first year
            if (productConfig.companyAdvance && entries[0].installment === 1) {
              calculatedPayinRate = calculatedPayin;
            }

            try {
              const listPractice = await calculatePayoutFromPayin(
                edition === 'tcw' ? this.tcwPayoutService : this.sheltiaPayoutService,
                this.productConfigurationService,
                practice,
                calculatedPayinRate,
              );

              // @ts-ignore
              await entries.forEachAsync(async (e) => {
                const thisPractice = listPractice.find(
                  (el) => el.practiceId === e.practiceId && el.installment === e.installment,
                );
                const practiceCalculatedPayin = thisPractice ? thisPractice.payin : 0;
                const calculatedPayout = thisPractice ? thisPractice.payout : 0;
                const calculatedMargin = thisPractice ? thisPractice.margin : 0;

                await this.practiceCommissionService.updateInstallmentPayin(
                  practice.practiceId,
                  e.installment,
                  practiceCalculatedPayin,
                  calculatedPayout,
                  calculatedMargin,
                );
              });
            } catch {
              return new Payment({
                ...payment,
                alreadyConfirmed: false,
                ok: false,
                notFoundBase: false,
                notFoundPractice: false,
                alreadyPaid: false,
                errorPayin: true,
                status: 'errore nel calcolo del payout',
              });
            }
          }

          // Hide already confirmed installments
          if (entries[0].confirmed && !payment.ok)
            return new Payment({
              ...payment,
              calculatedPayin,
              alreadyConfirmed: true,
              ok: false,
              notFoundBase: false,
              notFoundPractice: false,
              alreadyPaid: false,
              errorPayin: false,
              status: 'rata già confermata da precedente allineamento quietanze',
            });

          if (Math.abs(payment.payin - calculatedPayin) > 50 && !payment.ok && !payment.select) {
            return new Payment({
              ...payment,
              ok: false,
              calculatedPayin,
              errorPayin: true,
              notFoundBase: false,
              notFoundPractice: false,
              alreadyConfirmed: false,
              alreadyPaid: false,
              status: 'il calcolo del payin differisce di più di .05€',
            });
          }

          if (!payment.ok) {
            const forecast = !payment.installmentDate;
            await Promise.all(
              entries.map((e) =>
                this.practiceCommissionService.confirmInstallment(
                  practice.practiceId,
                  e.installment,
                  forecast,
                  payment.installmentDate,
                ),
              ),
            );
          }
          return new Payment({
            ...payment,
            ok: true,
            notFoundBase: false,
            notFoundPractice: false,
            alreadyConfirmed: false,
            alreadyPaid: false,
            errorPayin: false,
            calculatedPayin,
            status: 'rata confermata, calcolo del payin combacia',
          });
        } catch (error) {
          return Promise.reject(error);
        }
      }),
    );

    try {
      const state = fsm.trigger(events.REFRESH, acquittance);
      return Promise.all(confirmPromises).then(async (payments) => {
        try {
          const updatedFields = {
            payments: payments.filter((p) => p !== undefined),
          };
          await acquittanceRepository.update(this.mongodb, acquittance._id, updatedFields);
          return Promise.resolve(new Acquittance({ ...state, ...updatedFields }));
        } catch (error) {
          return Promise.reject(error);
        }
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @param {Acquittance} acquittance
   */
  async confirmAcquittance(acquittance) {
    try {
      const state = fsm.trigger(events.CONFIRM, acquittance);

      await state.payments
        .filter((p) => !!p.installmentDate && p.type === paymentTypes.INCOME && p.ok)
        // @ts-ignore
        .forEachAsync(async (e) => {
          const incomePracticeId = await this.legacyBridgeService.addIncome(e);
          if (incomePracticeId) {
            const selectedPaymentIndex = state.payments.findIndex((el) => el._id === e._id);
            // eslint-disable-next-line security/detect-object-injection
            state.payments[selectedPaymentIndex] = { ...e, incomePracticeId };
          }
        });

      await acquittanceRepository.update(this.mongodb, acquittance._id, state);
      return Promise.resolve(state);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @param {Acquittance} acquittance
   */
  async unconfirmAcquittance(acquittance) {
    try {
      const state = fsm.trigger(events.UNCONFIRM, acquittance);

      await state.payments
        .filter((p) => p.incomePracticeId)
        // @ts-ignore
        .forEachAsync(async (e) => {
          await this.legacyBridgeService.removeIncome(e);
          const selectedPaymentIndex = state.payments.findIndex((el) => el._id === e._id);
          // eslint-disable-next-line security/detect-object-injection
          state.payments[selectedPaymentIndex] = { ...e, incomePracticeId: undefined };
        });

      await acquittanceRepository.update(this.mongodb, acquittance._id, state);
      return Promise.resolve(state);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @param {Acquittance} acquittance
   */
  async deleteAcquittance(acquittance) {
    try {
      const state = fsm.trigger(events.DELETE, acquittance);

      await acquittanceRepository.update(this.mongodb, acquittance._id, state);
      return Promise.resolve(state);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @param {Acquittance} acquittance
   */
  async updateAcquittance(acquittance) {
    try {
      const state = fsm.trigger(events.UPDATE, acquittance);

      await acquittanceRepository.update(this.mongodb, acquittance._id, state);
      return Promise.resolve(state);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  insertSeed() {
    return acquittanceRepository.insertSeed(this.mongodb, seed);
  }

  createIndexes() {
    return acquittanceRepository.createIndexes(this.mongodb);
  }
}

module.exports = CompanyAcquittanceService;
