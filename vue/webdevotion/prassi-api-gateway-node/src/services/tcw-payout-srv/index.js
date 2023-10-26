const ProductConfiguration = require("../product-configuration-srv/product-configuration");

/**
 * @param {number} premiumNet
 * @param {number} premiumGross
 * @param {string} optionId
 * @param {number} year
 * @param {number} payin
 * @param {ProductConfiguration} productConfig
 */
function calculatePayout(premiumNet, premiumGross, optionId, year, payin, productConfig) {
  const premium = productConfig.premiumType === 'net' ? premiumNet : premiumGross;

  let options;
  // eslint-disable-next-line prefer-const
  options = productConfig.options.filter((o) => o._id === optionId && o.fromYear <= year && o.toYear >= year);
  if (!options) {
    throw new Error(`Configurazione non valida ${productConfig.productName} | ${optionId}`);
  }

  options.sort((a, b) => {
    if (a.fromPremiumAmount < b.fromPremiumAmount) {
      return -1;
    }
    if (a.fromPremiumAmount > b.fromPremiumAmount) {
      return 1;
    }
    return 0;
  });

  let totalPayinValue = 0;
  let payoutValue = 0;
  let previousBracketValue = 0;
  // eslint-disable-next-line no-plusplus,no-restricted-syntax
  for (const element of options) {
    const premiumForBracket =
      premium > element.toPremiumAmount
        ? element.toPremiumAmount - previousBracketValue
        : premium - previousBracketValue;
    previousBracketValue = element.toPremiumAmount;
    if (premiumForBracket > 0) {
      const payinValue = Math.round((premiumForBracket * element.percentage) / 10000) + element.fixedAmount;
      totalPayinValue += payinValue;
      payoutValue += Math.trunc((payinValue * element.retrocessionFee) / 10000);
    }
  }

  if (options.length === 1 || payin !== totalPayinValue) {
    payoutValue = Math.trunc((payin * options[0].retrocessionFee) / 10000);
  }

  return payoutValue;
}

/**
 * @param {number} premiumNet
 * @param {number} premiumGross
 * @param {number} payin
 * @param {ProductConfiguration} productConfig
 */
function calculatePayoutMFees(premiumNet, premiumGross, payin, productConfig) {
  let option = productConfig.options.find(
    (o) =>
      o._id === 'MANAGEMENT-FEE' ,
  );
  if (!option) {
    option = productConfig.options.find(
      (o) =>
        o._id === 'DEFAULT' ,
    );
  }
  if (!option) {
    // eslint-disable-next-line prefer-destructuring
    option = productConfig.options[0];
  }
  if (!option) {
    throw new Error('Configurazione non valida');
  }

  return Math.trunc((payin * option.retrocessionFee) / 10000);
}

module.exports = {
  calculatePayout,
  calculatePayoutMFees,
};
