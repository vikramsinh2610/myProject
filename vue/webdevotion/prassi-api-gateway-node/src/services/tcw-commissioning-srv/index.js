const Knex = require('knex');
const Mongo = require('mongodb');
const TreeModel = require('tree-model');
const NetworkNode = require('../network-srv/network-node');
const PromoterJob = require('../promoter-job-srv/promoter-job');
const CommissionInstallment = require('../practice-commission-srv/commission-installment');
const TcwCommissioningConfigurationService = require('../tcw-commissioning-configuration-srv');
const PayoutPartitionerService = require('../tcw-payout-partitioner-srv');
const PracticeCommissionService = require('../practice-commission-srv');
const ProductConfigurationService = require('../product-configuration-srv');
const { parse } = require('../../utils/productive-period-helper');

class TcwCommissioningService {
  /**
   * @param {Mongo.Db} mongodb
   * @param {Knex} sql
   */
  constructor(mongodb, sql) {
    this.mongodb = mongodb;
    this.sql = sql;
    this.payoutPartitionerService = new PayoutPartitionerService(mongodb);
    this.practiceCommissionService = new PracticeCommissionService(this.mongodb, sql);
    this.tcwCommissioningConfigurationService = new TcwCommissioningConfigurationService(this.mongodb);
    this.productConfigurationService = new ProductConfigurationService(this.mongodb);
  }

  /**
   * @param {Array<CommissionInstallment>} commissionInstallments
   * @param {number} networkProductivePeriodYear
   * @param {number} networkProductivePeriodMonth
   * @param {TreeModel.Node<NetworkNode>} networkTree
   * @param {Array<PromoterJob>} promotersJob
   */
  async payCommissioning(
    commissionInstallments,
    networkProductivePeriodYear,
    networkProductivePeriodMonth,
    networkTree,
    promotersJob,
  ) {
    const commissioningConfig = await this.tcwCommissioningConfigurationService.getLast();

    const promotersKv = networkTree
      .all((n) => !n.isRoot() && n.model.promoterId)
      .map((n) => [
        n.model.promoterId,
        {
          promoterId: n.model.promoterId,
          roleId: n.model.roleId,
          installments: [],
        },
      ]);

    // @ts-ignore
    const promoterCommissionsMap = new Map(promotersKv);

    const installmentPayouts = await Promise.all(
      commissionInstallments.map(async (installment) => {
        const payouts = await this.payoutPartitionerService.getNetworkPayout(
          networkTree,
          installment.payout,
          installment.insurerId,
          installment.productId,
          promotersJob,
          commissioningConfig,
          this.productConfigurationService,
        );
        // eslint-disable-next-line unicorn/no-reduce
        const paidPayout = payouts.reduce((acc, item) => acc + item.amount, 0);
        const reminder = Math.trunc(installment.payout - paidPayout);
        await this.practiceCommissionService.setInstallmentAsPaid(
          installment._id,
          installment.insurerId,
          installment.payout,
          reminder,
          parse(networkProductivePeriodYear, networkProductivePeriodMonth).toString(),
        );
        return { installment, payouts };
      }),
    );

    let outcome = 0;
    let income = 0;
    const entryFeeIds = [];
    // eslint-disable-next-line sonarjs/cognitive-complexity
    installmentPayouts.forEach(({ installment, payouts }) => {
      income += installment.payin;
      entryFeeIds.push(installment._id);
      payouts.forEach((payout) => {
        const commissions = promoterCommissionsMap.get(payout.promoterId);
        if (!commissions) return;

        let {
          advanceDirectAmount = 0,
          advanceDirectAmount2021 = 0,
          advanceIndirectAmount = 0,
          advanceIndirectAmount2021 = 0,
          cashInDirectAmount = 0,
          cashInDirectAmount2021 = 0,
          cashInIndirectAmount = 0,
          cashInIndirectAmount2021 = 0,
          purchaseDirectAmount = 0,
          purchaseDirectAmount2021 = 0,
          purchaseIndirectAmount = 0,
          purchaseIndirectAmount2021 = 0,
          total = 0,
        } = commissions;

        total += payout.amount;
        const purchase = installment.commissionType === 'purchase' ? payout.amount : 0;
        const advance = installment.commissionType === 'advance' ? payout.amount : 0;
        const cashIn = installment.commissionType === 'cash-in' ? payout.amount : 0;

        if (payout.productionType === 'direct') {
          if (installment.effectDate.getTime() <= new Date(2021, 11, 30).getTime()) {
            cashInDirectAmount2021 += cashIn;
            advanceDirectAmount2021 += advance;
            purchaseDirectAmount2021 += purchase;
          } else {
            cashInDirectAmount += cashIn;
            advanceDirectAmount += advance;
            purchaseDirectAmount += purchase;
          }
        } else if (installment.effectDate.getTime() <= new Date(2021, 11, 30).getTime()) {
          cashInIndirectAmount2021 += cashIn;
          advanceIndirectAmount2021 += advance;
          purchaseIndirectAmount2021 += purchase;
        } else {
          cashInIndirectAmount += cashIn;
          advanceIndirectAmount += advance;
          purchaseIndirectAmount += purchase;
        }

        if (purchase > 0 || advance > 0 || cashIn > 0) {
          commissions.installments.push({
            _id: installment._id,
            dossierId: installment.dossierId,
            practiceType: installment.practiceType,
            practiceId: installment.practiceId,
            contractId: installment.contractId,
            installment: installment.installment,
            indirect: payout.productionType !== 'direct',
            iv: installment.iv,
            productId: installment.productId,
            productName: installment.productName,
            insuredName: installment.insuredName,
            payin: installment.payin,
            payout: installment.payout,
            purchaseCommission: purchase,
            advanceCommission: advance,
            cashinCommission: cashIn,
            cashin: installment.commissionType === 'cash-in',
            productivePeriod: installment.productivePeriod,
          });
        }

        promoterCommissionsMap.set(payout.promoterId, {
          ...commissions,
          advanceDirectAmount,
          advanceDirectAmount2021,
          advanceIndirectAmount,
          advanceIndirectAmount2021,
          cashInDirectAmount,
          cashInDirectAmount2021,
          cashInIndirectAmount,
          cashInIndirectAmount2021,
          purchaseDirectAmount,
          purchaseDirectAmount2021,
          purchaseIndirectAmount,
          purchaseIndirectAmount2021,
          total,
        });
        outcome += payout.amount;
      });
    });

    const results = [...promoterCommissionsMap.values()]
      .filter((comm) => comm.total !== 0)
      .map((comm) => {
        const details = { ...comm };
        delete details.promoterId;
        return {
          promoterId: comm.promoterId,
          roleId: comm.roleId,
          totalAmount: comm.total,
          details,
        };
      });
    return Promise.resolve({
      income,
      outcome,
      margin: income - outcome,
      entryFeeIds,
      results,
    });
  }

  /**
   * @param {string} id
   * @param {Array<string>} installmentIds
   * */
  async rollbackCommissioning(id, installmentIds) {
    await Promise.all(
      installmentIds.map((installmentId) => this.practiceCommissionService.setInstallmentAsUnpaid(installmentId)),
    );
    return this.practiceCommissionService.setCommissioningIdInstallmentAsUnpaid(id);
  }
}

module.exports = TcwCommissioningService;
