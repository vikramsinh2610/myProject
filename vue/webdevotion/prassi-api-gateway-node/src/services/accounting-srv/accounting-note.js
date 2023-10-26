const { v4: uuid } = require('uuid');
const NoteType = require('./note-type');
const CommissionAdditionalData = require('./note-additional-data/commission-additional-data');
const BonusLetterAdditionalData = require('./note-additional-data/bonus-letter-additional-data');
const BalanceAdditionalData = require('./note-additional-data/balance-additional-data');
const StarlingAdditionalData = require('./note-additional-data/starling-additional-data');
const DebitAdditionalData = require('./note-additional-data/debit-additional-data');
const AdvanceAdditionalData = require('./note-additional-data/advance-additional-data');

class AccountingNote {
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
    invoicingId = null,
    commissioningId = null,
  }) {
    this._id = _id;
    this.promoterId = promoterId;
    this.createDate = createDate;
    this.productivePeriodYear = productivePeriodYear;
    this.productivePeriodMonth = productivePeriodMonth;
    this.amount = amount;
    this.origin = origin;
    this.type = type;
    this.netToPay = netToPay;
    this.invoiceId = invoiceId;
    this.settleDate = settleDate;
    this.settled = settled;
    this.description = description;
    this.invoicingId = invoicingId;
    this.commissioningId = commissioningId;

    switch (type) {
      case NoteType.BONUS_LETTER:
        this.additionalData = new BonusLetterAdditionalData(additionalData);
        break;

      case NoteType.COMMISSION:
        this.additionalData = new CommissionAdditionalData(additionalData);
        break;

      case NoteType.BALANCE:
        this.additionalData = new BalanceAdditionalData(additionalData);
        break;

      case NoteType.WRITE_OFF:
        this.additionalData = new StarlingAdditionalData(additionalData);
        break;

      case NoteType.DEBIT:
        this.additionalData = new DebitAdditionalData(additionalData);
        break;

      case NoteType.ADVANCE:
        this.additionalData = new AdvanceAdditionalData(additionalData);
        break;

      default:
        this.additionalData = {};
        break;
    }
  }
}

module.exports = AccountingNote;
