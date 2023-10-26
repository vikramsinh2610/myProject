const ProductConfiguration = require('../product-configuration-srv/product-configuration');

/**
 * @param {number} premiumNet
 * @param {number} premiumGross
 * @param {string} optionId
 * @param {number} year
 * @param {ProductConfiguration} config
 * @param {number} commissionSacrifice
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function calculatePayin(premiumNet, premiumGross, optionId, year, config, commissionSacrifice = 0) {
  const premium = config.premiumType === 'net' ? premiumNet : premiumGross;

  if (commissionSacrifice === 0) {
    let options;
    // eslint-disable-next-line prefer-const
    options = config.options.filter((o) => o._id === optionId && o.fromYear <= year && o.toYear >= year);
    if (!options) {
      throw new Error(`Configurazione non valida ${config.productName} | ${optionId}`);
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

    let payinValue = 0;
    let previousBracketValue = 0;
    // eslint-disable-next-line no-plusplus,no-restricted-syntax
    for (const element of options) {
      const premiumForBracket =
        premium > element.toPremiumAmount
          ? element.toPremiumAmount - previousBracketValue
          : premium - previousBracketValue;
      previousBracketValue = element.toPremiumAmount;
      if (premiumForBracket > 0) {
        payinValue += Math.round((premiumForBracket * element.percentage) / 10000) + element.fixedAmount;
      }
    }

    return payinValue;
  }

  return Math.round((premium * commissionSacrifice) / 10000);
}

module.exports = {
  calculatePayin,
};
