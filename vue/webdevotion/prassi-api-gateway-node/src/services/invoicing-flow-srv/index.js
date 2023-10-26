const Mongo = require('mongodb');
const Knex = require('knex');
const pino = require('pino');
const InvoicingState = require('./invoicing-state');
const NetworkService = require('../network-srv');
const AccountingService = require('../accounting-srv');
const fsm = require('./invoicing-fsm');
const { events } = require('./invoicing-events');
const invoicingRepository = require('./invoicing-repository');
const accountingRepository = require('../accounting-srv/accounting-respository');
const InvoiceService = require('../invoice-srv');
const invoiceRepository = require('../invoice-srv/invoice-repository');
const InvoicePDFService = require('../invoice-pdf-srv');
const PromoterService = require('../promoter-srv');
const LetterService = require('../letter-srv');
const PromoterJobService = require('../promoter-job-srv');
const CommissioningFlowService = require('../commissioning-flow-srv');
const { parse, toDate } = require('../../utils/productive-period-helper');
const { seed } = require('./seed/invoicing-flow');
const productivePeriodHelper = require('../../utils/productive-period-helper');
const logRepository = require('../commissioning-flow-srv/log-repository');
const LogEvent = require('../commissioning-flow-srv/log-event');
require('../../utils/foreach');

class InvoicingFlowService {

  /**
   * @param {Mongo.Db} mongodb
   * @param {string} edition
   * @param {pino} log
   * @param {Knex} sql
   *
   */
  constructor(mongodb, edition, log, sql) {
    this.mongodb = mongodb;
    this.sql = sql;
    this.invoiceService = new InvoiceService(this.mongodb);
    this.promoterService = new PromoterService(this.mongodb);
    this.letterService = new LetterService(mongodb, log, sql);
    this.commissioningFlowService = new CommissioningFlowService(mongodb, edition, sql, sql);
    this.networkService = new NetworkService(mongodb);
    this.accountingService = new AccountingService(mongodb);
    this.promoterJobService = new PromoterJobService(mongodb);
  }

  /**
   * @param {string} id
   * @returns {Promise<InvoicingState>}
   */
  getState(id) {
    return invoicingRepository.getById(this.mongodb, id);
  }

  /**
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @param {Date} issueDate
   * @param {Date} dueDate
   * @returns {Promise<InvoicingState>}
   */
  async create(productivePeriodYear, productivePeriodMonth, issueDate, dueDate) {
    try {
      const commissioningComplete = await this.commissioningFlowService.isClosed(
        `${parse(productivePeriodYear, productivePeriodMonth)}`,
      );
      if (!commissioningComplete) {
        return Promise.reject(new Error('Devi completare il commissioning prima della fatturazione'));
      }

      const invoicingExists = await invoicingRepository.exists(
        this.mongodb,
        InvoicingState.buildId(productivePeriodYear, productivePeriodMonth),
      );
      if (invoicingExists) return Promise.reject(new Error('La fatturazione per questo periodo esiste già'));

      const state = fsm.initState(
        new InvoicingState({
          productivePeriodYear,
          productivePeriodMonth,
          invoices: [],
          issueDate,
          dueDate,
        }),
      );

      return invoicingRepository.update(this.mongodb, state);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @param {InvoicingState} state
   * @param {Date} issueDate
   * @param {Date} dueDate
   * @returns {Promise<InvoicingState>}
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async open(state, issueDate, dueDate) {
    // eslint-disable-next-line no-param-reassign
    state.issueDate = issueDate;
    // eslint-disable-next-line no-param-reassign
    state.dueDate = dueDate;
    try {
      await this.letterService.processBonusLetters(state.productivePeriodYear, state.productivePeriodMonth);
      await this.letterService.processCommissioningLetters(state.productivePeriodYear, state.productivePeriodMonth);
    } catch (error) {
      logRepository.insert(
        this.mongodb,
        new LogEvent({
          idInvoicing: productivePeriodHelper.parse(state.productivePeriodYear, state.productivePeriodMonth).toString(),
          description: error.message,
        }),
      );
      const rollbackedState = await this.rollback(state);
      const nextState = fsm.trigger(events.ERROR, { ...rollbackedState }, {});
      await invoicingRepository.update(this.mongodb, nextState);
      return Promise.reject(error);
    }

    return this.networkService
      .getNetworkAsTree(state.productivePeriodYear, state.productivePeriodMonth)
      .then((network) =>
        Promise.all(
          network
            .all((node) => !!node.model.promoterId)
            .map(async (node) => {
              const { promoterId } = node.model;
              const accountingNotes = (await this.accountingService.getUnsettledAccountingNote(promoterId)).filter(
                (a) =>
                  a.productivePeriodYear === state.productivePeriodYear &&
                  a.productivePeriodMonth === state.productivePeriodMonth,
              );
              return { promoterId, accountingNotes };
            }),
        ),
      )
      .then(async (accountingNotesGroups) => {
        const nodeList = await this.networkService.getNetworkListFlatPeriod(
          1000,
          '',
          state.productivePeriodYear,
          state.productivePeriodMonth,
        );

        return Promise.all(
          accountingNotesGroups
            .filter((x) => x.accountingNotes.length > 0)
            .map(async ({ promoterId, accountingNotes }) => {
              try {
                const promoter = await this.promoterService.getPromoterById(promoterId);
                const promoterJob = await this.promoterJobService.getPromoterJob(
                  promoterId,
                  state.productivePeriodYear,
                  state.productivePeriodMonth,
                );
                if (!promoterJob) {
                  logRepository.insert(
                    this.mongodb,
                    new LogEvent({
                      idInvoicing: productivePeriodHelper
                        .parse(state.productivePeriodYear, state.productivePeriodMonth)
                        .toString(),
                      description: `incarico promotore non trovato ${promoter.displayName} ${promoter.serialNumber} `,
                    }),
                  );
                  throw new Error(`Promoter Job not found for ${promoterId}`);
                }
                const { displayHierarchy } = nodeList.find((item) => item.promoterId === promoterId) || {
                  displayHierarchy: 'NON IN RETE',
                };
                const invoice = await this.invoiceService.generateInvoice(
                  state.productivePeriodYear,
                  state.productivePeriodMonth,
                  issueDate,
                  dueDate,
                  promoter,
                  displayHierarchy,
                  promoterJob,
                  true,
                  // eslint-disable-next-line unicorn/no-reduce
                  accountingNotes.reduce(
                    (acc, curr) => Math.max(acc, curr.additionalData.totalIV ? curr.additionalData.totalIV : 0),
                    0,
                  ),
                );
                await this.invoiceService.addAccountingNotes(invoice._id, accountingNotes);

                return Promise.resolve(invoice._id);
              } catch (error) {
                logRepository.insert(
                  this.mongodb,
                  new LogEvent({
                    idInvoicing: productivePeriodHelper
                      .parse(state.productivePeriodYear, state.productivePeriodMonth)
                      .toString(),
                    description: error.message,
                  }),
                );

                const rollbackedState = await this.rollback(state);
                const nextState = fsm.trigger(events.ERROR, { ...rollbackedState }, {});
                await invoicingRepository.update(this.mongodb, nextState);
                return Promise.reject(error);
              }
            }),
        );
      })
      .then(async (invoiceIds) => {
        const nodeList = await this.networkService.getNetworkListFlatPeriod(
          1000,
          '',
          state.productivePeriodYear,
          state.productivePeriodMonth,
        );

        const welcomeNotes = await this.accountingService.getUnsettledWelcomeAccountingNotes(
          state.productivePeriodYear,
          state.productivePeriodMonth,
        );
        // @ts-ignore
        await welcomeNotes.forEachAsync(async (wNote) => {
          try {
            const promoter = await this.promoterService.getPromoterById(wNote.promoterId);
            const promoterJob = await this.promoterJobService.getOnePromoterJob(wNote.promoterId);
            const { displayHierarchy } = nodeList.find((item) => item.promoterId === wNote.promoterId) || {
              displayHierarchy: 'NON IN RETE',
            };
            const invoice = await this.invoiceService.generateInvoice(
              state.productivePeriodYear,
              state.productivePeriodMonth,
              issueDate,
              dueDate,
              promoter,
              displayHierarchy,
              promoterJob,
              true,
              0,
            );
            await this.invoiceService.addAccountingNotes(invoice._id, [wNote]);
            invoiceIds.push(invoice._id);
          } catch (error) {
            logRepository.insert(
              this.mongodb,
              new LogEvent({
                idInvoicing: productivePeriodHelper
                  .parse(state.productivePeriodYear, state.productivePeriodMonth)
                  .toString(),
                description: error.message,
              }),
            );
          }
        });
        return fsm.trigger(
          events.OPEN,
          {
            ...state,
            invoices: invoiceIds.map((_id) => ({ _id, confirmed: false })),
          },
          {},
        );
      })
      .then((nextState) => invoicingRepository.update(this.mongodb, nextState));
  }

  /**
   * @param {InvoicingState} state
   * @returns {Promise<InvoicingState>}
   */
  async rollback(state) {
    const invoicesToRollback = await invoiceRepository.getByCommissioning(
      this.mongodb,
      state.productivePeriodYear,
      state.productivePeriodMonth,
    );

    // @ts-ignore
    await invoicesToRollback.forEachAsync(async (invoice) => {
      await this.invoiceService.unlinkAccountingNotes(invoice._id);
    });

    await invoiceRepository.deleteManyCommissioning(
      this.mongodb,
      state.productivePeriodYear,
      state.productivePeriodMonth,
    );

    await accountingRepository.deleteManyInvoicing(
      this.mongodb,
      productivePeriodHelper.parse(state.productivePeriodYear, state.productivePeriodMonth).toString(),
    );

    await accountingRepository.resetManyCommissioning(
      this.mongodb,
      productivePeriodHelper.parse(state.productivePeriodYear, state.productivePeriodMonth).toString(),
    );

    const nextState = fsm.trigger(events.ROLLBACKED, { ...state }, {});
    return invoicingRepository.update(this.mongodb, nextState);
  }

  /**
   * @param {InvoicingState} state
   * @returns {Promise<InvoicingState>}
   */
  async reOpen(state) {
    try {
      const nextState = fsm.trigger(events.PROCESS, { ...state }, {});
      await invoicingRepository.update(this.mongodb, nextState);

      const rollbackedState = await this.rollback(nextState);

      return this.open(rollbackedState, new Date(nextState.issueDate), new Date(nextState.dueDate));
    } catch (error) {
      logRepository.insert(
        this.mongodb,
        new LogEvent({
          idInvoicing: productivePeriodHelper.parse(state.productivePeriodYear, state.productivePeriodMonth).toString(),
          description: error.message,
        }),
      );

      const actualState = await invoicingRepository.getById(this.mongodb, state._id);
      const errorState = fsm.trigger(events.ERROR, { ...actualState }, {});
      return invoicingRepository.update(this.mongodb, errorState);
    }
  }

  /**
   * @param {string} id
   * @param {string} invoiceId
   * @returns {Promise<InvoicingState>}
   */
  confirmInvoice(id, invoiceId) {
    return invoicingRepository
      .getById(this.mongodb, id)
      .then((state) => fsm.trigger(events.CONFIRM_INVOICE, state, { invoiceId }))
      .then((newState) => invoicingRepository.update(this.mongodb, newState));
  }

  /**
   * @param {string} id
   * @param {string} invoiceId
   * @returns {Promise<InvoicingState>}
   */
  unconformInvoice(id, invoiceId) {
    return invoicingRepository
      .getById(this.mongodb, id)
      .then((state) => fsm.trigger(events.UNCONFIRM_INVOICE, state, { invoiceId }))
      .then((newState) => invoicingRepository.update(this.mongodb, newState));
  }

  /**
   * @param {string} id
   * @param {InvoicePDFService} invoicePDFService
   * @param {string} edition
   * @returns {Promise<InvoicingState>}
   */
  close(id, invoicePDFService, edition) {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const completeInvoice = (invoiceId) =>
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async (resolve, reject) => {
        try {
          const invoice = await this.invoiceService.issueInvoice(invoiceId, edition);
          let { documentId } = invoice;
          let { documentWithDetailsId } = invoice;
          if (!documentId) {
            const promoter = await this.promoterService.getPromoterById(invoice.promoterId);
            const doc = await invoicePDFService.saveInvoicePDF(invoice, promoter);
            const docwithDetails = await invoicePDFService.saveInvoicePDF(invoice, promoter, true);
            documentId = doc._id;
            documentWithDetailsId = docwithDetails._id;
            await this.invoiceService.attachDocument(invoice._id, documentId);
            await this.invoiceService.attachDocumentWithDetails(invoice._id, documentWithDetailsId);
            await Promise.all(
              invoice.accountingNotes.map((a) => {
                const newAccountingNote = { ...a };
                delete newAccountingNote.invoiceAmount;
                return this.accountingService.settleAccountingNote(newAccountingNote, a.invoiceAmount, invoice._id);
              }),
            );
          }
          resolve({
            documentId,
            documentWithDetailsId,
            gross: invoice.grossAmount,
            net: invoice.amount,
            tax: invoice.grossAmount - invoice.amount,
          });
        } catch (error) {
          reject(error);
        }
      });

    return invoicingRepository
      .getById(this.mongodb, id)
      .then((state) => fsm.trigger(events.PROCESS_CLOSE, state, {}))
      .then((state) => invoicingRepository.update(this.mongodb, state))
      .then(async (state) => {
        try {
          const invoiceIds = state.invoices.filter(({ confirmed }) => confirmed).map(({ _id }) => _id);
          const result = await Promise.all(invoiceIds.map((invoiceId) => completeInvoice(invoiceId)));
          // eslint-disable-next-line unicorn/no-reduce
          const stats = result.reduce(
            (acc, item) => ({
              documentIds: [...acc.documentIds, item.documentId],
              documentIdsWithDetail: [...acc.documentIdsWithDetail, item.documentWithDetailsId],
              stats: {
                gross: acc.stats.gross + item.gross,
                net: acc.stats.net + item.net,
                tax: acc.stats.tax + item.tax,
                promoterNumber: acc.stats.promoterNumber + 1,
              },
            }),
            { documentIds: [], documentIdsWithDetail: [], stats: { gross: 0, tax: 0, net: 0, promoterNumber: 0 } },
          );
          await this.letterService.expireLetters(
            toDate(parse(state.productivePeriodYear, state.productivePeriodMonth)),
          );
          return Promise.resolve({
            ...state,
            ...stats,
          });
        } catch (error) {
          logRepository.insert(
            this.mongodb,
            new LogEvent({
              idInvoicing: productivePeriodHelper
                .parse(state.productivePeriodYear, state.productivePeriodMonth)
                .toString(),
              description: error.message,
            }),
          );
          const nextState = fsm.trigger(events.ERROR_CLOSING, { ...state }, {});
          await invoicingRepository.update(this.mongodb, nextState);
          return Promise.reject(error);
        }
      })
      .then((state) => fsm.trigger(events.CLOSE, state, {}))
      .then((state) => invoicingRepository.update(this.mongodb, state));
  }

  /**
   * @param {string} id
   * @param {InvoicePDFService} invoicePDFService
   * @param {string} edition
   * @returns {Promise<InvoicingState>}
   */
  preview(id, invoicePDFService, edition) {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const completeInvoice = (invoiceId) =>
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async (resolve, reject) => {
        try {
          const invoice = await this.invoiceService.issuePreviewInvoice(invoiceId, edition);
          const promoter = await this.promoterService.getPromoterById(invoice.promoterId);
          const doc = await invoicePDFService.saveInvoicePDF(invoice, promoter, true);
          const documentPreviewId = doc._id;
          await this.invoiceService.attachDocumentPreview(invoice._id, documentPreviewId);
          resolve({
            documentPreviewId,
            gross: invoice.grossAmount,
            net: invoice.amount,
            tax: invoice.grossAmount - invoice.amount,
          });
        } catch (error) {
          reject(error);
        }
      });

    return invoicingRepository
      .getById(this.mongodb, id)
      .then((state) => fsm.trigger(events.PROCESS_PREVIEW, state, {}))
      .then((state) => invoicingRepository.update(this.mongodb, state))
      .then(async (state) => {
        try {
          const invoiceIds = state.invoices.filter(({ confirmed }) => confirmed).map(({ _id }) => _id);
          const result = await Promise.all(invoiceIds.map((invoiceId) => completeInvoice(invoiceId)));
          // eslint-disable-next-line unicorn/no-reduce
          const stats = result.reduce(
            (acc, item) => ({
              documentIdsPreview: [...acc.documentIdsPreview, item.documentPreviewId],
              stats: {
                gross: acc.stats.gross + item.gross,
                net: acc.stats.net + item.net,
                tax: acc.stats.tax + item.tax,
                promoterNumber: acc.stats.promoterNumber + 1,
              },
            }),
            { documentIdsPreview: [], stats: { gross: 0, tax: 0, net: 0, promoterNumber: 0 } },
          );
          return Promise.resolve({
            ...state,
            ...stats,
          });
        } catch (error) {
          logRepository.insert(
            this.mongodb,
            new LogEvent({
              idInvoicing: productivePeriodHelper
                .parse(state.productivePeriodYear, state.productivePeriodMonth)
                .toString(),
              description: error.message ? error.message : error,
            }),
          );
          const nextState = fsm.trigger(events.ERROR_PREVIEW, { ...state }, {});
          await invoicingRepository.update(this.mongodb, nextState);
          return Promise.reject(error);
        }
      })
      .then((state) => fsm.trigger(events.OPEN, state, {}))
      .then((state) => invoicingRepository.update(this.mongodb, state));
  }

  insertSeed() {
    return invoicingRepository.insertSeed(this.mongodb, seed);
  }

  createIndexes() {
    return invoicingRepository.createIndexes(this.mongodb);
  }
}

module.exports = InvoicingFlowService;
