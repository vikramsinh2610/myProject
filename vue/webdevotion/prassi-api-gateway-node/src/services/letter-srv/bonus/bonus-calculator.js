const BonusLetter = require('./bonus-letter');
const Absorbability = require('./absorbability');
const ComputedBonus = require('./computed-bonus');
const { paymentFrequencyEnum } = require('./payment-frequency-enum');
const { paymentTimeEnum } = require('./payment-time-enum');
const productivePeriodHelper = require("../../../utils/productive-period-helper");

function getProductivePeriods(letter, productivePeriodYear, productivePeriodMonth) {
  return {
    productivePeriod: productivePeriodHelper.parse(productivePeriodYear, productivePeriodMonth),
    fromProductivePeriod: productivePeriodHelper.parse(
      letter.fromProductivePeriodYear,
      letter.fromProductivePeriodMonth,
    ),
    toProductivePeriod: productivePeriodHelper.parse(letter.toProductivePeriodYear, letter.toProductivePeriodMonth),
  };
}

/**
 * @param {BonusLetter} letter
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 * @returns {Array<ComputedBonus>}
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function calculateBonuses(letter, productivePeriodYear, productivePeriodMonth) {
  const { productivePeriod, fromProductivePeriod, toProductivePeriod } = getProductivePeriods(
    letter,
    productivePeriodYear,
    productivePeriodMonth,
  );
  if (productivePeriod < fromProductivePeriod) return [];

  /**
   * GUARANTEED BONUSES
   */
  const guaranteedBonuses = [];
  letter.guaranteedBonuses.forEach((guaranteed) => {
    const bonus = new ComputedBonus({
      targetPercentage: 10000,
      absorbability: guaranteed.absorbability,
      accruedAmount: 0,
      targetAmount: guaranteed.amount,
      expireDate: letter.willExpireDate,
      type: `${letter.type === 'guaranteed-variable-minimum' ? 'gmv-' : ''}guaranteed+${letter.paymentFrequency}`,
      targetComplete: true,
      ...(letter.invoiceDescription ? { invoiceDescription: letter.invoiceDescription } : {}),
    });
    // Pay the bonus if NOW it's the correct productive period
    if (
      (letter.paymentFrequency === paymentFrequencyEnum.ONE_TIME && productivePeriod === toProductivePeriod) ||
      (letter.paymentFrequency === paymentFrequencyEnum.MONTHLY && productivePeriod <= toProductivePeriod)
    ) {
      bonus.accruedAmount = guaranteed.amount;
      guaranteedBonuses.push(bonus);
    }
  });

  /**
   * GUARANTEED VARIABLE BONUSES
   */
  const guaranteedVariableBonuses = [];
  letter.guaranteedVariableBonuses.forEach((guaranteed) => {
    const kpiPercentage = Math.trunc(
      (letter.conditionedBonuses[0].conditions[0].targets[0].kpi.value /
        letter.conditionedBonuses[0].conditions[0].targets[0].targetValue) *
        10000,
    );
    const variableBonusFiltered = guaranteed.variableBonus.filter((f) => f.adjustedPercentage < kpiPercentage);
    // eslint-disable-next-line unicorn/no-reduce
    const formula = variableBonusFiltered.reduce(
      (acc, curr) => (curr.adjustedPercentage < acc.adjustedPercentage ? acc : curr),
      { adjustedPercentage: 0, formula: '0' },
    );

    // eslint-disable-next-line no-unused-vars
    const x = kpiPercentage / 100;

    // eslint-disable-next-line no-eval, security/detect-eval-with-expression
    const paidGuaranteed = eval(formula.formula);

    const bonus = new ComputedBonus({
      targetPercentage: kpiPercentage,
      absorbability: guaranteed.absorbability,
      accruedAmount: 0,
      targetAmount: guaranteed.amount,
      expireDate: letter.willExpireDate,
      type: `${letter.type === 'guaranteed-variable-minimum' ? 'gmv-' : ''}guaranteed-variable`,
      ...(letter.invoiceDescription ? { invoiceDescription: letter.invoiceDescription } : {}),
      targetComplete: true,
      kpi: letter.conditionedBonuses[0].conditions,
    });
    // Pay the bonus if NOW it's the correct productive period
    if (
      (letter.paymentFrequency === paymentFrequencyEnum.ONE_TIME && productivePeriod === toProductivePeriod) ||
      (letter.paymentFrequency === paymentFrequencyEnum.MONTHLY && productivePeriod <= toProductivePeriod)
    ) {
      bonus.accruedAmount = (guaranteed.amount / 100) * paidGuaranteed;
      guaranteedVariableBonuses.push(bonus);
    }
  });

  /**
   * CONDITIONED BONUSES
   */
  const conditionedBonuses = [];
  letter.conditionedBonuses.forEach((conditioned) => {
    if (letter.guaranteedVariableBonuses.length > 0) return;

    /**
     * Evaluate all conditions
     * To obtain a conditioned bonus, ALL of conditions must be completed
     */
    const conditionsResult = conditioned.conditions.map((condition) => {
      /**
       * A conditions is composed by targets.
       * Each target has a weigth.
       * The condition completition is the sum of the target completition percentage
       */
        // eslint-disable-next-line unicorn/no-reduce
      const targetsPercentage = condition.targets.reduce((result, target) => {
        // Calculate target KPI completition percentage
        const kpiPercentage = Math.trunc((target.kpi.value / target.targetValue) * 10000);
        // Adjust the KPI percentage with the target weigth
        return result + Math.trunc((kpiPercentage * target.weightPercentage) / 10000);
      }, 0);
      /**
       * If target percentage is equal-over 100%, the target it's complete. Cap it to 100%å
       */
      if (targetsPercentage >= 10000) return { targetsComplete: true, targetsPercentage: 10000 };
      return { targetsComplete: false, targetsPercentage };
    });

    /**
     * Check if all conditions are successful
     * And calculate the total percentage
     */
      // eslint-disable-next-line unicorn/no-reduce
    const conditionResult = conditionsResult.reduce(
      (result, item) => ({
        targetComplete: result.targetComplete === false ? false : item.targetsComplete,
        targetPercentage: result.targetPercentage + item.targetsPercentage,
      }),
      { targetComplete: true, targetPercentage: 0 },
    );

    const bonus = new ComputedBonus({
      targetComplete: conditionResult.targetComplete,
      // Calculate the average condition-completition percentage. Just for statistical purpose
      targetPercentage: Math.trunc(conditionResult.targetPercentage / conditionsResult.length),
      expireDate: letter.willExpireDate,
      absorbability: new Absorbability({ indirectProductionPercentage: 0, directProductionPercentage: 0 }),
      accruedAmount: 0,
      targetAmount: conditioned.amount,
      type: `conditioned+${letter.type}+${conditioned.paymentTime}`,
      ...(letter.invoiceDescription ? { invoiceDescription: letter.invoiceDescription } : {}),
      kpi: conditioned.conditions,
    });

    /**
     * Assign bonus if it's a prepayment AND
     * - If is the first productive period OR
     * - it's monthly and it's not the last month (because the check is in the last month) OR
     * - It's monthly, it's the last month and the target is completed
     */
    if (
      conditioned.paymentTime === paymentTimeEnum.PREPAYMENT &&
      (productivePeriod === fromProductivePeriod ||
        (letter.paymentFrequency === paymentFrequencyEnum.MONTHLY && productivePeriod < toProductivePeriod) ||
        (letter.paymentFrequency === paymentFrequencyEnum.MONTHLY &&
          productivePeriod === toProductivePeriod &&
          bonus.targetComplete === true))
    ) {
      bonus.accruedAmount = conditioned.amount;
      conditionedBonuses.push(bonus);
    }

    // Calculate delayed payment productive period
    const delayedToProductivePeriod = productivePeriodHelper.addMonths(
      toProductivePeriod,
      conditioned.productivePeriodPaymentDelay,
    );
    /**
     * Assign bonus if it's a delayed payment
     * - If it's monthly OR
     * - If it's the payment productive period (letter expire + delay)
     */
    if (
      conditioned.paymentTime === paymentTimeEnum.PAYMENT_DELAYED &&
      (productivePeriod === delayedToProductivePeriod || letter.paymentFrequency === paymentFrequencyEnum.MONTHLY)
    ) {
      // Assign the bonus
      bonus.accruedAmount = bonus.targetComplete ? conditioned.amount : 0;
      conditionedBonuses.push(bonus);
    }

    /**
     * Recovery of prepaid bonus if bonus completion is failed
     * This happen in the last month of the letter
     */
    if (
      conditioned.paymentTime === paymentTimeEnum.PREPAYMENT &&
      productivePeriod === toProductivePeriod &&
      bonus.targetComplete === false
    ) {
      // Calculate the number of prepayd months
      const monthlyBonusesNumber =
        letter.paymentFrequency === paymentFrequencyEnum.MONTHLY
          ? productivePeriodHelper.differenceBetween(toProductivePeriod, fromProductivePeriod) + 2
          : 1;
      // Generate the recovery
      conditionedBonuses.push(
        new ComputedBonus({
          targetComplete: false,
          targetPercentage: conditioned.maxRecoveryPercentage,
          expireDate: letter.willExpireDate,
          absorbability: new Absorbability({ indirectProductionPercentage: 0, directProductionPercentage: 0 }),
          accruedAmount: Math.max(monthlyBonusesNumber - 1, 1) * -conditioned.amount,
          targetAmount: conditioned.amount * monthlyBonusesNumber,
          type: `conditioned+${letter.type}+recovery`,
          ...(letter.invoiceDescription ? { invoiceDescription: letter.invoiceDescription } : {}),
        }),
      );
    }
  });

  /**
   * In case of multiple conditioned bonuses
   * Cumulate: include all conditioned bonuses in the result
   * Not Cumulate: include only the best conditoned bonus: the one with the highest amount
   */
  if (letter.cumulateConditionedBonuses || conditionedBonuses.length === 0) {
    return [...conditionedBonuses, ...guaranteedBonuses, ...guaranteedVariableBonuses];
  }
  // If conditioned are not cumulable, get the one with the highest amount
  return [
    conditionedBonuses.sort((a, b) => b.accruedAmount - a.accruedAmount).shift(),
    ...guaranteedBonuses,
    ...guaranteedVariableBonuses,
  ];
}

module.exports = { calculateBonuses };
