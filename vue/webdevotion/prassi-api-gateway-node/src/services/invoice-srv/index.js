const PromoterService = require('../promoter-srv');
const AccountingService = require('../accounting-srv');
const Promoter = require('../promoter-srv/promoter');
const AccountingNote = require('../accounting-srv/accounting-note');
const AccountingNoteTypes = require('../accounting-srv/note-type');
const DebitService = require('../debit-srv');
const AccountingNoteEntry = require('./accounting-note-entry');
const InvoiceTaxEntry = require('./invoice-tax-entry');
const Invoice = require('./invoice');
const PromoterJob = require('../promoter-job-srv/promoter-job');
const invoiceRepository = require('./invoice-repository');
const fiscalRegimeTypes = require('../promoter-srv/filscal-regime-types');
const { seed } = require('./seed/invoice');
const logRepository = require('../commissioning-flow-srv/log-repository');
const LogEvent = require('../commissioning-flow-srv/log-event');
const { unparse, toPeriod } = require('../../utils/productive-period-helper');
require('../../utils/foreach');

/**
 * @param {Invoice} invoice
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function recalculateInvoice(invoice) {
  // eslint-disable-next-line unicorn/no-reduce
  const { directCommissionsAmount, indirectCommissionsAmount, otherAmount } = invoice.accountingNotes.reduce(
    (acc, item) => {
      if (item.type === AccountingNoteTypes.COMMISSION) {
        return {
          otherAmount: acc.otherAmount,
          directCommissionsAmount:
            acc.directCommissionsAmount + (item.additionalData.productionType === 'direct' ? item.amount : 0),
          indirectCommissionsAmount:
            acc.indirectCommissionsAmount + (item.additionalData.productionType === 'indirect' ? item.amount : 0),
        };
      }
      return {
        directCommissionsAmount: acc.directCommissionsAmount,
        indirectCommissionsAmount: acc.indirectCommissionsAmount,
        otherAmount: acc.otherAmount + item.amount,
      };
    },
    {
      directCommissionsAmount: 0,
      indirectCommissionsAmount: 0,
      otherAmount: 0,
    },
  );

  const absorbedAccountingNotes = invoice.accountingNotes.map((a) => {
    if (a.type !== AccountingNoteTypes.BONUS_LETTER) return a;

    const direct = ((a.additionalData.absorbability.directProductionPercentage || 0) * directCommissionsAmount) / 10000;
    const indirect =
      ((a.additionalData.absorbability.indirectProductionPercentage || 0) * indirectCommissionsAmount) / 10000;

    const invoiceAmount = Math.round(
      Math.max(0, a.amount - Math.min(directCommissionsAmount, direct) - Math.min(indirectCommissionsAmount, indirect)),
    );

    return { ...a, invoiceAmount };
  });

  let partialAmount = absorbedAccountingNotes
    .filter((a) => a.type !== AccountingNoteTypes.DEBIT)
    // eslint-disable-next-line unicorn/no-reduce
    .reduce((acc, item) => acc + item.invoiceAmount, 0);

  const accountingNotes = absorbedAccountingNotes.map((a) => {
    if (a.type !== AccountingNoteTypes.DEBIT) return a;

    const maxRecoveryAmount = Math.round((partialAmount * a.additionalData.supplyPercentage) / 10000);
    const invoiceAmount = -Math.min(Math.abs(a.amount), maxRecoveryAmount);
    partialAmount += invoiceAmount;

    return { ...a, invoiceAmount };
  });

  const guaranteedVariableNote = accountingNotes.find((a) => a.origin === 'gmv-guaranteed-variable');
  const guaranteedNote = accountingNotes.find((a) => a.origin === 'gmv-guaranteed+monthly');
  if (guaranteedVariableNote && guaranteedNote) {
    const direct =
      ((guaranteedNote.additionalData.absorbability.directProductionPercentage || 0) * directCommissionsAmount) / 10000;
    const indirect =
      ((guaranteedNote.additionalData.absorbability.indirectProductionPercentage || 0) * indirectCommissionsAmount) /
      10000;
    const production = direct + indirect;

    if (production + guaranteedVariableNote.amount > guaranteedNote.amount) {
      guaranteedNote.invoiceAmount = 0;
    } else {
      guaranteedVariableNote.invoiceAmount = 0;
    }
  }

  /**
   * if netToPay === false, the accounting note compose the withholding
   * if not, it directly increase the final amount
   */
  const grossAmount = accountingNotes
    .filter((note) => !note.netToPay)
    // eslint-disable-next-line unicorn/no-reduce
    .reduce((acc, item) => acc + item.invoiceAmount, 0);
  // eslint-disable-next-line unicorn/no-reduce
  const netToPay = accountingNotes.filter((note) => note.netToPay).reduce((acc, item) => acc + item.invoiceAmount, 0);

  const taxes = [];
  let amount = grossAmount;
  if (
    invoice.taxRegimeType === fiscalRegimeTypes.types.ORDINARY ||
    (invoice.taxRegimeType === fiscalRegimeTypes.types.OCCASIONAL_PERFORMANCE && process.env.EDITION === 'tcw')
  ) {
    const taxable = Math.round(grossAmount / 2);
    const withholding = Math.round((taxable * 2300) / 10000);
    taxes.push(new InvoiceTaxEntry({ origin: 'withholding', amount: -withholding }));
    amount -= withholding;
  }
  if (
    invoice.taxRegimeType === fiscalRegimeTypes.types.EMPLOYEE_COLLABORATOR ||
    (invoice.taxRegimeType === fiscalRegimeTypes.types.ORDINARY_REDUCED && process.env.EDITION === 'tcw')
  ) {
    const taxable = Math.round(grossAmount);
    const withholding = Math.round((taxable * 460) / 10000);
    taxes.push(new InvoiceTaxEntry({ origin: 'withholding-46', amount: -withholding }));
    amount -= withholding;
  }
  if (invoice.taxRegimeType === fiscalRegimeTypes.types.OCCASIONAL_PERFORMANCE && process.env.EDITION === 'sheltia') {
    const withholding = Math.round((grossAmount * 2000) / 10000);
    taxes.push(new InvoiceTaxEntry({ origin: 'withholding-20', amount: -withholding }));
    amount -= withholding;
  }
  if (invoice.taxRegimeType !== fiscalRegimeTypes.types.EMPLOYEE && grossAmount > 7747) {
    if (process.env.EDITION === 'tcw') {
      taxes.push(new InvoiceTaxEntry({ origin: 'stamp', amount: +200 }));
      amount += 200;
    } else {
      taxes.push(new InvoiceTaxEntry({ origin: 'stamp', amount: -200 }));
      amount -= 200;
    }
  }
  amount += netToPay;

  return new Invoice({
    ...invoice,
    directCommissionsAmount,
    indirectCommissionsAmount,
    otherAmount,
    accountingNotes,
    grossAmount,
    amount,
    taxes,
  });
}

class InvoiceService {
  constructor(mongodb) {
    this.mongodb = mongodb;
    this.promoterService = new PromoterService(mongodb);
    this.debitService = new DebitService(mongodb);
    this.accountingService = new AccountingService(mongodb);
  }

  /**
   * @param {string} invoiceId
   * @returns {Promise<Invoice>}
   */
  getInvoice(invoiceId) {
    return invoiceRepository.getById(this.mongodb, invoiceId);
  }

  getInvoices(skip, limit, filter = {}) {
    return invoiceRepository.getAll(this.mongodb, skip, limit, filter); // , filter, sortBy, sortDirection
  }

  /**
   *
   * @param {string} invoiceId
   * @param {Array<AccountingNote>} accountingNotes
   */
  addAccountingNotes(invoiceId, accountingNotes) {
    return invoiceRepository
      .getById(this.mongodb, invoiceId)
      .then(
        (invoice) =>
          new Invoice({
            ...invoice,
            accountingNotes: [
              ...invoice.accountingNotes,
              ...accountingNotes.map((a) => new AccountingNoteEntry({ ...a, invoiceAmount: a.amount })),
            ],
          }),
      )
      .then((invoice) => recalculateInvoice(invoice))
      .then((invoice) => invoiceRepository.update(this.mongodb, invoice._id, invoice))
      .then(() =>
        Promise.all(accountingNotes.map((note) => this.accountingService.linkNoteToInvoice(note, invoiceId))),
      );
  }

  removeAccountingNote(invoiceId, accountingNoteId) {
    return invoiceRepository
      .getById(this.mongodb, invoiceId)
      .then((invoice) => ({
        ...invoice,
        accountingNotes: invoice.accountingNotes.filter((a) => a._id !== accountingNoteId),
      }))
      .then((invoice) => recalculateInvoice(invoice))
      .then((invoice) => invoiceRepository.update(this.mongodb, invoice._id, invoice))
      .then(() => this.accountingService.getAccountingNote(accountingNoteId))
      .then((accountingNote) => this.accountingService.linkNoteToInvoice(accountingNote, null));
  }

  unlinkAccountingNotes(invoiceId) {
    return invoiceRepository.getById(this.mongodb, invoiceId).then(async (invoice) => {
      // @ts-ignore
      await invoice.accountingNotes.forEachAsync(async (note) => {
        try {
          const fullNote = await this.accountingService.getAccountingNote(note._id);
          await this.accountingService.linkNoteToInvoice(fullNote, null);
        } catch (error) {
          logRepository.insert(
            this.mongodb,
            new LogEvent({
              description: `${error.message}, fattura: ${invoiceId}`,
            }),
          );
        }
      });
      const updatedInvoice = recalculateInvoice({
        ...invoice,
        accountingNotes: [],
      });
      await invoiceRepository.update(this.mongodb, updatedInvoice._id, updatedInvoice);
      return Promise.resolve(updatedInvoice._id);
    });
  }

  /**
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @param {Date} issueDate
   * @param {Date} dueDate
   * @param {Promoter} promoter
   * @param {string} promoterNetworkPath
   * @param {PromoterJob} promoterJob
   * @param {boolean} commissioning
   * @param {number} totalIV
   * @returns {Promise<Invoice>}
   */
  generateInvoice(
    productivePeriodYear,
    productivePeriodMonth,
    issueDate,
    dueDate,
    promoter,
    promoterNetworkPath,
    promoterJob,
    commissioning,
    totalIV,
  ) {
    const invoice = new Invoice({
      promoterId: promoter._id,
      serialNumber: promoter.serialNumber,
      productivePeriodYear,
      productivePeriodMonth,
      promoterNetworkPath,
      promoterDisplayName: promoter.displayName,
      promoterRoleId: promoterJob.roleId,
      directCommissionsAmount: 0,
      indirectCommissionsAmount: 0,
      otherAmount: 0,
      grossAmount: 0,
      amount: 0,
      issueDate,
      dueDate,
      taxRegimeType: promoter.tax.fiscalRegimeType,
      commissioning,
      totalIV,
      trustDate: promoter.trustDate,
    });
    return invoiceRepository.insert(this.mongodb, invoice);
  }

  /**
   * @param {string} invoiceId
   * @param {string} edition
   * @returns {Promise<Invoice>}
   */
  issueInvoice(invoiceId, edition) {
    return invoiceRepository.getById(this.mongodb, invoiceId).then(async (invoice) => {
      if (invoice.issued) return invoice;
      const issued = true;
      const { productivePeriodYear } = unparse(toPeriod(new Date(invoice.issueDate)));
      const prefix = `${edition === 'sheltia' ? 'SH' : 'TKS'}`;

      let n;
      // @ts-ignore
      if ((invoice.heading && invoice.heading.prefix === 'TCW') || edition === 'sheltia') {
        n = await invoiceRepository.getNumber(this.mongodb, invoice.promoterId, productivePeriodYear);
      } else {
        // @ts-ignore
        const invoiceNumberPrefix = invoice.heading && invoice.heading.prefix ? invoice.heading.prefix : prefix;

        n = await invoiceRepository.getNumberCustom(
          this.mongodb,
          invoice.promoterId,
          productivePeriodYear,
          // @ts-ignore
          invoiceNumberPrefix,
        );
      }
      // @ts-ignore
      const number = `${invoice.heading && invoice.heading.prefix ? invoice.heading.prefix : prefix}${n}`;
      await invoiceRepository.update(this.mongodb, invoice._id, { number, issued, preview: false });
      return { ...invoice, number, issued, preview: false };
    });
  }

  /**
   * @param {string} invoiceId
   * @param {string} edition
   * @returns {Promise<Invoice>}
   */
  unIssueInvoice(invoiceId, edition) {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    return invoiceRepository.getById(this.mongodb, invoiceId).then(async (invoice) => {
      if (!invoice.issued) return invoice;
      const issued = false;
      const { productivePeriodYear } = unparse(toPeriod(new Date(invoice.issueDate)));
      const prefix = `${edition === 'sheltia' ? 'SH' : 'TKS'}`;

      let n;
      let number;
      let nOrd;
      // @ts-ignore
      if ((invoice.heading && invoice.heading.prefix === 'TCW') || edition === 'sheltia') {
        n = await invoiceRepository.getCurrentNumber(this.mongodb, invoice.promoterId, productivePeriodYear);

        // @ts-ignore
        number = `${invoice.heading && invoice.heading.prefix ? invoice.heading.prefix : prefix}${n}`;
        if (number !== invoice.number) throw new Error('Impossibile revocare, numerazione non consistente');

        nOrd = await invoiceRepository.getCurrentOrdinal(this.mongodb, invoice.promoterId, productivePeriodYear);

        await invoiceRepository.setNumber(this.mongodb, invoice.promoterId, productivePeriodYear, nOrd - 1);
      } else {
        // @ts-ignore
        const invoiceNumberPrefix = invoice.heading && invoice.heading.prefix ? invoice.heading.prefix : prefix;

        n = await invoiceRepository.getCurrentNumberCustom(
          this.mongodb,
          invoice.promoterId,
          productivePeriodYear,
          // @ts-ignore
          invoiceNumberPrefix,
        );

        // @ts-ignore
        number = `${invoice.heading && invoice.heading.prefix ? invoice.heading.prefix : prefix}${n}`;
        if (number !== invoice.number) throw new Error('Impossibile revocare, numerazione non consistente');

        nOrd = await invoiceRepository.getCurrentOrdinalCustom(
          this.mongodb,
          invoice.promoterId,
          productivePeriodYear,
          // @ts-ignore
          invoiceNumberPrefix,
        );

        await invoiceRepository.setNumberCustom(
          this.mongodb,
          invoice.promoterId,
          productivePeriodYear,
          nOrd - 1,
          // @ts-ignore
          invoiceNumberPrefix,
        );
      }

      await invoiceRepository.update(this.mongodb, invoice._id, {
        number: 'ND',
        issued,
        preview: false,
        documentId: undefined,
      });
      return { ...invoice, number: 'ND', issued, preview: false };
    });
  }

  /**
   * @param {string} invoiceId
   * @param {string} edition
   * @returns {Promise<Invoice>}
   */
  issuePreviewInvoice(invoiceId, edition) {
    return invoiceRepository.getById(this.mongodb, invoiceId).then(async (invoice) => {
      const issued = true;
      const { productivePeriodYear } = unparse(toPeriod(new Date(invoice.issueDate)));
      const prefix = `${edition === 'sheltia' ? 'SH' : 'TKS'}`;

      let n;
      // @ts-ignore
      if ((invoice.heading && invoice.heading.prefix === 'TCW') || edition === 'sheltia') {
        n = await invoiceRepository.getPreviewNumber(this.mongodb, invoice.promoterId, productivePeriodYear);
      } else {
        // @ts-ignore
        const invoiceNumberPrefix = invoice.heading && invoice.heading.prefix ? invoice.heading.prefix : prefix;

        n = await invoiceRepository.getPreviewNumberCustom(
          this.mongodb,
          invoice.promoterId,
          productivePeriodYear,
          // @ts-ignore
          invoiceNumberPrefix,
        );
      }

      // @ts-ignore
      const number = `${invoice.heading && invoice.heading.prefix ? invoice.heading.prefix : prefix}${n}`;
      await invoiceRepository.update(this.mongodb, invoice._id, { previewNumber: number, preview: issued });
      return { ...invoice, previewNumber: number, preview: issued };
    });
  }

  /**
   * @param {string} invoiceId
   * @param {string} edition
   * @param {string} taxRegimeType
   * @param {object} heading
   * @returns {Promise<Invoice>}
   */
  async changeTaxRegime(invoiceId, edition, taxRegimeType, heading = {}) {
    const invoice = await invoiceRepository.getById(this.mongodb, invoiceId);
    if (invoice.issued) return invoice;
    const newInvoice = recalculateInvoice({ ...invoice, taxRegimeType, heading });
    await invoiceRepository.update(this.mongodb, invoiceId, newInvoice);
    return newInvoice;
  }

  /**
   * @param {string} invoiceId
   * @param {string} documentId
   */
  attachDocument(invoiceId, documentId) {
    return invoiceRepository.update(this.mongodb, invoiceId, { documentId });
  }

  /**
   * @param {string} invoiceId
   * @param {string} documentPreviewId
   */
  attachDocumentPreview(invoiceId, documentPreviewId) {
    return invoiceRepository.update(this.mongodb, invoiceId, { documentPreviewId });
  }

  /**
   * @param {string} invoiceId
   * @param {string} documentWithDetailsId
   */
  attachDocumentWithDetails(invoiceId, documentWithDetailsId) {
    return invoiceRepository.update(this.mongodb, invoiceId, { documentWithDetailsId });
  }

  insertSeed() {
    return invoiceRepository.insertSeed(this.mongodb, seed);
  }

  createIndexes() {
    return invoiceRepository.createIndexes(this.mongodb);
  }
}

module.exports = InvoiceService;
