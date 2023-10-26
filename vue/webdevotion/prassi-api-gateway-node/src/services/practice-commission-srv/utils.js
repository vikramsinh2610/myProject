const Practice = require('../practice-srv/practice');
const ProductConfigurationService = require('../product-configuration-srv');
const ProductConfiguration = require('../product-configuration-srv/product-configuration');
const CommissionInstallment = require('./commission-installment');
const productivePeriodHelper = require('../../utils/productive-period-helper');
const { types: practiceTypes } = require('../practice-srv/practice-types');

function generateYearSequence(fromDate, toDate) {
  if (!fromDate || !toDate) {
    throw new Error('data di decorrenza o emissione non valida');
  }
  const fromYear = fromDate.getFullYear();
  const toYear = toDate.getFullYear();
  // eslint-disable-next-line unicorn/no-new-array
  return [...new Array(toYear - fromYear)].map((value, index) => index + 1);
}

/**
 * @param {Practice} practice
 * @param {object} commission
 * @param {ProductConfiguration} productConfig
 * @returns {Array<CommissionInstallment>}
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function toCommissionInstallments(practice, commission, productConfig) {
  const commissions = [];
  for (let n = 1; n <= practice.installmentsPerYear; n += 1) {
    const installment = n + (commission.year - 1) * practice.installmentsPerYear;

    /**
     * This is a really bad workaround for Zurich Progetto on TCW.
     * Use month on subscription only for monthly practice.
     *
     * To remove this workaround, remove the if statement and keep the content.
     */
    let installmentsOnSubscription = 1;
    if (practice.installmentsPerYear === 12 || productConfig.productCode !== '17_AC TCW') {
      installmentsOnSubscription = Math.max(
        Math.ceil(productConfig.monthsOnSubscription / (12 / practice.installmentsPerYear)),
        1,
      );
    }

    // Installments on subscription are an unique big installment.
    // Skip all installments on subscription except the first.
    // eslint-disable-next-line no-continue
    if (installment !== 1 && installment <= installmentsOnSubscription) continue;

    const isAdvance = productConfig.advance && commission.year === 1 && n > installmentsOnSubscription;
    const forecast = true;
    const createDate = new Date(Date.now());
    const paidToNetwork = false;
    const commissionType = (() => {
      if (isAdvance) return 'advance';
      if (commission.year <= productConfig.subscriptionYears) return 'purchase';
      return 'cash-in';
    })();

    const effectProductivePeriodYear = new Date(practice.effectDate).getUTCFullYear();
    const effectProductivePeriodMonth = new Date(practice.effectDate).getUTCMonth() + 1;
    const { productivePeriodYear, productivePeriodMonth } = productivePeriodHelper.unparse(
      productivePeriodHelper.addMonths(
        productivePeriodHelper.parse(effectProductivePeriodYear, effectProductivePeriodMonth),
        (12 / practice.installmentsPerYear) * (installment - 1),
      ),
    );
    const commissioningProductivePeriodYear =
      installment === 1 || isAdvance ? practice.effectProductivePeriodYear : productivePeriodYear;
    const commissioningProductivePeriodMonth =
      installment === 1 || isAdvance ? practice.effectProductivePeriodMonth : productivePeriodMonth;

    const dueDate = productivePeriodHelper.toDate(
      productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth),
    );
    dueDate.setUTCDate(practice.effectDate.getUTCDate());

    // If is the 1st installment, makes it the container for all of that are on subscrption
    const aggregateInstallmentsN = installment === 1 ? installmentsOnSubscription : 1;
    const remainder = n === 1 ? Math.trunc(commission.payin % practice.installmentsPerYear) : 0;
    let payin = Math.trunc(commission.payin / practice.installmentsPerYear) * aggregateInstallmentsN + remainder || 0;
    const payout = Math.round(commission.payout / practice.installmentsPerYear) * aggregateInstallmentsN || 0;

    // IF it's company advance, 1st installment includes all the 1st year payin and payout
    if (productConfig.companyAdvance && installment === 1) {
      // eslint-disable-next-line prefer-destructuring
      payin = commission.payin;
    }
    // If it's company advance, and it's the first year excluding 1st installment, payin and payout are 0
    if (productConfig.companyAdvance && installment <= practice.installmentsPerYear && installment !== 1) {
      payin = 0;
    }

    const margin = payin - payout;

    const {
      dossierId,
      practiceId,
      contractId,
      productId,
      productName,
      companyId,
      companyName,
      effectDate,
      termDate,
      insurerId,
      premiumNet,
      premiumGross,
      optionId,
      customerId,
      insuredName,
      postForce,
    } = practice;
    commissions.push(
      new CommissionInstallment({
        dossierId,
        practiceId,
        contractId,
        productId,
        productName,
        companyId,
        companyName,
        customerId,
        insuredName,
        effectDate,
        termDate,
        insurerId,
        premiumNet,
        premiumGross,
        optionId,
        practiceType: practice.type === practiceTypes.SPECIAL ? practiceTypes.SUBSCRIPTION : practice.type,
        practiceBaseType: practice.type,
        createDate,
        installment,
        productivePeriodYear,
        productivePeriodMonth,
        commissioningProductivePeriodYear,
        commissioningProductivePeriodMonth,
        payin,
        margin,
        payout,
        advance: isAdvance,
        forecast,
        paidToNetwork,
        dueDate,
        commissionType,
        installmentsPerYear: practice.installmentsPerYear,
        postForce,
      }),
    );
  }

  return commissions;
}

/**
 * @param {*} payinService
 * @param {*} payoutService
 * @param {ProductConfigurationService} productConfigurationService
 * @param {Practice} practice
 * @returns {Promise<Array<CommissionInstallment>>}
 */
function generatePracticeFees(payinService, payoutService, productConfigurationService, practice) {
  return productConfigurationService.getByProductId(practice.productId).then((productConfig) => {
    const yearlyCommissions = generateYearSequence(practice.effectDate, practice.termDate).map((year) => {
      const payin = payinService.calculatePayin(
        practice.premiumNet,
        practice.premiumGross,
        practice.optionId,
        year,
        productConfig,
        practice.commissionSacrifice,
      );
      const payout = payoutService.calculatePayout(
        practice.premiumNet,
        practice.premiumGross,
        practice.optionId,
        year,
        payin,
        productConfig,
      );
      return { year, payin, payout };
    });

    const commissionInstallments = [];
    yearlyCommissions.forEach((yearlyCommission) =>
      commissionInstallments.push(...toCommissionInstallments(practice, yearlyCommission, productConfig)),
    );
    return commissionInstallments;
  });
}

/**
 * @param {*} payoutService
 * @param {ProductConfigurationService} productConfigurationService
 * @param {Practice} practice
 * @param {number} payin
 * @returns {Promise<Array<CommissionInstallment>>}
 */
function calculatePayoutFromPayin(payoutService, productConfigurationService, practice, payin) {
  return productConfigurationService.getByProductId(practice.productId).then((productConfig) => {
    const yearlyCommissions = generateYearSequence(practice.effectDate, practice.termDate).map((year) => {
      const payout = payoutService.calculatePayout(
        practice.premiumNet,
        practice.premiumGross,
        practice.optionId,
        year,
        payin,
        productConfig,
      );
      return { year, payin, payout };
    });

    const commissionInstallments = [];
    yearlyCommissions.forEach((yearlyCommission) =>
      commissionInstallments.push(...toCommissionInstallments(practice, yearlyCommission, productConfig)),
    );
    return commissionInstallments;
  });
}

module.exports = {
  generateYearSequence,
  generatePracticeFees,
  toCommissionInstallments,
  calculatePayoutFromPayin,
};
