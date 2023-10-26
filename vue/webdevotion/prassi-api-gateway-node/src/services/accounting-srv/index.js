const AccountingNote = require('./accounting-note');
const NoteType = require('./note-type');
const accountingRepository = require('./accounting-respository');

class AccountingService {
  constructor(mongodb) {
    this.mongodb = mongodb;
  }

  addAccountingNote(accountingNote) {
    return accountingRepository.upsert(this.mongodb, accountingNote);
  }

  deleteAccountingNote(accountingNote) {
    return accountingRepository.deleteOne(this.mongodb, accountingNote);
  }

  getAccountingNote(accountingNoteId) {
    return accountingRepository.getAccountingNote(this.mongodb, accountingNoteId);
  }

  getUnsettledAccountingNote(promoterId) {
    return accountingRepository.getUnsettledAccountingNotes(this.mongodb, promoterId);
  }

  getAccountingNotes(filter) {
    return accountingRepository.getAccountingNotes(this.mongodb, filter);
  }

  getUnsettledWelcomeAccountingNotes(productivePeriodYear, productivePeriodMonth) {
    return accountingRepository.getUnsettledWelcomeAccountingNotes(
      this.mongodb,
      productivePeriodYear,
      productivePeriodMonth,
    );
  }

  linkNoteToInvoice(accountingNote, invoiceId) {
    return accountingRepository.upsert(this.mongodb, {
      ...accountingNote,
      invoiceId,
    });
  }

  /**
   * @param {AccountingNote} accountingNote
   * @param {number} suppliedAmount
   * @param {string} invoiceId
   */
  async settleAccountingNote(accountingNote, suppliedAmount, invoiceId) {
    if (accountingNote.type === NoteType.DEBIT && accountingNote.amount !== suppliedAmount) {
      const supplyPart = accountingNote.additionalData.supplyPart + 1;
      const reminderNote = new AccountingNote({
        ...accountingNote,
        _id: undefined,
        amount: accountingNote.amount - suppliedAmount,
        additionalData: {
          ...accountingNote.additionalData,
          supplyParentId: accountingNote._id,
          supplyPart,
        },
      });
      try {
        await accountingRepository.upsert(this.mongodb, reminderNote);
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return accountingRepository.upsert(this.mongodb, {
      ...accountingNote,
      amount: suppliedAmount,
      invoiceId,
      settled: true,
      settleDate: new Date(Date.now()),
    });
  }
}

module.exports = AccountingService;
