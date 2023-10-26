const PromoterJob = require('../promoter-job-srv/promoter-job');
const roleIds = require('../promoter-job-srv/role-ids');
const CommissionInstallment = require('../practice-commission-srv/commission-installment');
const configurationRepository = require('./product-configuration-repository');
const { seed: tcwSeed } = require('./seed/tcw');
const { seed: sheltiaSeed } = require('./seed/sheltia');

class SignalerCommissionService {
  constructor(mongodb) {
    this.mongodb = mongodb;
  }

  /**
   * @param {Array<CommissionInstallment>} commissionInstallments
   * @param {Array<PromoterJob>} promotersJob
   */
  async paySignalerCommission(commissionInstallments, promotersJob) {
    const promoterIds = promotersJob
      .filter((job) => job.roleId === roleIds.SIGNALLER)
      .map(({ promoterId }) => promoterId);
    if (promoterIds.length === 0) return [];

    const productIds = new Set(commissionInstallments.map(({ productId }) => productId));
    const productConfigurations = await Promise.all(
      [...productIds.values()].map((productId) => configurationRepository.getByProductId(this.mongodb, productId)),
    );

    return promoterIds.map((promoterId) => ({
      promoterId,
      roleId: roleIds.SIGNALLER,
      amount: commissionInstallments
        .filter((installment) => installment.insurerId === promoterId && installment.installment === 1)
        .map((installment) => {
          const config = productConfigurations.find((c) => c._id === installment.productId);
          if (!config) return 0;
          return config.amount;
        })
        // eslint-disable-next-line unicorn/no-reduce
        .reduce((acc, item) => acc + item, 0),
      details: {
        roleId: roleIds.SIGNALLER,
        installments: commissionInstallments
          .filter((installment) => installment.insurerId === promoterId && installment.installment === 1)
          .map((installment) => ({
            _id: installment._id,
            dossierId: installment.dossierId,
            practiceType: installment.practiceType,
            practiceId: installment.practiceId,
            contractId: installment.contractId,
            installment: installment.installment,
            indirect: false,
            iv: installment.iv,
            productId: installment.productId,
            productName: installment.productName,
            payin: installment.payin,
            payout: installment.payout,
            purchaseCommission: 0,
            advanceCommission: 0,
            cashin: false,
            productivePeriod: installment.productivePeriod,
          })),
      },
    }));
  }

  insertSeed(edition) {
    const seed = edition === 'tcw' ? tcwSeed : sheltiaSeed;
    return configurationRepository.insertSeed(this.mongodb, seed);
  }

  createIndexes() {
    return configurationRepository.createIndexes(this.mongodb);
  }
}

module.exports = SignalerCommissionService;
