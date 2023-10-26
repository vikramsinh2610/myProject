const TreeModel = require('tree-model');
const NetworkNode = require('../network-srv/network-node');
const Practice = require('../practice-srv/practice');
const AdjustedPremiumConfiguration = require('../adjusted-premium-srv/adjusted-premium-configuration');
const ProductConfiguration = require('../product-configuration-srv/product-configuration');
const { types } = require('../practice-srv/practice-types');
const { parse } = require('../../utils/productive-period-helper');

/**
 * @param {Array<Practice>} practices
 * @returns {Promise<number>}
 */
function iv(practices) {
  // eslint-disable-next-line unicorn/no-reduce
  return Promise.resolve(practices.reduce((acc, item) => acc + item.iv, 0));
}

/**
 * @param {Practice} practice
 * @param {object} product
 * @param {ProductConfiguration} productConfiguration
 * @returns {number}
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function adjustedPremiumSingleCalculation(practice, product, productConfiguration) {
  let adjustedPremiumPercentage =
    practice.type === types.SUBSCRIPTION
      ? product.adjustedPercentageSubscription
      : product.adjustedPercentageAdditionalIncome;

  productConfiguration.adjustedAdvance.sort((a, b) => {
    const aPeriod = parse(a.fromProductivePeriodYear, a.fromProductivePeriodMonth);
    const bPeriod = parse(b.fromProductivePeriodYear, b.fromProductivePeriodMonth);

    if (aPeriod < bPeriod) {
      return -1;
    }
    if (aPeriod > bPeriod) {
      return 1;
    }
    return 0;
  });

  const practicePeriod = parse(practice.effectProductivePeriodYear, practice.effectProductivePeriodMonth);
  let selectedOptionAdvance;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < productConfiguration.adjustedAdvance.length; i++) {
    // eslint-disable-next-line security/detect-object-injection,max-len
    const selectedConfiguration = productConfiguration.adjustedAdvance[i];
    const periodDate = parse(
      selectedConfiguration.fromProductivePeriodYear,
      selectedConfiguration.fromProductivePeriodMonth,
    );
    if (practicePeriod >= periodDate) {
      selectedOptionAdvance = selectedConfiguration;
      break;
    }
  }

  // eslint-disable-next-line sonarjs/no-identical-functions
  productConfiguration.adjustedBrackets.sort((a, b) => {
    const goFirst = -1;
    const goAfter = 1;
    const aPeriod = parse(a.fromProductivePeriodYear, a.fromProductivePeriodMonth);
    const bPeriod = parse(b.fromProductivePeriodYear, b.fromProductivePeriodMonth);

    if (aPeriod > bPeriod) {
      return goFirst;
    }

    if (aPeriod < bPeriod) {
      return goAfter;
    }

    if (a.duration > b.duration) {
      return goFirst;
    }

    if (a.duration < b.duration) {
      return goAfter;
    }

    if (a.advanceYears > b.advanceYears) {
      return goFirst;
    }

    if (a.advanceYears < b.advanceYears) {
      return goAfter;
    }

    if (a.yearly < b.yearly) {
      return goFirst;
    }

    if (a.yearly > b.yearly) {
      return goAfter;
    }

    return 0;
  });

  let selectedOptionBrackets;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < productConfiguration.adjustedBrackets.length; i++) {
    // eslint-disable-next-line security/detect-object-injection,max-len
    const selectedConfiguration = productConfiguration.adjustedBrackets[i];
    const periodDate = parse(
      selectedConfiguration.fromProductivePeriodYear,
      selectedConfiguration.fromProductivePeriodMonth,
    );
    const yearsOnSubscription = Math.trunc(practice.amountPaid / practice.premiumGross);

    if (
      practicePeriod >= periodDate &&
      practice.years >= selectedConfiguration.duration / 100 &&
      practice.installmentsPerYear <= selectedConfiguration.yearly / 100 &&
      yearsOnSubscription >= selectedConfiguration.advanceYears / 100
    ) {
      const selectedBracketsList = productConfiguration.adjustedBrackets.filter(
        (el) =>
          el.fromProductivePeriodMonth === selectedConfiguration.fromProductivePeriodMonth &&
          el.fromProductivePeriodYear === selectedConfiguration.fromProductivePeriodYear &&
          el.duration <= selectedConfiguration.duration  &&
          el.yearly >= selectedConfiguration.yearly &&
          el.advanceYears <= selectedConfiguration.advanceYears,
      );
      const maxDuration = Math.max(...selectedBracketsList.map((el) => el.duration));
      const maxYearly = Math.min(...selectedBracketsList.map((el) => el.yearly));
      const maxAdvanceYears = Math.max(...selectedBracketsList.map((el) => el.advanceYears));

      selectedOptionBrackets = productConfiguration.adjustedBrackets.find(
        (el) =>
          el.fromProductivePeriodMonth === selectedConfiguration.fromProductivePeriodMonth &&
          el.fromProductivePeriodYear === selectedConfiguration.fromProductivePeriodYear &&
          el.duration === maxDuration &&
          el.advanceYears === maxAdvanceYears &&
          el.yearly === maxYearly,
      );
      if (selectedOptionBrackets) {
        break;
      }
    }
  }

  if (selectedOptionAdvance) {
    const yearsOnSubscription = Math.trunc(practice.amountPaid / practice.premiumGross);
    const isOptionAdvance = yearsOnSubscription >= selectedOptionAdvance.advanceYears / 100;
    const isOptionYearly = practice.installmentsPerYear <= selectedOptionAdvance.yearly / 100;

    if (isOptionAdvance) {
      adjustedPremiumPercentage += selectedOptionAdvance.advancePremium;
    } else if (isOptionYearly) {
      adjustedPremiumPercentage += selectedOptionAdvance.yearlyPremium;
    }
  } else if (selectedOptionBrackets) {
    const selectedBracketsList = productConfiguration.adjustedBrackets.filter(
      (el) =>
        el.fromProductivePeriodMonth === selectedOptionBrackets.fromProductivePeriodMonth &&
        el.fromProductivePeriodYear === selectedOptionBrackets.fromProductivePeriodYear &&
        el.duration === selectedOptionBrackets.duration &&
        el.advanceYears === selectedOptionBrackets.advanceYears &&
        el.yearly === selectedOptionBrackets.yearly,
    );

    selectedBracketsList.sort((a, b) => {
      if (a.amount < b.amount) {
        return -1;
      }
      if (a.amount > b.amount) {
        return 1;
      }
      return 0;
    });

    let adjustedPremiumValue = 0;
    let previousBracketPremium = 0;
    // eslint-disable-next-line no-plusplus,no-restricted-syntax
    for (const element of selectedBracketsList) {
      const bracketPremiumPercentage = adjustedPremiumPercentage + element.amountPremium;
      const bracketPremiumGross =
        practice.premiumGross > element.amount
          ? element.amount - previousBracketPremium
          : practice.premiumGross - previousBracketPremium;
      previousBracketPremium = element.amount;
      if (bracketPremiumGross > 0) {
        adjustedPremiumValue += Math.trunc((bracketPremiumGross * bracketPremiumPercentage) / 10000);
      }
    }

    return adjustedPremiumValue;
  }

  return Math.trunc((Number.parseInt(practice.premiumGross, 10) * adjustedPremiumPercentage) / 10000);
}

/**
 * @param {Array<Practice>} practices
 * @param {AdjustedPremiumConfiguration} adjustment
 * @param {Array<ProductConfiguration>} products
 * @returns {Promise<number>}
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function adjustedPremium(practices, adjustment, products) {
  try {
    return Promise.resolve(
      // eslint-disable-next-line unicorn/no-reduce
      practices.reduce((acc, el) => {
        const product = adjustment.products.find((adj) => adj.productId === el.productId);
        if (!product) {
          throw new Error(`Configurazione ragguagliato non trovata per il prodotto ${el.productId}`);
        }

        const productConfiguration = products.find((thisProduct) => thisProduct._id === el.productId);
        if (!productConfiguration) {
          throw new Error(`Configurazione prodotto non trovata per il prodotto ${el.productName} ${el.productId}`);
        }

        const adjustedValue = adjustedPremiumSingleCalculation(el, product, productConfiguration);

        return acc + adjustedValue;
      }, 0),
    );
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * @param {string} promoterId
 * @param {TreeModel.Node<NetworkNode>} tree
 * @returns {Promise<number>}
 */
function promotersNumber(promoterId, tree) {
  const promoterTree = tree.first((node) => node.model.promoterId === promoterId);
  if (!promoterTree) return Promise.resolve(0);
  return Promise.resolve(promoterTree.all((node) => node.model.promoterId).length * 100);
}

/**
 * @param {Array<object>} installmments
 * @returns {Promise<number>}
 */
function correntizzazione(installmments) {
  // eslint-disable-next-line unicorn/no-reduce
  const paid = installmments.reduce((acc, el) => {
    if (!el.DataIncasso) return acc;
    return acc + 1;
  }, 0);

  if (installmments.length === 0) return Promise.resolve(0);

  const roundedPct = (paid / installmments.length) * 100;
  return Promise.resolve(Number.parseFloat(roundedPct.toFixed(2)));
}

module.exports = {
  adjustedPremium,
  adjustedPremiumSingleCalculation,
  promotersNumber,
  correntizzazione,
  iv,
};
