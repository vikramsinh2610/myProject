const Knex = require('knex');
const Mongo = require('mongodb');
const TreeModel = require('tree-model');
const NetworkNode = require('../network-srv/network-node');
const PromoterJob = require('../promoter-job-srv/promoter-job');
const CommissionInstallment = require('../practice-commission-srv/commission-installment');
const PracticeCommissionService = require('../practice-commission-srv');
const SheltiaCommissioningConfigurationService = require('../sheltia-commissioning-configuration-srv');
const SheltiaPromoterTargetService = require('../sheltia-promoter-target-srv');
const PromoterStat = require('./promoter-stat');
const { parse } = require('../../utils/productive-period-helper');
require('../../utils/foreach');

class SheltiaCommissioningService {
  /**
   * @param {Mongo.Db} mongodb
   * @param {Knex} sql
   */
  constructor(mongodb, sql) {
    this.mongodb = mongodb;
    this.sql = sql;
    this.sheltiaCommissioningConfigurationService = new SheltiaCommissioningConfigurationService(this.mongodb);
    this.sheltiaPromoterTargetService = new SheltiaPromoterTargetService(this.mongodb);
    this.practiceCommissionService = new PracticeCommissionService(this.mongodb, sql);
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
    const roleIds = [...new Set(promotersJob.map(({ roleId }) => roleId))];
    const roleConfigs = await Promise.all(
      roleIds.map((roleId) =>
        this.sheltiaCommissioningConfigurationService.getByRoleIdAndProductivePeriod(
          roleId,
          networkProductivePeriodYear,
          networkProductivePeriodMonth,
        ),
      ),
    );

    const promotersKv = await Promise.all(
      networkTree
        .all((n) => !n.isRoot() && n.model.promoterId)
        .map(async (n) => {
          const { promoterId } = n.model;
          const job = promotersJob.find((pj) => pj.promoterId === promoterId);
          if (!job) throw new Error(`Promoter ${promoterId} is without role`);
          const { roleId } = job;

          const config = roleConfigs.find((c) => c.roleId === roleId);
          if (!config) throw new Error(`Role ${roleId} is without config`);

          const { targetIv } = await this.sheltiaPromoterTargetService
            .getByPromoterIdAndProductivePeriod(
              promoterId,
              networkProductivePeriodYear,
              networkProductivePeriodMonth,
              roleId,
            )
            .catch(() => ({
              targetIv: 10000000000,
            }));

          return [
            promoterId,
            {
              promoterId,
              roleId,
              targetIv,
              config,
              directIv: 0,
              indirectIv: 0,
              indirectIvRole: {},
              totalIv: 0,
              basisDirectAmount: 0,
              basisIndirectAmount: 0,
              rangeDirectAmount: 0,
              advanceDirectProductionAmount: 0,
              advanceIndirectProductionAmount: 0,
              rangeIndirectAmount: 0,
              targetAmount: 0,
              totalDirect: 0,
              totalIndirect: 0,
              totalCashIn: 0,
              total: 0,
              installments: [],
            },
          ];
        }),
    );

    // @ts-ignore
    const promoterCommissionsMap = new Map(promotersKv);

    const purchaseInstallments = commissionInstallments.filter((i) => i.iv !== 0 || i.commissionType === 'advance');
    // eslint-disable-next-line sonarjs/cognitive-complexity
    purchaseInstallments.forEach((installment) => {
      const insurerNode = networkTree.first((n) => n.model.promoterId === installment.insurerId);
      if (!insurerNode) return;

      const branch = insurerNode
        .getPath()
        .filter((n) => !n.isRoot())
        .reverse();
      branch.forEach((node, idx) => {
        const { promoterId } = node.model;
        if (!promoterId) return;
        const commissions = promoterCommissionsMap.get(promoterId);
        if (!commissions) return;

        // if (promoterId === 'a3ddc75b-f834-7f4a-ac6d-24de539af6a8') {
        //   console.log('my promoter');
        // }

        if (installment.iv !== 0) {
          commissions.installments.push({
            _id: installment._id,
            dossierId: installment.dossierId,
            practiceType: installment.practiceType,
            cashin: false,
            practiceId: installment.practiceId,
            contractId: installment.contractId,
            installment: installment.installment,
            indirect: idx,
            iv: installment.iv,
            productId: installment.productId,
            productName: installment.productName,
            insuredName: installment.insuredName,
            payin: installment.payin,
            payout: installment.payout,
            purchaseCommission: 0,
            advanceCommission: 0,
            cashinCommission: 0,
            productivePeriod: installment.productivePeriod,
          });
        }

        if (idx > 0 && branch[idx - 1] && branch[idx - 1].model.promoterId !== installment.insurerId) {
          const previousRoleId = branch[idx - 1].model.roleId;
          // eslint-disable-next-line security/detect-object-injection
          const previousIndirectIvRole = commissions.indirectIvRole[previousRoleId]
            ? // eslint-disable-next-line security/detect-object-injection
              commissions.indirectIvRole[previousRoleId]
            : 0;
          // eslint-disable-next-line security/detect-object-injection
          const thisindirectIvRole = {};
          // eslint-disable-next-line security/detect-object-injection
          thisindirectIvRole[previousRoleId] = previousIndirectIvRole + installment.iv;
          commissions.indirectIvRole = { ...commissions.indirectIvRole, ...thisindirectIvRole };
        }

        promoterCommissionsMap.set(promoterId, {
          ...commissions,
          directIv: commissions.directIv + (idx ? 0 : installment.iv),
          indirectIv: commissions.indirectIv + (!idx ? 0 : installment.iv),
          totalIv: commissions.totalIv + installment.iv,
        });
      });
    });

    // eslint-disable-next-line sonarjs/cognitive-complexity
    promoterCommissionsMap.forEach((commissions, promoterId) => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const findSlotPercentage = (slots, iv, threshold = 0) => {
        const currentSlot = slots.find((r) => iv >= r.fromIv && iv <= r.toIv && iv >= threshold);
        if (!currentSlot) return 0;
        return currentSlot.percentage;
      };

      // eslint-disable-next-line unicorn/consistent-function-scoping
      const applyPercentage = (value, percentage) => Math.round((value * percentage) / 10000 || 0);
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const applyPercentageIrpefStyle = (value, slots) => {
        let commissionValue = 0;
        let previousBracketCommission = 0;
        // eslint-disable-next-line no-plusplus,no-restricted-syntax
        for (const element of slots) {
          const bracketPremiumPercentage = element.percentage;
          const bracketPremiumCommission =
            value > element.fromIv && value > element.toIv
              ? element.toIv - previousBracketCommission
              : value - previousBracketCommission;
          previousBracketCommission = element.toIv;
          if (bracketPremiumCommission > 0) {
            commissionValue += Math.trunc((bracketPremiumCommission * bracketPremiumPercentage) / 10000);
          }
        }

        return commissionValue;
      };

      const { basis, target, range } = commissions.config.purchase;
      const { directIv, indirectIv, totalIv } = commissions;

      const basisDirectAmount = applyPercentage(directIv, basis.directProductionPercentage);
      const basisIndirectAmount = applyPercentage(indirectIv, basis.indirectProductionPercentage);

      /**
       * GORLAGHETTI and MELE special rules.
       * TODO: Find a better way to handle ad personam configurations.
       *
       * Mele's rule: rangeIndirectPercentage = 0.25% if target achievement percentage is over 85%, else 0%.
       * Gorlaghetti's rule: 0.25% fixed percentage. Why not in the branch manager config?
       * Because other BMs get 0%.
       */
      const targetAchievementPercentage = totalIv / commissions.targetIv;
      const gorlaghettiId = '47661228-cb3e-1f41-9767-3358a8d32db3';
      const meleId = '15745ff1-ddb0-b244-9638-c73012c88199';

      let rangeDirectPercentage = findSlotPercentage(range.directProductionSlots, directIv);

      if (promoterId === gorlaghettiId) {
        rangeDirectPercentage = 25;
      }
      if (promoterId === meleId && targetAchievementPercentage >= 0.85) {
        rangeDirectPercentage = 25;
      }

      let rangeDirectAmount = commissions.config.directIrpefStyle
        ? applyPercentageIrpefStyle(directIv, range.directProductionSlots)
        : applyPercentage(directIv, rangeDirectPercentage);

      let rangeIndirectAmount = 0;
      let indirectIvPartial = 0;
      // eslint-disable-next-line no-param-reassign
      commissions.indirectIvRole = { ...commissions.indirectIvRole, default: undefined };

      // if (promoterId === 'a3ddc75b-f834-7f4a-ac6d-24de539af6a8') {
      //   console.log('my promoter');
      // }

      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const property in commissions.indirectIvRole) {
        const roleIdToFilter = property === 'default' ? 'all' : property;
        const indirectProductionSlots = range.indirectProductionSlots.filter(
          // eslint-disable-next-line guard-for-in,no-restricted-syntax,security/detect-object-injection
          (el) => el.roleId === roleIdToFilter,
        );

        if (indirectProductionSlots.length === 0) {
          // eslint-disable-next-line no-continue
          continue;
        }

        // eslint-disable-next-line security/detect-object-injection
        const indirectIvPerRole =
          // eslint-disable-next-line security/detect-object-injection
          property === 'default' ? commissions.indirectIv - indirectIvPartial : commissions.indirectIvRole[property];
        indirectIvPartial += indirectIvPerRole;

        // eslint-disable-next-line security/detect-object-injection
        let rangeIndirectPercentage = findSlotPercentage(indirectProductionSlots, commissions.indirectIv);

        if (promoterId === gorlaghettiId) {
          rangeIndirectPercentage = 25; // = 0.25%
        }
        if (promoterId === meleId && targetAchievementPercentage >= 0.85) {
          rangeIndirectPercentage = 25; // = 0.25%
        }

        const thisRangeIndirectAmount = commissions.config.indirectIrpefStyle
          ? // eslint-disable-next-line security/detect-object-injection
            applyPercentageIrpefStyle(indirectIvPerRole, range.indirectProductionSlots)
          : // eslint-disable-next-line security/detect-object-injection
            applyPercentage(indirectIvPerRole, rangeIndirectPercentage);
        rangeIndirectAmount += thisRangeIndirectAmount;
      }

      let advanceDirectProductionAmount = 0;
      let advanceIndirectProductionAmount = 0;
      if (
        commissions.config.advanceDirectProductionPercentage &&
        commissions.config.advanceDirectProductionPercentage !== 0
      ) {
        const originaRangeDirectAmount = rangeDirectAmount;
        rangeDirectAmount = applyPercentage(
          originaRangeDirectAmount,
          10000 - commissions.config.advanceDirectProductionPercentage,
        );
        advanceDirectProductionAmount = applyPercentage(
          originaRangeDirectAmount,
          commissions.config.advanceDirectProductionPercentage,
        );
      }

      if (
        commissions.config.advanceIndirectProductionPercentage &&
        commissions.config.advanceIndirectProductionPercentage !== 0
      ) {
        const originaRangeIndirectAmount = rangeIndirectAmount;
        rangeIndirectAmount = applyPercentage(
          originaRangeIndirectAmount,
          10000 - commissions.config.advanceIndirectProductionPercentage,
        );
        advanceIndirectProductionAmount = applyPercentage(
          originaRangeIndirectAmount,
          commissions.config.advanceIndirectProductionPercentage,
        );
      }

      const targetPercentage = findSlotPercentage(target.slots, totalIv, commissions.targetIv);
      const targetAmount = applyPercentage(totalIv, targetPercentage);

      const totalDirect = basisDirectAmount + rangeDirectAmount + targetAmount + advanceDirectProductionAmount;
      const totalIndirect = basisIndirectAmount + rangeIndirectAmount + advanceIndirectProductionAmount;

      promoterCommissionsMap.set(promoterId, {
        ...commissions,
        basisDirectAmount,
        basisIndirectAmount,
        advanceDirectProductionAmount,
        advanceIndirectProductionAmount,
        rangeDirectAmount,
        rangeIndirectAmount,
        targetAmount,
        totalDirect,
        totalIndirect,
        total: totalDirect + totalIndirect,
      });
    });

    // eslint-disable-next-line unicorn/no-reduce
    const totalPayin = commissionInstallments.reduce((acc, item) => acc + item.payin, 0);
    // eslint-disable-next-line unicorn/no-reduce
    const { totalPayout, totalIv } = [...promoterCommissionsMap.values()].reduce(
      (acc, item) => ({ totalPayout: acc.totalPayout + item.total, totalIv: acc.totalIv + item.totalIv }),
      { totalPayout: 0, totalIv: 0 },
    );
    const amountPerIv = totalPayout / totalIv;

    const installmentPayPromises = purchaseInstallments.map((installment) => {
      const payout = Math.round(amountPerIv * installment.iv);
      return {
        _id: installment._id,
        insurerId: installment.insurerId,
        amount: payout,
        reminder: installment.payin - payout,
        commissioningId: parse(networkProductivePeriodYear, networkProductivePeriodMonth).toString(),
      };
    });

    // Commissioning cash in
    const cashInInstallments = commissionInstallments.filter((i) => i.iv === 0 && i.commissionType !== 'advance');

    cashInInstallments.forEach((installment) => {
      const promoterId = installment.insurerId;
      const commissions = promoterCommissionsMap.get(promoterId);
      if (!commissions) {
        installmentPayPromises.push({
          _id: installment._id,
          insurerId: installment.insurerId,
          amount: 0,
          reminder: 0,
          commissioningId: parse(networkProductivePeriodYear, networkProductivePeriodMonth).toString(),
        });
        return;
      }

      const productConfig = commissions.config.cashIn.find((c) => c.productId === installment.productId);
      if (!productConfig) {
        installmentPayPromises.push({
          _id: installment._id,
          insurerId: installment.insurerId,
          amount: 0,
          reminder: 0,
          commissioningId: parse(networkProductivePeriodYear, networkProductivePeriodMonth).toString(),
        });
        return;
      }

      const amount = Math.round(productConfig.amount / installment.installmentsPerYear);

      if (installment.iv !== 0) {
        commissions.installments.push({
          _id: installment._id,
          dossierId: installment.dossierId,
          practiceType: installment.practiceType,
          cashin: true,
          practiceId: installment.practiceId,
          contractId: installment.contractId,
          installment: installment.installment,
          indirect: false,
          productId: installment.productId,
          productName: installment.productName,
          payin: installment.payin,
          payout: installment.payout,
          iv: installment.iv,
          purchaseCommission: 0,
          advanceCommission: 0,
          cashinCommission: 0,
          productivePeriod: installment.productivePeriod,
        });
      }

      promoterCommissionsMap.set(promoterId, {
        ...commissions,
        totalCashIn: commissions.totalCashIn + amount,
        total: commissions.total + amount,
      });

      installmentPayPromises.push({
        _id: installment._id,
        insurerId: installment.insurerId,
        amount,
        reminder: installment.payin - amount,
        commissioningId: parse(networkProductivePeriodYear, networkProductivePeriodMonth).toString(),
      });
    });

    // @ts-ignore
    await installmentPayPromises.forEachAsync(async (installmentPay) => {
      await this.practiceCommissionService.setInstallmentAsPaid(
        installmentPay._id,
        installmentPay.insurerId,
        installmentPay.amount,
        installmentPay.reminder,
        installmentPay.commissioningId,
      );
    });

    const result = {
      income: totalPayin,
      outcome: totalPayout,
      margin: totalPayin - totalPayout,
      entryFeeIds: commissionInstallments.map(({ _id }) => _id),
      results: [...promoterCommissionsMap.values()]
        .filter((comm) => comm.totalIv !== 0)
        .map((comm) => {
          const details = { ...comm };
          delete details.promoterId;
          delete details.config;
          delete details.roleId;
          return {
            promoterId: comm.promoterId,
            roleId: comm.roleId,
            totalAmount: comm.total,
            details,
          };
        }),
    };

    /**
     * Save/Replace stats for Commissioning 2019 letters.
     */
    await Promise.all(
      [...promoterCommissionsMap.values()]
        // eslint-disable-next-line sonarjs/no-identical-functions
        .map((comm) => {
          const details = { ...comm };
          delete details.promoterId;
          delete details.config;
          delete details.roleId;
          return {
            promoterId: comm.promoterId,
            roleId: comm.roleId,
            totalAmount: comm.total,
            details,
          };
        })
        .map((r) => {
          const stat = new PromoterStat({
            promoterId: r.promoterId,
            productivePeriodYear: networkProductivePeriodYear,
            productivePeriodMonth: networkProductivePeriodMonth,
            totalIv: r.details.totalIv,
            totalIvDirect: r.details.directIv,
            totalIvIndirect: r.details.indirectIv,
            totalAmountDirect: r.details.rangeDirectAmount + r.details.advanceDirectProductionAmount,
            totalAmountIndirect: r.details.rangeIndirectAmount + r.details.advanceDirectProductionAmount,
            totalAmount:
              r.details.rangeDirectAmount +
              r.details.rangeIndirectAmount +
              r.details.advanceDirectProductionAmount +
              r.details.advanceIndirectProductionAmount,
            percentage: r.details.totalIv
              ? Math.round(
                  ((r.details.rangeDirectAmount +
                    r.details.rangeIndirectAmount +
                    r.details.advanceDirectProductionAmount +
                    r.details.advanceIndirectProductionAmount) /
                    r.details.totalIv) *
                    10000,
                )
              : 0,
          });

          return this.mongodb
            .collection('sheltia-commissioning-stat')
            .updateOne({ _id: stat._id }, { $set: stat }, { upsert: true });
        }),
    );

    return Promise.resolve(result);
  }

  /**
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @param {string} promoterId
   * @returns {Promise<PromoterStat>}
   */
  getPromoterStats(productivePeriodYear, productivePeriodMonth, promoterId) {
    return this.mongodb
      .collection('sheltia-commissioning-stat')
      .findOne({ productivePeriodYear, productivePeriodMonth, promoterId })
      .then((result) => {
        if (result !== undefined && result !== null) return new PromoterStat(result);
        return new PromoterStat({
          _id: 'no-result',
          promoterId,
          productivePeriodYear,
          productivePeriodMonth,
          totalIv: 0,
          totalIvDirect: 0,
          totalIvIndirect: 0,
          totalAmount: 0,
          totalAmountDirect: 0,
          totalAmountIndirect: 0,
          percentage: 0,
        });
      });
  }

  /**
   * @param {string} id
   * @param {Array<string>} installmentIds
   * */
  async rollbackCommissioning(id, installmentIds) {
    // @ts-ignore
    await installmentIds.forEachAsync(async (installmentId) => {
      await this.practiceCommissionService.setInstallmentAsUnpaid(installmentId);
    });
    return this.practiceCommissionService.setCommissioningIdInstallmentAsUnpaid(id);
  }
}

module.exports = SheltiaCommissioningService;
