const Mongo = require('mongodb');
const Knex = require('knex');
const S3 = require('aws-sdk/clients/s3');
const SheltiaCommissioningService = require('../sheltia-commissioning-srv');
const ManagementFeeService = require('../management-fee-srv');
const TcwManagementFeeService = require('../tcw-management-fee-srv');
const TcwCommissioningService = require('../tcw-commissioning-srv');
const SignalerCommissionService = require('../signaler-commission-srv');
const PracticeCommissionService = require('../practice-commission-srv');
const PromoterJobService = require('../promoter-job-srv');
const PromoterService = require('../promoter-srv');
const AccountingService = require('../accounting-srv');
const NetworkService = require('../network-srv');
const PracticeService = require('../practice-srv');
const AdjustedPremiumService = require('../adjusted-premium-srv');
const NodeCommissionAdditionalData = require('../accounting-srv/note-additional-data/commission-additional-data');
const PracticeInstallmentReference = require('./practice-installment-reference');
const AccountingNote = require('../accounting-srv/accounting-note');
const AccountingNoteType = require('../accounting-srv/note-type');
const CommissioningState = require('./commissioning-state');
const fsm = require('./commissioning-fsm');
const { events } = require('./commissioning-events');
const { statuses } = require('./commissioning-statuses');
const { unparse, addMonths, parse, toQuarter } = require('../../utils/productive-period-helper');
const { seed } = require('./seed/commissioning-flow');
const commissioningRepository = require('./commissioning-repository');
require('../../utils/foreach');
const LogEvent = require('./log-event');
const logRepository = require('./log-repository');
const accountingRepository = require('../accounting-srv/accounting-respository');
const productivePeriodHelper = require('../../utils/productive-period-helper');
const DocumentService = require('../document-srv');
const DocumentObject = require('../document-srv/document');
const { excelReport } = require('../excel-report-srv');
const { types: documentTypes } = require('../document-srv/document-types');
const { translateRoleId } = require('../promoter-job-srv/role-ids');

function mapPracticeType(value, cashin) {
  if (value === 'subscription' && cashin) {
    return 'RA';
    // eslint-disable-next-line no-else-return
  } else if (value === 'subscription') {
    return 'SO';
  }

  return 'VA';
}

class CommissioningFlowService {

  /**
   * @param {Mongo.Db} mongodb
   * @param {string} edition
   * @param {Knex} sql
   * @param {Knex} sqlReader
   *
   */
  constructor(mongodb, edition, sql, sqlReader) {
    this.mongodb = mongodb;
    this.edition = edition;
    this.sql = sql;
    this.sqlReader = sqlReader;
    this.managementFeeService = new ManagementFeeService(this.mongodb);
    this.tcwManagementFeeService = new TcwManagementFeeService(this.mongodb);
    this.signalerCommissionService = new SignalerCommissionService(this.mongodb);
    this.sheltiaCommissioningService = new SheltiaCommissioningService(this.mongodb, sql);
    this.practiceCommissionService = new PracticeCommissionService(this.mongodb, this.sql);
    this.tcwCommissioningService = new TcwCommissioningService(this.mongodb, sql);
    this.promoterJobService = new PromoterJobService(this.mongodb);
    this.accountingService = new AccountingService(this.mongodb);
    this.networkService = new NetworkService(this.mongodb);
    this.promoterService = new PromoterService(this.mongodb);
    this.practiceService = new PracticeService(this.mongodb);
    this.adjustedPremiumService = new AdjustedPremiumService(this.mongodb);

    const s3Client = new S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || '',
    });
    this.documentService = new DocumentService(mongodb, process.env.AWS_S3_BUCKET_NAME_DOCUMENTS || '', s3Client);
  }

  /**
   * @param {string} id
   * @returns {Promise<CommissioningState>}
   */
  getState(id) {
    return commissioningRepository.getById(this.mongodb, id);
  }

  /**
   *  @param {string} id
   *  @returns {Promise<boolean>}
   */
  isClosed(id) {
    return this.getState(id).then((commissioning) => commissioning.status === statuses.CLOSED);
  }

  /**
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @returns {Promise<CommissioningState>}
   */
  async open(productivePeriodYear, productivePeriodMonth) {
    const id = CommissioningState.buildId(productivePeriodYear, productivePeriodMonth);
    return commissioningRepository
      .exists(this.mongodb, id)
      .then((exists) => {
        if (exists) return Promise.reject(new Error('Il periodo produttivo esite già'));
        return Promise.resolve();
      })
      .then(() => fsm.initState(new CommissioningState({ productivePeriodYear, productivePeriodMonth })))
      .then((state) => commissioningRepository.update(this.mongodb, state));
  }

  /**
   * @param {string} id
   * @param {Array<PracticeInstallmentReference>} practiceInstallments
   * @returns {Promise<CommissioningState>}
   */
  addPracticeInstallment(id, practiceInstallments) {
    return commissioningRepository
      .getById(this.mongodb, id)
      .then((state) => fsm.trigger(events.ADD_DOSSIER_INSTALLMENT, state, practiceInstallments))
      .then((newState) => commissioningRepository.update(this.mongodb, newState));
  }

  /**
   * @param {string} id
   * @param {Array<PracticeInstallmentReference>} practiceInstallments
   * @returns {Promise<CommissioningState>}
   */
  removePracticeInstallment(id, practiceInstallments) {
    return commissioningRepository
      .getById(this.mongodb, id)
      .then((state) => fsm.trigger(events.REMOVE_DOSSIER_INSTALLMENT, state, practiceInstallments))
      .then((newState) => commissioningRepository.update(this.mongodb, newState));
  }

  /**
   * @param {string} id
   * @returns {Promise<CommissioningState>}
   */
  async process(id) {
    const state = await commissioningRepository.getById(this.mongodb, id);
    const newState = fsm.trigger(events.PROCESS, state);
    return commissioningRepository.update(this.mongodb, newState);
  }

  /**
   * @param {string} id
   * @returns {Promise<CommissioningState>}
   */
  async reset(id) {
    const state = await commissioningRepository.getById(this.mongodb, id);
    const newState = fsm.trigger(events.RESET, state);
    return commissioningRepository.update(this.mongodb, newState);
  }

  /**
   * @param {string} id
   * @returns {Promise<CommissioningState>}
   */
  async startRollback(id) {
    const state = await commissioningRepository.getById(this.mongodb, id);
    const newState = fsm.trigger(events.START_ROLLBACK, state);
    return commissioningRepository.update(this.mongodb, newState);
  }

  /**
   * @param {string} id
   * @returns {Promise<CommissioningState>}
   */
  async startRollbackClose(id) {
    const state = await commissioningRepository.getById(this.mongodb, id);
    const newState = fsm.trigger(events.START_ROLLBACK_CLOSE, state);
    return commissioningRepository.update(this.mongodb, newState);
  }

  /**
   * @param {string} id
   * @returns {Promise<CommissioningState>}
   */
  async reopenerror(id) {
    const state = await commissioningRepository.getById(this.mongodb, id);
    const newState = fsm.trigger(events.OPEN_ERROR, state);
    return commissioningRepository.update(this.mongodb, newState);
  }

  /**
   * @param {string} id
   * @returns {Promise<CommissioningState>}
   */
  async reopen(id) {
    const state = await commissioningRepository.getById(this.mongodb, id);
    const newState = fsm.trigger(events.RE_OPEN, state);
    return commissioningRepository.update(this.mongodb, newState);
  }

  /**
   * @param {string} id
   * @param {CommissioningState} newState
   * @returns {Promise<CommissioningState>}
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async confirm(id, newState) {
    const { productivePeriodYear, productivePeriodMonth } = unparse(id);
    const commService = this.edition === 'tcw' ? this.tcwCommissioningService : this.sheltiaCommissioningService;
    const mFeeService = this.edition === 'tcw' ? this.tcwManagementFeeService : this.managementFeeService;
    try {
      const networkTree = await this.networkService.getNetworkAsTree(productivePeriodYear, productivePeriodMonth);

      const commissionInstallments = [];
      let iscommissionInstallmentsError = false;
      // @ts-ignore
      await newState.installments.forEachAsync(async (installmentToPay) => {
        try {
          const commissionInstallment = await this.practiceCommissionService.getInstallment(
            installmentToPay.practiceId,
            installmentToPay.installment,
            installmentToPay.dossierId,
            productivePeriodYear,
            productivePeriodMonth,
          );
          commissionInstallments.push(commissionInstallment);
        } catch (error) {
          iscommissionInstallmentsError = true;
          logRepository.insert(
            this.mongodb,
            new LogEvent({
              idCommissioning: id,
              description: error.message,
            }),
          );
        }
      });

      if (iscommissionInstallmentsError) throw new Error(`errore nel caricare lista rate`);

      const promotersJob = [];
      let isPromoterJobError = false;
      await networkTree
        .all(() => true)
        .filter((node) => !!node.model.promoterId && !node.isRoot())
        // @ts-ignore
        .forEachAsync(async (node) => {
          try {
            const promoterJob = await this.promoterJobService.getPromoterJob(
              node.model.promoterId,
              productivePeriodYear,
              productivePeriodMonth,
            );
            promotersJob.push(promoterJob);
          } catch {
            isPromoterJobError = true;
            const { displayName, serialNumber } = await this.promoterService.getPromoterById(node.model.promoterId);
            logRepository.insert(
              this.mongodb,
              new LogEvent({
                idCommissioning: id,
                description: `incarico promotore non trovato ${node.model.name} ${displayName} ${serialNumber} `,
              }),
            );
          }
        });

      if (isPromoterJobError) throw new Error(`incarico promotore(i) non trovato`);

      const commissions = await commService.payCommissioning(
        commissionInstallments,
        productivePeriodYear,
        productivePeriodMonth,
        networkTree,
        promotersJob,
      );

      const managementFees = await mFeeService.payManagementFeeByProductivePeriod(
        productivePeriodYear,
        productivePeriodMonth,
        networkTree,
        promotersJob,
      );

      // This is the signaler fixed commission
      const replacementCommissions = await this.signalerCommissionService.paySignalerCommission(
        commissionInstallments,
        promotersJob,
      );

      const promoters = networkTree.all((n) => !!n.model.promoterId);

      const results = promoters
        .map((n) => {
          const comm = commissions.results.find((c) => c.promoterId === n.model.promoterId);
          const mf = managementFees.results.find((c) => c.promoterId === n.model.promoterId);
          const replacementCommission = replacementCommissions.find((c) => c.promoterId === n.model.promoterId);

          if (!mf && !comm && !replacementCommission) return null;
          if (!comm && !replacementCommission) return mf;

          return {
            ...(comm || replacementCommission),
            details: {
              ...(comm ? comm.details : {}),
              ...(mf ? mf.details : {}),
              ...(replacementCommission ? replacementCommission.details : {}),
              replacementCommission,
            },
            totalAmount:
              (replacementCommission && replacementCommission.amount ? replacementCommission.amount : 0) ||
              (comm && comm.totalAmount ? comm.totalAmount : 0) + (mf && mf.totalAmount ? mf.totalAmount : 0),
          };
        })
        .filter((r) => r && r.totalAmount > 0);

      const confirmState = fsm.trigger(events.CONFIRM, newState);

      const finalState = {
        ...confirmState,
        income: commissions.income + managementFees.income,
        outcome: commissions.outcome + managementFees.outcome,
        margin: commissions.margin + managementFees.margin,
        entryFeeIds: commissions.entryFeeIds,
        promotersCount: promoters.length,
        results,
      };

      // @ts-ignore
      return commissioningRepository.update(this.mongodb, finalState);
    } catch (error) {
      const rollBackState = fsm.trigger(events.ROLLBACK_ERROR, newState);
      commissioningRepository.update(this.mongodb, rollBackState);
      return commissioningRepository
        .getById(this.mongodb, id)
        .then(async (state) => {
          await commService.rollbackCommissioning(id, state.entryFeeIds);
          const rollBackedState = fsm.trigger(events.COMPLETED_ROLLBACK_ERROR, rollBackState);
          return commissioningRepository.update(this.mongodb, rollBackedState);
        })
        .then(() => Promise.reject(error));
    }
  }

  /**
   * @param {string} id
   * @returns {Promise<CommissioningState>}
   */
  prepareRollback(id) {
    const { productivePeriodYear, productivePeriodMonth } = unparse(id);
    return commissioningRepository.getById(this.mongodb, id).then(async (state) => {
      try {
        const commissionInstallments = [];
        // @ts-ignore
        await state.installments.forEachAsync(async (installmentToPay) => {
          try {
            const commissionInstallment = await this.practiceCommissionService.getInstallmentAll(
              installmentToPay.practiceId,
              installmentToPay.installment,
              installmentToPay.dossierId,
              productivePeriodYear,
              productivePeriodMonth,
            );
            commissionInstallments.push(commissionInstallment);
          } catch (error) {
            logRepository.insert(
              this.mongodb,
              new LogEvent({
                idCommissioning: id,
                description: error.message,
              }),
            );
          }
        });

        const resetState = fsm.trigger(events.COMPLETED_PREPARE_ROLLBACK, state);

        const finalState = {
          ...resetState,
          entryFeeIds: commissionInstallments.map(({ _id }) => _id),
        };

        // @ts-ignore
        return commissioningRepository.update(this.mongodb, finalState);
      } catch (error) {
        return Promise.reject(error);
      }
    });
  }

  /**
   * @param {string} id
   * @returns {Promise<CommissioningState>}
   */
  async rollback(id) {
    const commService = this.edition === 'tcw' ? this.tcwCommissioningService : this.sheltiaCommissioningService;
    return commissioningRepository.getById(this.mongodb, id).then(async (state) => {
      try {
        const newState = fsm.trigger(events.ROLLBACK, state);
        await commissioningRepository.update(this.mongodb, newState);

        await commService.rollbackCommissioning(id, state.entryFeeIds);

        const rollBackedState = fsm.trigger(events.COMPLETED_ROLLBACK, newState);
        return commissioningRepository.update(this.mongodb, { ...rollBackedState, income: 0, outcome: 0, margin: 0 });
      } catch (error) {
        await commissioningRepository.update(this.mongodb, state);
        return Promise.reject(error);
      }
    });
  }

  /**
   * @param {string} id
   * @returns {Promise<CommissioningState>}
   */
  async close(id) {
    return (
      commissioningRepository
        .getById(this.mongodb, id)
        .then((state) => fsm.trigger(events.CLOSE, state))
        // eslint-disable-next-line sonarjs/cognitive-complexity
        .then(async (newState) => {
          const accountingNotes = [];
          // @ts-ignore
          await newState.results.forEachAsync(async (r) => {
            const nextProductivePeriod = unparse(
              addMonths(parse(newState.productivePeriodYear, newState.productivePeriodMonth), 12),
            );
            // eslint-disable-next-line max-len
            const createAccountingNote = (
              amount,
              productionType,
              commissionType,
              totalIV,
              installments = [],
              productivePeriodYear = newState.productivePeriodYear,
              productivePeriodMonth = newState.productivePeriodMonth,
            ) =>
              amount
                ? new AccountingNote({
                    promoterId: r.promoterId,
                    productivePeriodYear,
                    productivePeriodMonth,
                    type: AccountingNoteType.COMMISSION,
                    origin: `${commissionType}+${productionType}`,
                    amount,
                    commissioningId: id,
                    additionalData: new NodeCommissionAdditionalData({
                      productionType,
                      commissionType,
                      totalIV,
                      installments,
                    }),
                  })
                : null;

            const d = r.details;
            if (this.edition === 'tcw') {
              if (r.details.installments && r.details.installments.length > 0) {
                accountingNotes.push(
                  createAccountingNote(
                    d.advanceDirectAmount,
                    'direct',
                    'advance',
                    0,
                    d.installments.filter((el) => !el.indirect && el.advanceCommission > 0),
                  ),
                  createAccountingNote(
                    d.advanceDirectAmount2021,
                    'direct-2021',
                    'advance',
                    0,
                    d.installments.filter((el) => !el.indirect && el.advanceCommission > 0),
                  ),
                  createAccountingNote(
                    d.purchaseDirectAmount - (d.replacementCommission ? d.replacementCommission.amount : 0),
                    'direct',
                    'purchase',
                    0,
                    d.installments.filter((el) => !el.indirect && el.purchaseCommission > 0),
                  ),
                  createAccountingNote(
                    d.purchaseDirectAmount2021,
                    'direct-2021',
                    'purchase',
                    0,
                    d.installments.filter((el) => !el.indirect && el.purchaseCommission > 0),
                  ),
                  createAccountingNote(
                    d.cashInDirectAmount,
                    'direct',
                    'cash-in',
                    0,
                    d.installments.filter((el) => !el.indirect && el.cashinCommission > 0),
                  ),
                  createAccountingNote(
                    d.cashInDirectAmount2021,
                    'direct-2021',
                    'cash-in',
                    0,
                    d.installments.filter((el) => !el.indirect && el.cashinCommission > 0),
                  ),
                  createAccountingNote(
                    d.advanceIndirectAmount,
                    'indirect',
                    'advance',
                    0,
                    d.installments.filter((el) => el.indirect && el.advanceCommission > 0),
                  ),
                  createAccountingNote(
                    d.advanceIndirectAmount2021,
                    'indirect-2021',
                    'advance',
                    0,
                    d.installments.filter((el) => el.indirect && el.advanceCommission > 0),
                  ),
                  createAccountingNote(
                    d.purchaseIndirectAmount,
                    'indirect',
                    'purchase',
                    0,
                    d.installments.filter((el) => el.indirect && el.purchaseCommission > 0),
                  ),
                  createAccountingNote(
                    d.purchaseIndirectAmount2021,
                    'indirect-2021',
                    'purchase',
                    0,
                    d.installments.filter((el) => el.indirect && el.purchaseCommission > 0),
                  ),
                  createAccountingNote(
                    d.cashInIndirectAmount,
                    'indirect',
                    'cash-in',
                    0,
                    d.installments.filter((el) => el.indirect && el.cashinCommission > 0),
                  ),
                  createAccountingNote(
                    d.cashInIndirectAmount2021,
                    'indirect-2021',
                    'cash-in',
                    0,
                    d.installments.filter((el) => el.indirect && el.cashinCommission > 0),
                  ),
                );
              }
            } else {
              const basis = {
                ...createAccountingNote(
                  d.basisDirectAmount +
                    d.basisIndirectAmount -
                    (d.replacementCommission ? d.replacementCommission.amount : 0),
                  '',
                  'basis',
                  d.totalIv,
                ),
                description: `Provvigioni di base (IV: ${Math.trunc(d.totalIv / 100)})`,
              };
              accountingNotes.push(
                basis,
                createAccountingNote(
                  d.rangeDirectAmount + d.rangeIndirectAmount,
                  '',
                  'range',
                  d.totalIv,
                  d.installments ? d.installments.filter((el) => !el.cashin) : [],
                ),
                createAccountingNote(d.advanceDirectProductionAmount, 'direct', 'future-direct', 0),
                createAccountingNote(d.advanceIndirectProductionAmount, 'indirect', 'future-direct', 0),
                createAccountingNote(
                  -d.advanceDirectProductionAmount,
                  'direct',
                  'write-off',
                  0,
                  [],
                  // @ts-ignore
                  nextProductivePeriod.productivePeriodYear,
                  nextProductivePeriod.productivePeriodMonth,
                ),
                createAccountingNote(
                  -d.advanceIndirectProductionAmount,
                  'direct',
                  'write-off',
                  0,
                  [],
                  // @ts-ignore
                  nextProductivePeriod.productivePeriodYear,
                  nextProductivePeriod.productivePeriodMonth,
                ),
                createAccountingNote(d.targetAmount, '', 'target', d.totalIv),
                createAccountingNote(
                  d.totalCashIn,
                  'direct',
                  'cash-in',
                  0,
                  d.installments ? d.installments.filter((el) => el.cashin) : [],
                ),
              );
            }
            if (d.managementFee) {
              accountingNotes.push(
                new AccountingNote({
                  promoterId: r.promoterId,
                  productivePeriodYear: newState.productivePeriodYear,
                  productivePeriodMonth: newState.productivePeriodMonth,
                  type: AccountingNoteType.MANAGEMENT_FEE,
                  origin: 'management-fee',
                  amount: d.managementFee,
                  commissioningId: id,
                  additionalData: {},
                }),
              );
            }
            if (d.replacementCommission) {
              accountingNotes.push(
                new AccountingNote({
                  promoterId: r.promoterId,
                  productivePeriodYear: newState.productivePeriodYear,
                  productivePeriodMonth: newState.productivePeriodMonth,
                  type: AccountingNoteType.COMMISSION,
                  origin: 'replacement-commission',
                  amount: d.replacementCommission ? d.replacementCommission.amount : 0,
                  commissioningId: id,
                  additionalData: new NodeCommissionAdditionalData({
                    productionType: 'direct',
                    commissionType: 'purchase',
                  }),
                }),
              );
            }
          });
          await Promise.all(
            accountingNotes
              .filter((an) => !!an && an.amount !== 0)
              .map((an) => this.accountingService.addAccountingNote(an)),
          );
          return commissioningRepository.update(this.mongodb, newState);
        })
    );
  }

  /**
   * @param {string} id
   * @returns {Promise<CommissioningState>}
   */
  async rollbackClose(id) {
    const state = await commissioningRepository.getById(this.mongodb, id);

    try {
      const newState = fsm.trigger(events.ROLLBACK_CLOSE, state);
      await commissioningRepository.update(this.mongodb, newState);

      await accountingRepository.deleteManyCommissioning(
        this.mongodb,
        productivePeriodHelper.parse(state.productivePeriodYear, state.productivePeriodMonth).toString(),
      );

      const nextProductivePeriod = unparse(
        addMonths(parse(newState.productivePeriodYear, newState.productivePeriodMonth), 12),
      );

      await accountingRepository.deleteManyCommissioning(
        this.mongodb,
        // eslint-disable-next-line max-len
        productivePeriodHelper
          .parse(nextProductivePeriod.productivePeriodYear, nextProductivePeriod.productivePeriodMonth)
          .toString(),
      );

      const rollBackedState = fsm.trigger(events.COMPLETED_ROLLBACK_CLOSE, newState);
      return commissioningRepository.update(this.mongodb, { ...rollBackedState });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @param {string} id
   * @param {string} exportId
   * @param {string} myUserId
   * @param {string} edition
   * @returns {Promise<DocumentObject>}
   */
  async exportResultInstalmments(id, exportId, myUserId, edition) {
    const { productivePeriodYear, productivePeriodMonth } = unparse(id);
    const adjustment = await this.adjustedPremiumService.getById(
      toQuarter(productivePeriodYear, productivePeriodMonth),
    );

    return (
      commissioningRepository
        .getById(this.mongodb, id)
        .then(async (state) => {
          const tree = await this.networkService.getNetworkAsTree(productivePeriodYear, productivePeriodMonth);
          return Promise.all(
            state.results.map(async (result) => {
              const promoterNode = tree.first((node) => node.model.promoterId === result.promoterId);
              const path = promoterNode
                ? promoterNode
                    .getPath()
                    .map((node) => node.model.name)
                    .slice(1)
                    .join(' / ')
                : '';
              const { displayName, serialNumber, networkEnterDate } = await this.promoterService.getPromoterById(
                result.promoterId,
              );
              let roleId = 'Nessuno';
              roleId = promoterNode ? await translateRoleId(this.mongodb, promoterNode.model.roleId) : 'Nessuno';

              return {
                _id: result.promoterId,
                ...result,
                path,
                roleId,
                displayName,
                serialNumber,
                networkEnterDate,
              };
            }),
          );
        })
        // eslint-disable-next-line sonarjs/cognitive-complexity
        .then(async (list) => {
          const installmentsList = [];
          const sortedResults = list.sort((a, b) => {
            if (a.displayName < b.displayName) return -1;
            if (a.displayName > b.displayName) return 1;
            return 0;
          });

          // @ts-ignore
          await sortedResults.forEachAsync(async (result) => {
            if (result.details.installments) {
              // @ts-ignore
              await result.details.installments.forEachAsync(async (installment) => {
                const practice = await this.practiceService.getPracticeById(installment.practiceId);

                const product = adjustment.products.find((adj) => adj.productId === installment.productId);
                let adjustedPremium = 0;
                if (product) {
                  const adjustedPremiumPercentage =
                    installment.practiceType === 'subscription'
                      ? product.adjustedPercentageSubscription
                      : product.adjustedPercentageAdditionalIncome;
                  adjustedPremium = (practice.premiumGross * adjustedPremiumPercentage) / 10000 / 100;
                }

                const detailPerEdition =
                  edition === 'sheltia'
                    ? {
                        iv: installment.indirect ? 0 : installment.iv / 100,
                      }
                    : {
                        premiumNet: practice.premiumNet && !installment.indirect ? practice.premiumNet / 100 : 0,
                        payin: installment.payin ? installment.payin / 100 : 0,
                        payout: installment.payout ? installment.payout / 100 : 0,
                        purchaseCommission: installment.purchaseCommission ? installment.purchaseCommission / 100 : 0,
                        advanceCommission: installment.advanceCommission ? installment.advanceCommission / 100 : 0,
                        cashinCommission: installment.cashinCommission ? installment.cashinCommission / 100 : 0,
                        adjustedPremium: installment.indirect ? 0 : adjustedPremium,
                      };

                installmentsList.push({
                  displayName: result.displayName,
                  serialNumber: result.serialNumber,
                  networkEnterDate: result.networkEnterDate,
                  roleId: result.roleId,
                  path: result.path,
                  practiceType: mapPracticeType(installment.practiceType, installment.cashin),
                  productName: installment.productName,
                  direct: installment.indirect ? 'No' : 'Si',
                  contractId: installment.contractId,
                  practiceId: installment.practiceId,
                  installment: installment.installment,
                  premiumGross: practice.premiumGross && !installment.indirect ? practice.premiumGross / 100 : 0,
                  insuredName: practice.insuredName,
                  installmentsPerYear: practice.installmentsPerYear,
                  termDate: practice.termDate,
                  productivePeriod: installment.productivePeriod,
                  ...detailPerEdition,
                });
              });
            }
          });

          return installmentsList;
        })
        .then((excelList) => {
          const detailPerEdition =
            edition === 'sheltia'
              ? [{ field: 'iv', position: 15, translation: 'IV' }]
              : [
                  { field: 'premiumNet', position: 11, translation: 'Premio Netto' },
                  { field: 'payin', position: 15, translation: 'Payin' },
                  { field: 'payout', position: 16, translation: 'Payout' },
                  { field: 'purchaseCommission', position: 17, translation: 'Provvigioni Acquisto' },
                  { field: 'advanceCommission', position: 18, translation: 'Provvigioni Anticipo' },
                  { field: 'cashinCommission', position: 18, translation: 'Provvigioni Incasso' },
                  { field: 'adjustedPremium', position: 20, translation: 'Ragguagliato' },
                ];

          return {
            headers: [
              { field: 'displayName', position: 0, translation: 'Consulente' },
              { field: 'serialNumber', position: 1, translation: 'Matricola' },
              { field: 'networkEnterDate', position: 2, translation: 'Ingresso in rete' },
              { field: 'roleId', position: 3, translation: 'Ruolo' },
              { field: 'path', position: 4, translation: 'Gerarchia' },
              { field: 'practiceType', position: 5, translation: 'Tipo Pratica' },
              { field: 'productName', position: 6, translation: 'Prodotto' },
              { field: 'direct', position: 7, translation: 'Diretta' },
              { field: 'contractId', position: 8, translation: 'Id Polizza' },
              { field: 'practiceId', position: 9, translation: 'Id Pratica' },
              { field: 'installment', position: 10, translation: 'Rata' },
              { field: 'premiumGross', position: 12, translation: 'Premio Lordo' },
              { field: 'insuredName', position: 13, translation: 'Contraente' },
              { field: 'installmentsPerYear', position: 14, translation: 'Frazionamento' },
              { field: 'termDate', position: 15, translation: 'Durata' },
              { field: 'productivePeriod', position: 19, translation: 'Periodo di competenza' },
              ...detailPerEdition,
            ],
            data: excelList,
          };
        })
        .then((data) => Promise.resolve(excelReport(data)))
        .then((buffer) =>
          this.documentService.addDocument(
            {
              type: documentTypes.COMMISSIONING_NETWORK_REPORT,
              ownerId: myUserId,
              additionalData: {
                commissioningId: id,
                exportId,
                export: true,
              },
              displayName: `Report commissioning rate ${new Date().toString()}.xlsx`,
              locked: true,
            },
            buffer,
          ),
        )
    );
  }

  /**
   * @param {string} id
   * @param {string} exportId
   * @param {string} myUserId
   * @returns {Promise<DocumentObject>}
   */
  async exportResult(id, exportId, myUserId) {
    const { productivePeriodYear, productivePeriodMonth } = unparse(id);

    return commissioningRepository
      .getById(this.mongodb, id)
      .then(async (state) => {
        const tree = await this.networkService.getNetworkAsTree(productivePeriodYear, productivePeriodMonth);
        return Promise.all(
          state.results.map(async (result) => {
            const promoterNode = tree.first((node) => node.model.promoterId === result.promoterId);
            const path = promoterNode
              ? promoterNode
                  .getPath()
                  .map((node) => node.model.name)
                  .slice(1)
                  .join(' / ')
              : '';
            const { displayName, serialNumber } = await this.promoterService.getPromoterById(result.promoterId);
            return {
              _id: result.promoterId,
              ...result,
              path,
              roleId: promoterNode ? promoterNode.model.roleId : 'none',
              displayName,
              serialNumber,
            };
          }),
        );
      })
      .then((list) =>
        // eslint-disable-next-line sonarjs/no-identical-functions
        list.sort((a, b) => {
          if (a.displayName < b.displayName) return -1;
          if (a.displayName > b.displayName) return 1;
          return 0;
        }),
      )
      .then((excelList) => ({
        headers: [
          { field: 'displayName', position: 0, translation: 'Nome' },
          { field: 'serialNumber', position: 0, translation: 'Matricola' },
          { field: 'roleId', position: 1, translation: 'Ruolo' },
          { field: 'path', position: 2, translation: 'Gerarchia' },
          { field: 'totalIv', position: 3, translation: 'Totale IV' },
          { field: 'rangeDirectAmount', position: 4, translation: 'Fascia diretta' },
          { field: 'rangeIndirectAmount', position: 5, translation: 'Fascia indiretta' },
          { field: 'advanceDirectAmount', position: 6, translation: 'Anticipazione dirette' },
          { field: 'advanceIndirectAmount', position: 7, translation: 'Anticipazione indirette' },
          { field: 'totalCashIn', position: 8, translation: 'Totale incassi' },
          { field: 'managementFee', position: 9, translation: 'Totale M.fees' },
          { field: 'totalAmount', position: 10, translation: 'Totali' },
        ],
        data: excelList.map((p) => ({
          displayName: p.displayName,
          serialNumber: p.serialNumber,
          roleId: p.roleId,
          path: p.path,
          // @ts-ignore
          totalIv: p.details.totalIv / 100,
          // @ts-ignore
          rangeDirectAmount: p.details.rangeDirectAmount / 100,
          // @ts-ignore
          rangeIndirectAmount: p.details.rangeIndirectAmount / 100,
          // @ts-ignore
          advanceDirectAmount: p.details.advanceDirectProductionAmount / 100,
          // @ts-ignore
          advanceIndirectAmount: p.details.advanceIndirectProductionAmount / 100,
          // @ts-ignore
          totalCashIn: p.details.totalCashIn / 100,
          // @ts-ignore
          managementFee: p.details.managementFee / 100,
          totalAmount: p.totalAmount / 100,
        })),
      }))
      .then((data) => Promise.resolve(excelReport(data)))
      .then((buffer) =>
        this.documentService.addDocument(
          {
            type: documentTypes.COMMISSIONING_NETWORK_REPORT,
            ownerId: myUserId,
            additionalData: {
              commissioningId: id,
              exportId,
              export: true,
            },
            displayName: `Report commissioning ${new Date().toString()}.xlsx`,
            locked: true,
          },
          buffer,
        ),
      );
  }

  insertSeed() {
    return commissioningRepository.insertSeed(this.mongodb, seed);
  }

  createIndexes() {
    return commissioningRepository.createIndexes(this.mongodb);
  }
}

module.exports = CommissioningFlowService;
