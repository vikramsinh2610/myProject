const Invoice = require('../invoice-srv/invoice');
const Promoter = require('../promoter-srv/promoter');
const DocumentService = require('../document-srv');
const PDFInput = require('./pdf-input');
const { getDocDefinition, createPdfBinary } = require('./pdf-creator');
const { parse, addMonths, unparse } = require('../../utils/productive-period-helper');
const documentTypes = require('../document-srv/document-types');
const translateEntryOrigin = require('./translate-types');
const { types: taxRegimeTypes } = require('../promoter-srv/filscal-regime-types');

function typeInvoice(preview, details) {
  if (preview) {
    return documentTypes.types.INVOICE_PREVIEW;
    // eslint-disable-next-line no-else-return
  } else if (details) {
    return documentTypes.types.INVOICE_WITH_DETAILS;
  } else {
    return documentTypes.types.INVOICE;
  }
}

function nameInvoice(preview, details) {
  if (preview) {
    return 'PROFORMA';
    // eslint-disable-next-line no-else-return
  } else if (details) {
    return 'CON DETTAGLI';
  } else {
    return '';
  }
}

class InvoicePDFService {
  /**
   * @param {*} mongodb
   * @param {DocumentService} documentService
   * @param {string} edition
   */
  constructor(mongodb, documentService, edition) {
    this.mongodb = mongodb;
    this.documentService = documentService;
    this.edition = edition;
  }

  /**
   * @param {Invoice} invoice
   * @param {Promoter} promoter
   * @param {boolean} withDetails
   */
  saveInvoicePDF(invoice, promoter, withDetails = false) {
    const input = this.mapInvoiceToPdfInput(invoice, promoter);
    const docDefinition = getDocDefinition(input, this.edition, withDetails);
    return createPdfBinary(docDefinition).then((buffer) =>
      this.documentService.addDocument(
        {
          type: typeInvoice(invoice.preview, withDetails),
          ownerId: invoice.promoterId,
          displayName: `${invoice.productivePeriodYear}-${invoice.productivePeriodMonth} - ${
            invoice.taxRegimeType === taxRegimeTypes.EMPLOYEE_COLLABORATOR ||
            invoice.taxRegimeType === taxRegimeTypes.ORDINARY ||
            (invoice.taxRegimeType === taxRegimeTypes.ORDINARY_REDUCED && this.edition === 'tcw')
              ? 'Estratto'
              : 'Fattura'
          } ${nameInvoice(invoice.preview, withDetails)} - ${promoter.serialNumber} ${promoter.name} ${
            promoter.surname
          }.pdf`,
          locked: true,
          additionalData: {
            invoiceId: invoice._id,
            invoiceNumber: invoice.preview ? invoice.previewNumber : invoice.number,
            preview: invoice.preview,
            productivePeriod: parse(invoice.productivePeriodYear, invoice.productivePeriodMonth),
            promoterId: invoice.promoterId,
            promoterRoleId: invoice.promoterRoleId,
            promoterDisplayName: invoice.promoterDisplayName,
            promoterNetworkPath: invoice.promoterNetworkPath,
            template: invoice.taxRegimeType === taxRegimeTypes.EMPLOYEE ? 'receipt' : 'invoice',
          },
        },
        buffer,
      ),
    );
  }

  /**
   * @param {Invoice} invoice
   * @param {Promoter} promoter
   * @returns {PDFInput}
   */
  mapInvoiceToPdfInput(invoice, promoter) {
    const isWelcomeBonus = invoice.accountingNotes.find((el) => el.origin === 'conditioned+welcome-bonus+prepayment');
    const productivePeriodWelcomeBonus = addMonths(
      parse(invoice.productivePeriodYear, invoice.productivePeriodMonth),
      1,
    );
    const { productivePeriodYear, productivePeriodMonth } = unparse(productivePeriodWelcomeBonus);
    let recipient =
      this.edition === 'tcw'
        ? {
            name: 'TKS Broker S.r.l.',
            vatNumber: '09899150966',
            fiscalCode: '09899150966',
            address: {
              route: 'Via Monte Bianco',
              houseNumber: '60/A',
              postalCode: '20089',
              city: 'Rozzano',
              province: 'MI',
              country: 'Italia',
            },
          }
        : {
            name: 'Sheltia s.r.l.',
            vatNumber: '13172161005',
            fiscalCode: '13172161005',
            address: {
              route: 'Via Ennio Quirino Visconti',
              houseNumber: '103',
              postalCode: '00193',
              city: 'Roma',
              province: 'RM',
              country: 'Italia',
            },
          };

    // @ts-ignore
    if (invoice.heading && invoice.heading.name) {
      // @ts-ignore
      recipient = invoice.heading;
    }

    let displayName = '';
    let vatNumber = '';
    let fiscalCode = '';
    if (promoter.physicalPerson) {
      displayName = promoter.displayName;
      fiscalCode = promoter.fiscalCode;
      vatNumber = promoter.tax.vat;
    } else if (promoter.companyData) {
      displayName = promoter.companyData.Denominazione;
      fiscalCode = promoter.companyData.CodiceFiscale;
      vatNumber = promoter.companyData.PartitaIva;
    }

    return new PDFInput({
      regimeType: invoice.taxRegimeType,
      invoiceNumber: invoice.preview ? invoice.previewNumber : invoice.number,
      fiscalYear: invoice.productivePeriodYear,
      emissionDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      trustDate: promoter.trustDate,
      productivePeriodMonth: isWelcomeBonus ? productivePeriodMonth : invoice.productivePeriodMonth,
      productivePeriodYear: isWelcomeBonus ? productivePeriodYear : invoice.productivePeriodYear,
      total: invoice.amount / 100,
      totalIV: invoice.totalIV,
      payment: {
        paymentCondition: 'pagamento a vista',
        bank: '-',
      },
      iban: promoter.tax.iban,
      recipient,
      sender: {
        name: displayName,
        vatNumber,
        fiscalCode,
        birthDate: promoter.birthDate,
        birthCity: promoter.birthCity,
        address: {
          route: promoter.address.route,
          houseNumber: promoter.address.streetNumber,
          postalCode: promoter.address.postalCode,
          city: promoter.address.city,
          province: promoter.address.province,
          country: promoter.address.country,
        },
      },
      content: {
        grossEntries: invoice.accountingNotes
          .filter((note) => !note.netToPay)
          .filter((el) => el.invoiceAmount !== 0)
          .map((entry) => ({
            name: entry.description || translateEntryOrigin(entry.origin),
            value: entry.invoiceAmount / 100,
            origin: entry.origin,
            productivePeriodMonth: entry.productivePeriodMonth,
            productivePeriodYear: entry.productivePeriodYear,
            installments: entry.additionalData ? entry.additionalData.installments : [],
          })),
        grossTotal: {
          name: 'Totale corrispettivi lordi',
          value: invoice.grossAmount / 100,
        },
        taxEntries: invoice.taxes.map((tax) => ({
          name: translateEntryOrigin(tax.origin),
          value: tax.amount / 100,
        })),
        netEntries: invoice.accountingNotes
          .filter((note) => note.netToPay)
          // eslint-disable-next-line sonarjs/no-identical-functions
          .map((entry) => ({
            name: entry.description || translateEntryOrigin(entry.origin),
            value: entry.invoiceAmount / 100,
            origin: entry.origin,
            productivePeriodMonth: entry.productivePeriodMonth,
            productivePeriodYear: entry.productivePeriodYear,
          })),
      },
    });
  }
}

module.exports = InvoicePDFService;
