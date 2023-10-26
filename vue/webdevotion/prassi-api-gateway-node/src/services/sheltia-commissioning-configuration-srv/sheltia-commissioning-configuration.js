// eslint-disable-next-line max-classes-per-file
const { parse } = require('../../utils/productive-period-helper');

class Slot {
  constructor({ fromIv, toIv, percentage, roleId = 'all' }) {
    this.fromIv = fromIv;
    this.toIv = toIv;
    this.percentage = percentage;
    this.roleId = roleId;
  }
}

class Basis {
  constructor({ directProductionPercentage, indirectProductionPercentage }) {
    this.directProductionPercentage = directProductionPercentage;
    this.indirectProductionPercentage = indirectProductionPercentage;
  }
}

class Purchase {
  constructor({ basis, range, target }) {
    this.basis = new Basis(basis);
    this.range = {
      /** @type {Array<Slot>} */
      directProductionSlots: range.directProductionSlots.map((t) => new Slot(t)),
      /** @type {Array<Slot>} */
      indirectProductionSlots: range.indirectProductionSlots.map((t) => new Slot(t)),
    };
    this.target = {
      /** @type {Array<Slot>} */
      slots: target.slots.map((t) => new Slot(t)),
    };
  }
}

class ProductCashIn {
  constructor({ productId, amount }) {
    this.productId = productId;
    this.amount = amount;
  }
}

class SheltiaCommissioningConfiguration {
  constructor({
    _id = null,
    roleId,
    fromProductivePeriodYear,
    fromProductivePeriodMonth,
    fromProductivePeriod = 0,
    purchase,
    cashIn,
    advanceDirectProductionPercentage = 0,
    advanceIndirectProductionPercentage = 0,
    directIrpefStyle = false,
    indirectIrpefStyle = false,
  }) {
    this._id = _id || `${roleId}-${parse(fromProductivePeriodYear, fromProductivePeriodMonth)}`;
    this.roleId = roleId;
    this.advanceDirectProductionPercentage = advanceDirectProductionPercentage;
    this.advanceIndirectProductionPercentage = advanceIndirectProductionPercentage;
    this.fromProductivePeriodYear = fromProductivePeriodYear;
    this.fromProductivePeriodMonth = fromProductivePeriodMonth;
    this.fromProductivePeriod = fromProductivePeriod || parse(fromProductivePeriodYear, fromProductivePeriodMonth);
    this.purchase = new Purchase(purchase);
    /** @type {Array<ProductCashIn>} */
    this.cashIn = cashIn.map((ci) => new ProductCashIn(ci));
    this.directIrpefStyle = directIrpefStyle;
    this.indirectIrpefStyle = indirectIrpefStyle;
  }
}

module.exports = SheltiaCommissioningConfiguration;
