const { v4: uuid } = require('uuid');
const AccountingNote = require("../accounting-srv/accounting-note");

class AccountingNoteEntry extends AccountingNote {
  constructor({
    _id = uuid(),
    createDate = new Date(Date.now()),
    promoterId,
    productivePeriodYear,
    productivePeriodMonth,
    amount,
    origin,
    type,
    netToPay = false,
    additionalData,
    invoiceId = null,
    settleDate = null,
    settled = false,
    description = '',
    invoiceAmount,
    invoicingId = null,
    commissioningId = null,
  }) {
    super({
      _id,
      createDate,
      promoterId,
      productivePeriodYear,
      productivePeriodMonth,
      amount,
      origin,
      netToPay,
      type,
      additionalData,
      invoiceId,
      settleDate,
      settled,
      description,
      invoicingId,
      commissioningId,
    });
    this.invoiceAmount = invoiceAmount;
  }
}

module.exports = AccountingNoteEntry;
