const Boom = require('boom');
const moment = require('moment');
const InvoicingFlowService = require('../../services/invoicing-flow-srv');
const InvoiceService = require('../../services/invoice-srv');
const DocumentService = require('../../services/document-srv');
const PromoterService = require('../../services/promoter-srv');
const { csvReport } = require('../../services/excel-report-srv');
const { types: documentTypes } = require('../../services/document-srv/document-types');
const translateEntryOrigin = require('../../services/invoice-pdf-srv/translate-types');
const { types: fiscalRegimeTypes } = require('../../services/promoter-srv/filscal-regime-types');
const { types: taxRegimeTypes } = require('../../services/invoice-srv/tax-regime-type');
const errorHandler = require('../../utils/error-handler');
require('../../utils/foreach');

function mapTaxRegime(taxRegime) {
  let tax = 'EA60';
  switch (taxRegime) {
    case taxRegimeTypes.FLAT:
      tax = 'ESCF';
      break;
    case taxRegimeTypes.MINIMUM:
      tax = 'ESCM';
      break;
    default:
      tax = 'EA60';
  }
  return tax;
}

function mapTaxRitenute(taxRegime) {
  let tax = '1';
  switch (taxRegime) {
    case taxRegimeTypes.FLAT:
      tax = '2';
      break;
    case taxRegimeTypes.MINIMUM:
      tax = '2';
      break;
    default:
      tax = '1';
  }
  return tax;
}

function mapCausaleContabile(fiscalRegime) {
  let type = 'fattura fornitore';
  switch (fiscalRegime) {
    case fiscalRegimeTypes.OCCASIONAL_PERFORMANCE:
      type = 'Ricevuta da fornitore';
      break;
    case fiscalRegimeTypes.MINIMUM:
      type = 'fattura fornitore';
      break;
    default:
      type = 'fattura fornitore';
  }
  return type;
}

function mapTipoOperazioneRitenuta(fiscalRegime) {
  let type = 'AG15';
  switch (fiscalRegime) {
    case fiscalRegimeTypes.OCCASIONAL_PERFORMANCE:
      type = 'LA66';
      break;
    case fiscalRegimeTypes.MINIMUM:
      type = 'AG15';
      break;
    default:
      type = 'AG15';
  }
  return type;
}

function mapDocumentType(fiscalRegime) {
  let type = '800';
  switch (fiscalRegime) {
    case fiscalRegimeTypes.OCCASIONAL_PERFORMANCE:
      type = '790';
      break;
    case fiscalRegimeTypes.MINIMUM:
      type = '800';
      break;
    default:
      type = '800';
  }
  return type;
}

function mapEmptyOccasional(fiscalRegime, value) {
  let type = value;
  switch (fiscalRegime) {
    case fiscalRegimeTypes.OCCASIONAL_PERFORMANCE:
      type = '';
      break;
    case fiscalRegimeTypes.MINIMUM:
      type = value;
      break;
    default:
      type = value;
  }
  return type;
}

function mapOccasional(fiscalRegime, value1, value2) {
  let type = value2;
  switch (fiscalRegime) {
    case fiscalRegimeTypes.OCCASIONAL_PERFORMANCE:
      type = value1;
      break;
    case fiscalRegimeTypes.MINIMUM:
      type = value2;
      break;
    default:
      type = value2;
  }
  return type;
}

function mapCodiceConto(origin) {
  let type = '57071190';

  switch (origin) {
    case 'future-direct+direct':
    case 'future-direct+indirect':
    case 'write-off+direct':
    case 'write-off+indirect':
      type = '150590';
      break;
    case 'target+':
    case 'bonus-guaranteed':
    case 'guaranteed-variable':
    case 'write-off-guaranteed-bonus':
      type = '57071191';
      break;
    default:
      type = '57071190';
  }
  return type;
}

const list = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Create Invoices Report',
      description: 'Create invoices report and get the document',
      tags: ['promoters'],
      querystring: {
        type: 'object',
        properties: {
          skip: {
            type: 'integer',
            default: 0,
            description: 'Number of items to skip',
          },
          count: {
            type: 'integer',
            default: 0,
            description: 'Number of items to return',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'item'],
          properties: {
            _meta: {
              type: 'object',
              properties: {
                getPresignedUrl: {
                  type: 'string',
                  description: 'API link to get presigned url',
                },
              },
            },
            item: {
              type: 'object',
              properties: {
                documentId: {
                  type: 'string',
                  description: 'Report document ID',
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.post(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);
      const promoterService = new PromoterService(fastify.mongo.db);
      const invoiceService = new InvoiceService(fastify.mongo.db);
      const invoicingFlowService = new InvoicingFlowService(
        fastify.mongo.db,
        fastify.edition,
        fastify.log,
        fastify.knex,
      );

      const invoicing = await invoicingFlowService
        .getState(request.params.invoicingId)
        .then((state) => state)
        .catch((error) => error);

      const confirmedInvoices = invoicing.invoices.filter((invoice) => invoice.confirmed).map((el) => el._id);

      invoiceService
        .getInvoices(0, 0, { _id: { $in: confirmedInvoices } }) // request.query.count
        .then(async (invoices) => {
          const rows = [];

          let numReg = 0;
          await invoices.forEachAsync(async (i) => {
            const promoter = await promoterService.getPromoterById(i.promoterId);
            if (promoter.tax.fiscalRegimeType !== fiscalRegimeTypes.EMPLOYEE) {
              numReg += 1;
              rows.push({
                tipoRecord: 'TES',
                dataRegistrazione: moment(i.issueDate).format('DDMMYYYY'),
                tipoDocumento: mapDocumentType(promoter.tax.fiscalRegimeType),
                numeroRegistrazione: numReg,
                appendiceDigitata: '',
                numeroRegistrazioneIva: mapEmptyOccasional(promoter.tax.fiscalRegimeType, '1.A.1'),
                dataDocumento: moment(i.issueDate).format('DDMMYYYY'),
                numeroDocumento: i.number,
                doppiaAnnotazione: '0',
                appDoppiaAnnotazione: '',
                codiceConto: '330301',
                codiceFiscale: promoter.fiscalCode,
                partitario: '0',
                codiceValuta: 'EUR',
                centroImputazione: '',
                condizionePagamento: '400',
                causaleContabile: mapCausaleContabile(promoter.tax.fiscalRegimeType),
                causaleIVA1: mapOccasional(
                  promoter.tax.fiscalRegimeType,
                  `RICEVUTA ${i.promoterDisplayName}`,
                  `FATTURA ${i.promoterDisplayName}`,
                ),
                causaleIVA2: '',
                causaleIVA3: '',
                causaleIVA4: '',
                annoIVA: mapEmptyOccasional(promoter.tax.fiscalRegimeType, moment(i.issueDate).format('YYYY')),
                periodoIVA: mapEmptyOccasional(promoter.tax.fiscalRegimeType, moment(i.issueDate).format('MM')),
                dataOpIVA: '',
                docPrivato: '',
                territorio: '',
                totDocValuta: '',
                ritenuta: '1',
                tipoOperazioneRitenuta: mapTipoOperazioneRitenuta(promoter.tax.fiscalRegimeType),
                causalePag: mapOccasional(promoter.tax.fiscalRegimeType, 'O', 'R'),
                tipoRiga: '0',
                codiceContoRiga: '',
                cliFor: '',
                codiceCespite: '',
                importoValuta: '',
                centroImpiego: '',
                codiceIvaOrig: '',
                indetraibile: '0',
                indetraibileProRata: '0',
                causaleDigitata: '0',
                descrizione: '',
                rilevanteRitenute: '0',
                codiceIva: '',
                imponibile: '',
                imponibileIva: '0',
                ivaIndetraibile: '0',
                imponibileIvaIndetraibile: '0',
                ivaIndetraibileProRata: '0',
                ivaImponibileProRata: '0',
                dataScadenza: '',
                pagamentoBloccato: '0',
                tipoPagamento: '',
                importoRataValuta: '0',
              });
              await i.accountingNotes.forEachAsync(async (n) => {
                rows.push({
                  tipoRecord: 'RIG',
                  dataRegistrazione: moment(i.issueDate).format('DDMMYYYY'),
                  tipoDocumento: mapDocumentType(promoter.tax.fiscalRegimeType),
                  numeroRegistrazione: numReg,
                  appendiceDigitata: '',
                  numeroRegistrazioneIva: mapEmptyOccasional(promoter.tax.fiscalRegimeType, '1.A.1'),
                  dataDocumento: moment(i.issueDate).format('DDMMYYYY'),
                  numeroDocumento: i.number,
                  doppiaAnnotazione: '0',
                  appDoppiaAnnotazione: '',
                  codiceConto: '',
                  codiceFiscale: '',
                  partitario: '0',
                  codiceValuta: '',
                  centroImputazione: '',
                  condizionePagamento: '',
                  causaleContabile: '',
                  causaleIVA1: '',
                  causaleIVA2: '',
                  causaleIVA3: '',
                  causaleIVA4: '',
                  annoIVA: '0',
                  periodoIVA: '0',
                  dataOpIVA: '',
                  docPrivato: '',
                  territorio: '',
                  totDocValuta: '',
                  ritenuta: '0',
                  tipoOperazioneRitenuta: mapTipoOperazioneRitenuta(promoter.tax.fiscalRegimeType),
                  causalePag: '',
                  tipoRiga: '2',
                  codiceContoRiga: mapCodiceConto(n.origin),
                  cliFor: '0',
                  codiceCespite: '',
                  importoValuta: Number(n.invoiceAmount / 100).toFixed(2),
                  centroImpiego: '',
                  codiceIvaOrig: mapTaxRegime(i.taxRegimeType),
                  indetraibile: '0',
                  indetraibileProRata: '0',
                  causaleDigitata: '1',
                  descrizione: n.description || translateEntryOrigin(n.origin),
                  rilevanteRitenute: mapTaxRitenute(i.taxRegimeType),
                  codiceIva: '',
                  imponibile: '',
                  imponibileIva: '0',
                  ivaIndetraibile: '0',
                  imponibileIvaIndetraibile: '0',
                  ivaIndetraibileProRata: '0',
                  ivaImponibileProRata: '0',
                  dataScadenza: '0',
                  pagamentoBloccato: '0',
                  tipoPagamento: '',
                  importoRataValuta: '0',
                });
              });
              if (promoter.tax.fiscalRegimeType !== fiscalRegimeTypes.OCCASIONAL_PERFORMANCE)
                rows.push({
                  tipoRecord: 'IVA',
                  dataRegistrazione: moment(i.issueDate).format('DDMMYYYY'),
                  tipoDocumento: mapDocumentType(promoter.tax.fiscalRegimeType),
                  numeroRegistrazione: numReg,
                  appendiceDigitata: '',
                  numeroRegistrazioneIva: mapEmptyOccasional(promoter.tax.fiscalRegimeType, '1.A.1'),
                  dataDocumento: moment(i.issueDate).format('DDMMYYYY'),
                  numeroDocumento: i.number,
                  doppiaAnnotazione: '0',
                  appDoppiaAnnotazione: '',
                  codiceConto: '330301',
                  codiceFiscale: promoter.fiscalCode,
                  partitario: '0',
                  codiceValuta: 'EUR',
                  centroImputazione: '',
                  condizionePagamento: '400',
                  causaleContabile: mapCausaleContabile(promoter.tax.fiscalRegimeType),
                  causaleIVA1: mapOccasional(
                    promoter.tax.fiscalRegimeType,
                    `RICEVUTA ${i.promoterDisplayName}`,
                    `FATTURA ${i.promoterDisplayName}`,
                  ),
                  causaleIVA2: '',
                  causaleIVA3: '',
                  causaleIVA4: '',
                  annoIVA: mapEmptyOccasional(promoter.tax.fiscalRegimeType, moment(i.issueDate).format('YYYY')),
                  periodoIVA: mapEmptyOccasional(promoter.tax.fiscalRegimeType, moment(i.issueDate).format('MM')),
                  dataOpIVA: '',
                  docPrivato: '',
                  territorio: '',
                  totDocValuta: '',
                  ritenuta: '0',
                  tipoOperazioneRitenuta: mapTipoOperazioneRitenuta(promoter.tax.fiscalRegimeType),
                  causalePag: mapOccasional(promoter.tax.fiscalRegimeType, 'O', 'R'),
                  tipoRiga: '0',
                  codiceContoRiga: '',
                  cliFor: '',
                  codiceCespite: '',
                  importoValuta: '',
                  centroImpiego: '',
                  codiceIvaOrig: '',
                  indetraibile: '0',
                  indetraibileProRata: '0',
                  causaleDigitata: '0',
                  descrizione: '',
                  rilevanteRitenute: '0',
                  codiceIva: mapTaxRegime(i.taxRegimeType),
                  imponibile: Number(i.grossAmount / 100).toFixed(2),
                  imponibileIva: '0',
                  ivaIndetraibile: '0',
                  imponibileIvaIndetraibile: '0',
                  ivaIndetraibileProRata: '0',
                  ivaImponibileProRata: '0',
                  dataScadenza: moment(i.dueDate).format('DDMMYYYY'),
                  pagamentoBloccato: '0',
                  tipoPagamento: '',
                  importoRataValuta: '',
                });
              if (i.grossAmount !== 0) {
                rows.push({
                  tipoRecord: 'PAR',
                  dataRegistrazione: moment(i.issueDate).format('DDMMYYYY'),
                  tipoDocumento: mapDocumentType(promoter.tax.fiscalRegimeType),
                  numeroRegistrazione: numReg,
                  appendiceDigitata: '',
                  numeroRegistrazioneIva: mapEmptyOccasional(promoter.tax.fiscalRegimeType, '1.A.1'),
                  dataDocumento: moment(i.issueDate).format('DDMMYYYY'),
                  numeroDocumento: i.number,
                  doppiaAnnotazione: '0',
                  appDoppiaAnnotazione: '',
                  codiceConto: '330301',
                  codiceFiscale: promoter.fiscalCode,
                  partitario: '0',
                  codiceValuta: 'EUR',
                  centroImputazione: '',
                  condizionePagamento: '400',
                  causaleContabile: mapCausaleContabile(promoter.tax.fiscalRegimeType),
                  causaleIVA1: mapOccasional(
                    promoter.tax.fiscalRegimeType,
                    `RICEVUTA ${i.promoterDisplayName}`,
                    `FATTURA ${i.promoterDisplayName}`,
                  ),
                  causaleIVA2: '',
                  causaleIVA3: '',
                  causaleIVA4: '',
                  annoIVA: mapEmptyOccasional(promoter.tax.fiscalRegimeType, moment(i.issueDate).format('YYYY')),
                  periodoIVA: mapEmptyOccasional(promoter.tax.fiscalRegimeType, moment(i.issueDate).format('MM')),
                  dataOpIVA: '',
                  docPrivato: '',
                  territorio: '',
                  totDocValuta: '',
                  ritenuta: '0',
                  tipoOperazioneRitenuta: mapTipoOperazioneRitenuta(promoter.tax.fiscalRegimeType),
                  causalePag: mapOccasional(promoter.tax.fiscalRegimeType, 'O', 'R'),
                  tipoRiga: '0',
                  codiceContoRiga: '',
                  cliFor: '',
                  codiceCespite: '',
                  importoValuta: '',
                  centroImpiego: '',
                  codiceIvaOrig: '',
                  indetraibile: '0',
                  indetraibileProRata: '0',
                  causaleDigitata: '0',
                  descrizione: '',
                  rilevanteRitenute: '0',
                  codiceIva: '',
                  imponibile: '',
                  imponibileIva: '0',
                  ivaIndetraibile: '0',
                  imponibileIvaIndetraibile: '0',
                  ivaIndetraibileProRata: '0',
                  ivaImponibileProRata: '0',
                  dataScadenza: moment(i.dueDate).format('DDMMYYYY'),
                  pagamentoBloccato: '0',
                  tipoPagamento: '4',
                  importoRataValuta: Number(i.grossAmount / 100).toFixed(2),
                });
              }
            }
          });
          return {
            headers: [
              { field: 'tipoRecord', position: 0, translation: 'tipo record' },
              { field: 'dataRegistrazione', position: 1, translation: 'data registrazione' },
              { field: 'tipoDocumento', position: 2, translation: 'tipo documento' },
              { field: 'numeroRegistrazione', position: 3, translation: 'numero registrazione' },
              { field: 'appendiceDigitata', position: 4, translation: 'appendice digitata' },
              { field: 'numeroRegistrazioneIva', position: 5, translation: 'numero registrazione iva' },
              { field: 'dataDocumento', position: 6, translation: 'data fattura' },
              { field: 'numeroDocumento', position: 7, translation: 'numero fattura' },
              { field: 'doppiaAnnotazione', position: 8, translation: 'doppia annotazione' },
              { field: 'appDoppiaAnnotazione', position: 9, translation: 'app. doppia annotazione' },
              { field: 'codiceConto', position: 10, translation: 'codice conto' },
              { field: 'codiceFiscale', position: 11, translation: 'codice fiscale' },
              { field: 'partitario', position: 12, translation: 'partitario' },
              { field: 'codiceValuta', position: 13, translation: 'valuta' },
              { field: 'centroImputazione', position: 14, translation: 'centro imputazione' },
              { field: 'condizionePagamento', position: 15, translation: 'condizione pagamento' },
              { field: 'causaleContabile', position: 16, translation: 'causale contabile' },
              { field: 'causaleIVA1', position: 17, translation: 'registro iva 1' },
              { field: 'causaleIVA2', position: 18, translation: 'registro iva 2' },
              { field: 'causaleIVA3', position: 19, translation: 'registro iva 3' },
              { field: 'causaleIVA4', position: 20, translation: 'registro iva 4' },
              { field: 'annoIVA', position: 21, translation: 'anno iva' },
              { field: 'periodoIVA', position: 22, translation: 'periodo iva' },
              { field: 'dataOpIVA', position: 23, translation: 'data operazione iva' },
              { field: 'docPrivato', position: 24, translation: 'doc privato' },
              { field: 'territorio', position: 25, translation: 'territorio' },
              { field: 'totDocValuta', position: 26, translation: 'totale documento valuta' },
              { field: 'ritenuta', position: 27, translation: 'ritenuta collegata' },
              { field: 'tipoOperazioneRitenuta', position: 28, translation: 'tipo operazione ritenuta' },
              { field: 'causalePag', position: 29, translation: 'causale pagamento' },
              { field: 'tipoRiga', position: 30, translation: 'tipo riga' },
              { field: 'codiceContoRiga', position: 31, translation: 'codice conto' },
              { field: 'cliFor', position: 32, translation: 'cli for' },
              { field: 'codiceCespite', position: 33, translation: 'codice cespite' },
              { field: 'importoValuta', position: 34, translation: 'importo valuta' },
              { field: 'centroImpiego', position: 35, translation: 'centro impiego' },
              { field: 'codiceIvaOrig', position: 36, translation: 'codice iva orig' },
              { field: 'indetraibile', position: 37, translation: '% indetraibile' },
              { field: 'indetraibileProRata', position: 38, translation: '% indetraibile pro rata' },
              { field: 'causaleDigitata', position: 39, translation: 'causale digitata' },
              { field: 'descrizione', position: 40, translation: 'descrizione' },
              { field: 'rilevanteRitenute', position: 41, translation: 'rilevante ritenute' },
              { field: 'codiceIva', position: 42, translation: 'codice iva' },
              { field: 'imponibile', position: 43, translation: 'imponibile' },
              { field: 'imponibileIva', position: 44, translation: 'imponibileIva' },
              { field: 'ivaIndetraibile', position: 45, translation: 'indetraibile iva' },
              { field: 'imponibileIvaIndetraibile', position: 46, translation: 'imponibile indetraibile iva' },
              { field: 'ivaIndetraibileProRata', position: 47, translation: 'indetraibile iva pro rata' },
              { field: 'ivaImponibileProRata', position: 48, translation: 'imponibile iva pro rata' },
              { field: 'dataScadenza', position: 49, translation: 'data scadenza pagamento' },
              { field: 'pagamentoBloccato', position: 50, translation: 'pagamento bloccato' },
              { field: 'tipoPagamento', position: 51, translation: 'tipo pagamento' },
              { field: 'importoRataValuta', position: 52, translation: 'importo rata valuta' },
            ],
            data: rows,
          };
        })
        .then((data) => Promise.resolve(csvReport(data)))
        .then((buffer) =>
          documentService.addDocument(
            {
              type: documentTypes.INVOICES,
              ownerId: 'SYSTEM',
              displayName: `Export invoices ${new Date().toString()}.csv`,
              locked: true,
            },
            buffer,
          ),
        )
        .then((doc) => {
          const getPresignedUrl = `/v1/documents/${doc._id}/presigned-download`;
          return reply.header('Link', getPresignedUrl).send({
            _meta: { getPresignedUrl },
            item: { documentId: doc._id },
          });
        })
        .catch((error) => reply.send(Boom.badRequest(error)));
    }),
  );

  next();
};

module.exports = list;
