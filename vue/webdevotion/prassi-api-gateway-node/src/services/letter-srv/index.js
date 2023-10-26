const Mongo = require('mongodb');
const Knex = require('knex');
const BonusLetter = require('./bonus/bonus-letter');
const Letter = require('./letter');
const PromoterService = require('../promoter-srv');
const KpiService = require('../kpi-srv');
const letterRepository = require('./letter-repository');
const { getTypedLetter } = require('./template-builder');
const fsm = require('./letter-fsm');
const { events } = require('./letter-events');
const bonusCalculator = require('./bonus/bonus-calculator');
const { seed } = require('./seed/letter');
const PromoterJobService = require('../promoter-job-srv');
const DocumentService = require('../document-srv');
const AccountingService = require('../accounting-srv');
const AccountingNote = require('../accounting-srv/accounting-note');
const AccountingNoteType = require('../accounting-srv/note-type');
const NoteBonusAdditionalData = require('../accounting-srv/note-additional-data/bonus-letter-additional-data');
const NoteDebitAdditionalData = require('../accounting-srv/note-additional-data/debit-additional-data');
const NodeCommissionAdditionalData = require('../accounting-srv/note-additional-data/commission-additional-data');
const SheltiaCommissioningService = require('../sheltia-commissioning-srv');
const { types: letterTypes } = require('./letter-types');
const productivePeriodHelper = require('../../utils/productive-period-helper');
require('../../utils/foreach');

class LetterService {
  /**
   * @param {Mongo.Db} mongodb
   * @param {any} log
   * @param {Knex} sql
   *
   */
  constructor(mongodb, log, sql) {
    this.mongodb = mongodb;
    this.log = log;
    this.promoterService = new PromoterService(mongodb);
    this.kpiService = new KpiService(mongodb, sql);
    this.promoterJobService = new PromoterJobService(mongodb);
    this.accountingService = new AccountingService(mongodb);
    this.sheltiaCommissioningService = new SheltiaCommissioningService(mongodb, sql);
  }

  /**
   * @param {string} promoterId
   * @param {string} letterId
   */
  getLetter(promoterId, letterId) {
    return letterRepository.getById(this.mongodb, letterId, promoterId);
  }

  /**
   * @param {string} promoterId
   * @param {string} letterType
   * @returns {Promise<Letter>}
   */
  createLetter(promoterId, letterType) {
    return Promise.all([this.promoterService.getPromoterById(promoterId), letterRepository.getNextId(this.mongodb)])
      .then(
        ([promoter, _id]) =>
          new Letter({
            _id,
            status: 'wip',
            promoterId: promoter._id,
            promoterSerialNumber: promoter.serialNumber,
            promoterDisplayName: `${promoter.name} ${promoter.surname}`,
          }),
      )
      .then((letter) => Promise.resolve(getTypedLetter(letter, { type: letterType })))
      .then((letter) => letterRepository.insert(this.mongodb, letter));
  }

  /**
   * @param {string} letterId
   * @param {string} promoterId
   * @param {object} changes
   * @returns {Promise<Letter|BonusLetter>}
   */
  updateLetter(letterId, promoterId, changes) {
    return letterRepository
      .getById(this.mongodb, letterId, promoterId)
      .then((letter) => Promise.resolve(getTypedLetter(letter, changes)))
      .then((letter) => letterRepository.replace(this.mongodb, letter));
  }

  /**
   * @param {string} letterId
   * @param {string} promoterId
   */
  delete(letterId, promoterId) {
    return letterRepository
      .getById(this.mongodb, letterId, promoterId)
      .then((letter) => fsm.trigger(events.DELETE, letter))
      .then((letter) => letterRepository.replace(this.mongodb, letter));
  }

  /**
   * @param {string} letterId
   * @param {string} promoterId
   * @param {DocumentService} documentService
   */
  async activate(letterId, promoterId, documentService) {
    try {
      const letter = await letterRepository.getById(this.mongodb, letterId, promoterId);
      if (letter.type === letterTypes.JOB) {
        const overlappingLettersCount = await letterRepository.countOverlappingLetters(this.mongodb, letter);
        if (overlappingLettersCount > 0) {
          return Promise.reject(new Error('Non puoi attivare lettere di incarico contemporaneamente'));
        }
      }
      await Promise.all(letter.attachmentIds.map((documentId) => documentService.lockDocument(documentId)));
      return letterRepository.replace(this.mongodb, fsm.trigger(events.ACTIVATE, letter)).then(() => letter);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @param {string} letterId
   * @param {string} promoterId
   */
  inactivate(letterId, promoterId) {
    return letterRepository
      .getById(this.mongodb, letterId, promoterId)
      .then((letter) => fsm.trigger(events.INACTIVATE, letter))
      .then((letter) => letterRepository.replace(this.mongodb, letter));
  }

  /**
   * @param {Letter} letter
   * @returns {Promise<Letter>}
   */
  expire(letter) {
    return letterRepository.replace(this.mongodb, fsm.trigger(events.EXPIRES, letter));
  }

  /**
   * @param {Date} date
   * @returns {Promise<Array<Letter>>}
   */
  expireLetters(date) {
    return letterRepository
      .getOverdueLetters(this.mongodb, date)
      .then((letters) => Promise.all(letters.map((letter) => this.expire(letter))));
  }

  /**
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @returns {Promise}
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async processCommissioningLetters(productivePeriodYear, productivePeriodMonth) {
    const isQuarter = productivePeriodMonth % 3 === 0;
    const isSemester = productivePeriodMonth % 6 === 0;
    const productivePeriod = productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth);
    this.log.info('isQuarter', isQuarter);
    this.log.info('isSemester', isSemester);
    this.log.info('productivePeriod', productivePeriod);

    const targetProductivePeriod2 = productivePeriodHelper.addMonths(
      productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth),
      -1,
    );
    const targetProductivePeriod3 = productivePeriodHelper.addMonths(
      productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth),
      -2,
    );
    const targetProductivePeriod4 = productivePeriodHelper.addMonths(
      productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth),
      -3,
    );
    const targetProductivePeriod5 = productivePeriodHelper.addMonths(
      productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth),
      -4,
    );
    const targetProductivePeriod6 = productivePeriodHelper.addMonths(
      productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth),
      -5,
    );

    const processPasRappel = async (letter, dataObject) => {
      if (isSemester) {
        let monthAverageFactor = 0;
        const stat1 = await this.sheltiaCommissioningService.getPromoterStats(
          productivePeriodYear,
          productivePeriodMonth,
          letter.promoterId,
        );
        if (stat1._id !== 'no-result') monthAverageFactor += 1;

        this.log.info('isSemester', isSemester);
        const stat2 = await this.sheltiaCommissioningService.getPromoterStats(
          productivePeriodHelper.unparse(targetProductivePeriod2).productivePeriodYear,
          productivePeriodHelper.unparse(targetProductivePeriod2).productivePeriodMonth,
          letter.promoterId,
        );
        if (stat2._id !== 'no-result') monthAverageFactor += 1;

        const stat3 = await this.sheltiaCommissioningService.getPromoterStats(
          productivePeriodHelper.unparse(targetProductivePeriod3).productivePeriodYear,
          productivePeriodHelper.unparse(targetProductivePeriod3).productivePeriodMonth,
          letter.promoterId,
        );
        if (stat3._id !== 'no-result') monthAverageFactor += 1;

        const stat4 = await this.sheltiaCommissioningService.getPromoterStats(
          productivePeriodHelper.unparse(targetProductivePeriod4).productivePeriodYear,
          productivePeriodHelper.unparse(targetProductivePeriod4).productivePeriodMonth,
          letter.promoterId,
        );
        if (stat4._id !== 'no-result') monthAverageFactor += 1;

        const stat5 = await this.sheltiaCommissioningService.getPromoterStats(
          productivePeriodHelper.unparse(targetProductivePeriod5).productivePeriodYear,
          productivePeriodHelper.unparse(targetProductivePeriod5).productivePeriodMonth,
          letter.promoterId,
        );
        if (stat5._id !== 'no-result') monthAverageFactor += 1;

        const stat6 = await this.sheltiaCommissioningService.getPromoterStats(
          productivePeriodHelper.unparse(targetProductivePeriod6).productivePeriodYear,
          productivePeriodHelper.unparse(targetProductivePeriod6).productivePeriodMonth,
          letter.promoterId,
        );
        if (stat6._id !== 'no-result') monthAverageFactor += 1;

        // no stat means promoter must not be elaborated
        if (monthAverageFactor === 0) return;

        const totalIv = Math.round(
          stat1.totalIv + stat2.totalIv + stat3.totalIv + stat4.totalIv + stat5.totalIv + stat6.totalIv,
        );
        const avgMonthlyIv = Math.round(totalIv / monthAverageFactor);

        this.log.info('avgMonthlyIv', avgMonthlyIv);
        this.log.info('totalIv', totalIv);

        const quarterRow = dataObject.quarterTargetTableRows.find(
          (r) => avgMonthlyIv >= r.from && avgMonthlyIv <= r.to,
        );

        const quarterAmount =
          Math.round((totalIv * quarterRow.percentage) / 10000) -
          Math.round(
            stat1.totalAmount +
              stat2.totalAmount +
              stat3.totalAmount +
              stat4.totalAmount +
              stat5.totalAmount +
              stat6.totalAmount,
          );

        if (quarterRow && quarterAmount > 0) {
          this.log.info('quarterRow', quarterRow);
          await this.accountingService.addAccountingNote(
            new AccountingNote({
              promoterId: letter.promoterId,
              ...(letter.invoiceDescription
                ? { description: letter.invoiceDescription }
                : { description: 'Rappel semestrale' }),
              productivePeriodYear,
              productivePeriodMonth,
              type: AccountingNoteType.COMMISSION,
              origin: 'target+',
              invoicingId: productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth).toString(),
              amount: quarterAmount,
              additionalData: new NodeCommissionAdditionalData({
                productionType: '',
                commissionType: 'target',
              }),
            }),
          );
        }
      }
    };
    const processPasBonus = async (letter, dataObject) => {
      const stat1 = await this.sheltiaCommissioningService.getPromoterStats(
        productivePeriodYear,
        productivePeriodMonth,
        letter.promoterId,
      );

      // no stat means promoter must not be elaborated
      if (stat1._id === 'no-result') return;

      const bonusRow = dataObject.bonusTableRows.find((r) => stat1.totalIv >= r.from && stat1.totalIv <= r.to);
      if (bonusRow && bonusRow.amount > 0) {
        this.log.info('bonusRow', bonusRow);
        await this.accountingService.addAccountingNote(
          new AccountingNote({
            promoterId: letter.promoterId,
            ...(letter.invoiceDescription ? { description: letter.invoiceDescription } : { description: 'Bonus' }),
            productivePeriodYear,
            productivePeriodMonth,
            type: AccountingNoteType.COMMISSION,
            origin: 'target+',
            invoicingId: productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth).toString(),
            amount: bonusRow.amount,
            additionalData: new NodeCommissionAdditionalData({
              productionType: '',
              commissionType: 'target',
            }),
          }),
        );
      }
    };
    const processPaRappel = async (letter, dataObject) => {
      if (isQuarter) {
        let monthAverageFactor = 0;
        const stat1 = await this.sheltiaCommissioningService.getPromoterStats(
          productivePeriodYear,
          productivePeriodMonth,
          letter.promoterId,
        );
        if (stat1._id !== 'no-result') monthAverageFactor += 1;

        this.log.info('isQuarter', isQuarter);
        const stat2 = await this.sheltiaCommissioningService.getPromoterStats(
          productivePeriodHelper.unparse(targetProductivePeriod2).productivePeriodYear,
          productivePeriodHelper.unparse(targetProductivePeriod2).productivePeriodMonth,
          letter.promoterId,
        );
        if (stat2._id !== 'no-result') monthAverageFactor += 1;

        const stat3 = await this.sheltiaCommissioningService.getPromoterStats(
          productivePeriodHelper.unparse(targetProductivePeriod3).productivePeriodYear,
          productivePeriodHelper.unparse(targetProductivePeriod3).productivePeriodMonth,
          letter.promoterId,
        );
        if (stat3._id !== 'no-result') monthAverageFactor += 1;

        // no stat means promoter must not be elaborated
        if (monthAverageFactor === 0) return;

        const totalIv = Math.round(stat1.totalIv + stat2.totalIv + stat3.totalIv);
        const avgMonthlyIv = Math.round(totalIv / monthAverageFactor);

        this.log.info('avgMonthlyIv', avgMonthlyIv);
        this.log.info('totalIv', totalIv);

        const quarterRow = dataObject.quarterTargetTableRows.find(
          (r) => avgMonthlyIv >= r.from && avgMonthlyIv <= r.to,
        );

        const quarterAmount =
          Math.round((totalIv * quarterRow.percentage) / 10000) -
          Math.round(stat1.totalAmount + stat2.totalAmount + stat3.totalAmount);

        if (quarterRow && quarterAmount > 0) {
          this.log.info('quarterRow', quarterRow);
          await this.accountingService.addAccountingNote(
            new AccountingNote({
              promoterId: letter.promoterId,
              ...(letter.invoiceDescription
                ? { description: letter.invoiceDescription }
                : { description: 'Rappel trimestrale' }),
              productivePeriodYear,
              productivePeriodMonth,
              type: AccountingNoteType.COMMISSION,
              origin: 'target+',
              invoicingId: productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth).toString(),
              amount: quarterAmount,
              additionalData: new NodeCommissionAdditionalData({
                productionType: '',
                commissionType: 'target',
              }),
            }),
          );
        }
      }
    };
    const processPa2021Rappel = async (letter, dataObject) => {
      if (isQuarter) {
        let monthAverageFactor = 0;
        const stat1 = await this.sheltiaCommissioningService.getPromoterStats(
          productivePeriodYear,
          productivePeriodMonth,
          letter.promoterId,
        );
        if (stat1._id !== 'no-result') monthAverageFactor += 1;

        this.log.info('isQuarter', isQuarter);
        const stat2 = await this.sheltiaCommissioningService.getPromoterStats(
          productivePeriodHelper.unparse(targetProductivePeriod2).productivePeriodYear,
          productivePeriodHelper.unparse(targetProductivePeriod2).productivePeriodMonth,
          letter.promoterId,
        );
        if (stat2._id !== 'no-result') monthAverageFactor += 1;

        const stat3 = await this.sheltiaCommissioningService.getPromoterStats(
          productivePeriodHelper.unparse(targetProductivePeriod3).productivePeriodYear,
          productivePeriodHelper.unparse(targetProductivePeriod3).productivePeriodMonth,
          letter.promoterId,
        );
        if (stat3._id !== 'no-result') monthAverageFactor += 1;

        // no stat means promoter must not be elaborated
        if (monthAverageFactor === 0) return;

        let totalIv;
        switch (dataObject.rappelPaType) {
          case 'direct':
            totalIv = Math.round((stat1.totalIvDirect || 0) + (stat2.totalIvDirect || 0) + (stat3.totalIvDirect || 0));
            break;
          case 'indirect':
            totalIv = Math.round(
              (stat1.totalIvIndirect || 0) + (stat2.totalIvIndirect || 0) + (stat3.totalIvIndirect || 0),
            );
            break;
          case 'all':
          default:
            totalIv = Math.round((stat1.totalIv || 0) + (stat2.totalIv || 0) + (stat3.totalIv || 0));
            break;
        }

        this.log.info('totalIv', totalIv);

        const quarterRow = dataObject.quarterTargetTableRows.find((r) => totalIv >= r.from && totalIv <= r.to);

        let quarterAmount = 0;
        if (quarterRow) {
          switch (dataObject.rappelPaType) {
            case 'direct':
              quarterAmount = Math.round(
                (((stat1.totalAmountDirect || 0) + (stat2.totalAmountDirect || 0) + (stat3.totalAmountDirect || 0)) *
                  quarterRow.percentage) /
                  10000,
              );
              break;
            case 'indirect':
              quarterAmount = Math.round(
                (((stat1.totalAmountIndirect || 0) +
                  (stat2.totalAmountIndirect || 0) +
                  (stat3.totalAmountIndirect || 0)) *
                  quarterRow.percentage) /
                  10000,
              );
              break;
            case 'all':
            default:
              quarterAmount = Math.round(
                (((stat1.totalAmount || 0) + (stat2.totalAmount || 0) + (stat3.totalAmount || 0)) *
                  quarterRow.percentage) /
                  10000,
              );
              break;
          }
        }

        if (quarterRow && quarterAmount > 0) {
          this.log.info('quarterRow', quarterRow);
          await this.accountingService.addAccountingNote(
            new AccountingNote({
              promoterId: letter.promoterId,
              ...(letter.invoiceDescription
                ? { description: letter.invoiceDescription }
                : { description: 'Rappel 2021 trimestrale' }),
              productivePeriodYear,
              productivePeriodMonth,
              type: AccountingNoteType.COMMISSION,
              origin: 'target+',
              invoicingId: productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth).toString(),
              amount: quarterAmount,
              additionalData: new NodeCommissionAdditionalData({
                productionType: '',
                commissionType: 'target',
              }),
            }),
          );
        }
      }
    };
    const processPaBonus = async (letter, dataObject) => {
      const stat1 = await this.sheltiaCommissioningService.getPromoterStats(
        productivePeriodYear,
        productivePeriodMonth,
        letter.promoterId,
      );

      // no stat means promoter must not be elaborated
      if (stat1._id === 'no-result') return;

      /**
       * Loop months.
       * Jan = 0.
       * Feb = 1.
       * ...
       * Last month = Last Idx of array.
       * Last month + 1 = 0.
       * Last month + 2 = 1.
       * and so on.
       * The number of months is given by the length of the months array.
       */
      const monthNumber = productivePeriodHelper.monthsDifference(
        productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth),
        productivePeriodHelper.parse(letter.fromProductivePeriodYear, letter.fromProductivePeriodMonth),
      );
      // eslint-disable-next-line security/detect-object-injection
      const month = dataObject.bonusMonths.sort((a, b) => a.month - b.month)[monthNumber];
      const targetCompletitionRatio = stat1.totalIv / month.targetIv;

      this.log.info('Bonus target', targetCompletitionRatio);
      const amountGuaranteed =
        month.guaranteedBonusMode === 'fixed'
          ? month.guaranteedBonusAmount
          : Math.round(month.guaranteedBonusAmount * targetCompletitionRatio);
      if (targetCompletitionRatio * 10000 >= month.guaranteedBonusThreshold && amountGuaranteed > 0) {
        await this.accountingService.addAccountingNote(
          new AccountingNote({
            promoterId: letter.promoterId,
            ...(letter.invoiceDescription
              ? { description: letter.invoiceDescription }
              : { description: 'Bonus garantito' }),
            productivePeriodYear,
            productivePeriodMonth,
            type: AccountingNoteType.COMMISSION,
            origin: 'target+',
            invoicingId: productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth).toString(),
            amount: amountGuaranteed,
            additionalData: new NodeCommissionAdditionalData({
              productionType: '',
              commissionType: 'target',
            }),
          }),
        );
      }

      this.log.info('Bonus target', targetCompletitionRatio);
      const amountVariable =
        month.targetBonusMode === 'fixed'
          ? month.targetBonusAmount
          : Math.round(month.targetBonusAmount * targetCompletitionRatio);
      if (targetCompletitionRatio * 10000 >= month.targetBonusThreshold && amountVariable > 0) {
        await this.accountingService.addAccountingNote(
          new AccountingNote({
            promoterId: letter.promoterId,
            ...(letter.invoiceDescription
              ? { description: letter.invoiceDescription }
              : { description: 'Bonus variabile' }),
            productivePeriodYear,
            productivePeriodMonth,
            type: AccountingNoteType.COMMISSION,
            origin: 'target+',
            invoicingId: productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth).toString(),
            amount: amountVariable,
            additionalData: new NodeCommissionAdditionalData({
              productionType: '',
              commissionType: 'target',
            }),
          }),
        );
      }
    };

    const pasLetters = await letterRepository.getActiveCommissioningPasLetters(this.mongodb, productivePeriod);
    const paLetters = await letterRepository.getActiveCommissioningPaLetters(this.mongodb, productivePeriod);
    const bonusPasLetters = await letterRepository.getActiveBonusPasLetters(this.mongodb, productivePeriod);
    const bonusPaLetters = await letterRepository.getActiveBonusPaLetters(this.mongodb, productivePeriod);
    const rappelPasLetters = await letterRepository.getActiveRappelPasLetters(this.mongodb, productivePeriod);
    const rappelPaLetters = await letterRepository.getActiveRappelPaLetters(this.mongodb, productivePeriod);
    const rappelPa2021Letters = await letterRepository.getActiveRappelPa2021Letters(this.mongodb, productivePeriod);

    try {
      // @ts-ignore
      await pasLetters.forEachAsync(async (el) => {
        this.log.info('pasLetters promoterId', el.promoterId);
        this.log.info('pasLetters promoterDisplayName', el.promoterDisplayName);
        await processPasBonus(el, el.commissioningPas);
        await processPasRappel(el, el.commissioningPas);
        this.log.info('pasLetters OK', el.promoterDisplayName);
      });
    } catch (error) {
      return Promise.reject(error);
    }

    try {
      // @ts-ignore
      await paLetters.forEachAsync(async (el) => {
        this.log.info('paLetters promoterId', el.promoterId);
        this.log.info('paLetters promoterDisplayName', el.promoterDisplayName);
        await processPaBonus(el, el.commissioningPa);
        await processPaRappel(el, el.commissioningPa);
        this.log.info('paLetters OK', el.promoterDisplayName);
      });
    } catch (error) {
      return Promise.reject(error);
    }

    try {
      // @ts-ignore
      await bonusPasLetters.forEachAsync(async (el) => {
        this.log.info('bonusPasLetters promoterId', el.promoterId);
        this.log.info('bonusPasLetters promoterDisplayName', el.promoterDisplayName);
        await processPasBonus(el, el.bonusPas);
        this.log.info('bonusPasLetters OK', el.promoterDisplayName);
      });
    } catch (error) {
      return Promise.reject(error);
    }

    try {
      // @ts-ignore
      await bonusPaLetters.forEachAsync(async (el) => {
        this.log.info('bonusPaLetters promoterId', el.promoterId);
        this.log.info('bonusPaLetters promoterDisplayName', el.promoterDisplayName);
        await processPaBonus(el, el.bonusPa);
        this.log.info('bonusPaLetters OK', el.promoterDisplayName);
      });
    } catch (error) {
      return Promise.reject(error);
    }

    try {
      // @ts-ignore
      await rappelPasLetters.forEachAsync(async (el) => {
        this.log.info('rappelPasLetters promoterId', el.promoterId);
        this.log.info('rappelPasLetters promoterDisplayName', el.promoterDisplayName);
        await processPasRappel(el, el.rappelPas);
        this.log.info('rappelPasLetters OK', el.promoterDisplayName);
      });
    } catch (error) {
      return Promise.reject(error);
    }

    try {
      // @ts-ignore
      await rappelPaLetters.forEachAsync(async (el) => {
        this.log.info('rappelPaLetters promoterId', el.promoterId);
        this.log.info('rappelPaLetters promoterDisplayName', el.promoterDisplayName);
        await processPaRappel(el, el.rappelPa);
        this.log.info('rappelPaLetters OK', el.promoterDisplayName);
      });
    } catch (error) {
      return Promise.reject(error);
    }

    try {
      // @ts-ignore
      await rappelPa2021Letters.forEachAsync(async (el) => {
        this.log.info('rappelPa2021Letters promoterId', el.promoterId);
        this.log.info('rappelPa2021Letters promoterDisplayName', el.promoterDisplayName);
        await processPa2021Rappel(el, el.rappelPa);
        this.log.info('rappelPa2021Letters OK', el.promoterDisplayName);
      });
    } catch (error) {
      return Promise.reject(error);
    }

    return Promise.resolve(true);
  }

  /**
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @returns {Promise}
   */
  processBonusLetters(productivePeriodYear, productivePeriodMonth) {
    /**
     * @param {BonusLetter} letter
     * @param {KpiService} kpiService
     * @returns {Promise<BonusLetter>}
     */
    async function fillKpiValue(letter, kpiService) {
      const promises = [];
      const kpi = new Map();
      letter.conditionedBonuses.forEach((bonus) =>
        bonus.conditions.forEach((condition) =>
          condition.targets.forEach((target) =>
            promises.push(
              kpiService
                .calculateKpi(target.kpi, letter.promoterId, {
                  fromProductivePeriodYear: letter.fromProductivePeriodYear,
                  fromProductivePeriodMonth: letter.fromProductivePeriodMonth,
                  toProductivePeriodYear: letter.toProductivePeriodYear,
                  toProductivePeriodMonth: letter.toProductivePeriodMonth,
                  currentProductivePeriodYear: productivePeriodYear,
                  currentProductivePeriodMonth: productivePeriodMonth,
                })
                .then((value) => {
                  kpi.set(
                    `${target.kpi._id}${
                      // @ts-ignore
                      target.kpi.options && target.kpi.options.productId ? target.kpi.options.productId : ''
                    }`,
                    value,
                  );
                  return Promise.resolve();
                }),
            ),
          ),
        ),
      );

      try {
        await Promise.all(promises);
        return Promise.resolve({
          ...letter,
          conditionedBonuses: letter.conditionedBonuses.map((bonus) => ({
            ...bonus,
            conditions: bonus.conditions.map((condition) => ({
              ...condition,
              targets: condition.targets.map((target) => ({
                ...target,
                kpi: {
                  ...target.kpi,
                  value:
                    kpi.get(
                      `${target.kpi._id}${
                        // @ts-ignore
                        target.kpi.options && target.kpi.options.productId ? target.kpi.options.productId : ''
                      }`,
                    ) || 0,
                },
              })),
            })),
          })),
        });
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return letterRepository
      .getActiveBonusLetters(this.mongodb, productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth))
      .then(async (letters) => {
        const lettersAndKpis = [];
        // @ts-ignore
        await letters.forEachAsync(async (letter) => {
          const letterAndKpi = await fillKpiValue(letter, this.kpiService);
          lettersAndKpis.push(letterAndKpi);
        });

        return lettersAndKpis;
      })
      .then((letters) =>
        Promise.all(
          letters.map((letter) =>
            Promise.all(
              bonusCalculator.calculateBonuses(letter, productivePeriodYear, productivePeriodMonth).map((cb) => {
                if (cb.accruedAmount < 0) {
                  return this.accountingService.addAccountingNote(
                    new AccountingNote({
                      type: AccountingNoteType.DEBIT,
                      promoterId: letter.promoterId,
                      amount: Math.trunc(cb.accruedAmount),
                      origin: cb.type,
                      ...(cb.invoiceDescription ? { description: cb.invoiceDescription } : {}),
                      productivePeriodYear,
                      productivePeriodMonth,
                      invoicingId: productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth).toString(),
                      additionalData: new NoteDebitAdditionalData({
                        letterId: letter._id,
                        accruedAmount: cb.accruedAmount,
                        supplyPercentage: cb.targetPercentage,
                      }),
                    }),
                  );
                }
                return this.accountingService.addAccountingNote(
                  new AccountingNote({
                    type: AccountingNoteType.BONUS_LETTER,
                    promoterId: letter.promoterId,
                    amount: Math.trunc(cb.accruedAmount),
                    origin: cb.type,
                    ...(cb.invoiceDescription ? { description: cb.invoiceDescription } : {}),
                    productivePeriodYear,
                    productivePeriodMonth,
                    invoicingId: productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth).toString(),
                    additionalData: new NoteBonusAdditionalData({
                      letterId: letter._id,
                      targetAmount: cb.targetAmount,
                      absorbability: cb.absorbability,
                      targetPercentage: cb.targetPercentage,
                      accruedAmount: cb.accruedAmount,
                      expireDate: cb.expireDate,
                      kpi: cb.kpi,
                    }),
                  }),
                );
              }),
            ),
          ),
        ),
      );
  }

  getPromoterActiveJobLetter(promoterId) {
    // @ts-ignore
    return letterRepository.getPromoterActiveJobLetter(this.mongodb, promoterId);
  }

  insertSeed() {
    return letterRepository.insertSeed(this.mongodb, seed);
  }

  createIndexes() {
    return letterRepository.createIndexes(this.mongodb);
  }
}

module.exports = LetterService;
