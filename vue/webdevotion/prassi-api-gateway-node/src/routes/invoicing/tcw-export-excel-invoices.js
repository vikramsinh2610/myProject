const Boom = require('boom');
const moment = require('moment');
const DocumentService = require('../../services/document-srv');
const PromoterService = require('../../services/promoter-srv');
const { excelReport } = require('../../services/excel-report-srv');
const { types: documentTypes } = require('../../services/document-srv/document-types');
const translateEntryOrigin = require('../../services/invoice-pdf-srv/translate-types');
const errorHandler = require('../../utils/error-handler');
const InvoicingFlowService = require('../../services/invoicing-flow-srv');
const InvoiceService = require('../../services/invoice-srv');
const counters = require('../../utils/counters');
const SurveyService = require('../../services/survey-srv');

require('../../utils/foreach');
const {types: fiscalRegimeTypes} = require("../../services/promoter-srv/filscal-regime-types");

function getCurrentOrdinal(mongodb, month, year) {
  return counters.current(mongodb, `EXPORT-INVOICES-ID-${month}-${year}`).then((count) => count);
}

function getLastOrdinal(mongodb) {
  return counters.lastInvoiceCounter(mongodb).then((count) => count);
}

function getPreviousOrdinal(mongodb) {
  return counters.previousInvoiceCounter(mongodb).then((count) => count);
}

function setNumber(mongodb, month, year, number) {
  return counters.set(mongodb, `EXPORT-INVOICES-ID-${month}-${year}`, number).then((count) => count);
}

function mapTaxNonSoggette(taxCode, total) {
  switch (taxCode) {
    case 'REGAG':
      return Number(total / 100).toFixed(2);
    case '1038':
      // @ts-ignore
      return Number(Number(total / 100).toFixed(2) - Number((total * 0.2) / 100).toFixed(2)).toFixed(2);
    case '1038C':
      // @ts-ignore
      return Number(Number(total / 100).toFixed(2) - Number((total * 0.5) / 100).toFixed(2)).toFixed(2);
    default:
      return 0;
  }
}

function mapCodiceIva(taxCode) {
  switch (taxCode) {
    case 'REGAG':
      return 'REGFORF';
    case 'REGMIN':
      return '1';
    case '1038':
      return 'ES10';
    case '1038C':
      return 'ES10';
    default:
      return 0;
  }
}

function mapTaxRitenute(taxCode, total) {
  switch (taxCode) {
    case 'REGAG':
      return 0;
    case '1038':
      return Number((total * 0.2) / 100).toFixed(2);
    case '1038C':
      return Number((total * 0.5) / 100).toFixed(2);
    default:
      return 0;
  }
}

function mapCausaleContabile(fiscalRegime) {
  let type = 'FA310';
  switch (fiscalRegime) {
    case fiscalRegimeTypes.FLAT:
    case fiscalRegimeTypes.OCCASIONAL_PERFORMANCE:
      type = 'FORFFE';
      break;
    case fiscalRegimeTypes.MINIMUM:
      type = 'FORMIN';
      break;
    default:
      type = 'FA310';
  }
  return type;
}

function getPrimaryKey(index) {
  const s = `000000000${index}`;
  // eslint-disable-next-line unicorn/prefer-string-slice
  const cod = s.substr(s.length - 7);
  return `TKS${cod}`;
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
    // eslint-disable-next-line sonarjs/cognitive-complexity
    errorHandler(async (request, reply) => {
      const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);
      const promoterService = new PromoterService(fastify.mongo.db);
      const invoiceService = new InvoiceService(fastify.mongo.db);
      const surveyService = new SurveyService(fastify.mongo.db, fastify.knex);
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

      const { productivePeriodYear } = invoicing;
      const { productivePeriodMonth } = invoicing;

      let currentIndex = await getLastOrdinal(fastify.mongo.db);
      const previousIndex = await getPreviousOrdinal(fastify.mongo.db);

      const currentMonthIndex = await getCurrentOrdinal(fastify.mongo.db, productivePeriodYear, productivePeriodMonth);
      if (currentMonthIndex === currentIndex) {
        currentIndex = previousIndex;
      }

      if (request.query.newExportNumber) {
        currentIndex = request.query.newExportNumber;
      }

      if (request.query.newExportNumber) {
        currentIndex = Number.parseInt(request.query.newExportNumber, 10);
      }

      // @ts-ignore
      if (typeof currentIndex === 'string' || currentIndex instanceof String) {
        // @ts-ignore
        currentIndex = Number.parseInt(currentIndex, 10);
      }

      const confirmedInvoices = invoicing.invoices.filter((invoice) => invoice.confirmed).map((el) => el._id);

      invoiceService
        .getInvoices(0, 0, { _id: { $in: confirmedInvoices } }) // request.query.count
        .then(async (invoices) => {
          // request.query.count
          const rows = [];

          let numCount = currentIndex;
          await invoices.forEachAsync(async (i) => {
            const promoter = await promoterService.getPromoterById(i.promoterId);
            const survey = await surveyService.getSurveyResults({ userId: promoter._id, type: 'onboarding' }, 0, 1);
            let onPaymentDelega;
            if (survey && survey.length > 0) {
              const onPaymentDelegaResponses = survey[0].questions.find((el) => el._id === 'on-payment-delega');
              if (
                onPaymentDelegaResponses &&
                onPaymentDelegaResponses.responses &&
                onPaymentDelegaResponses.responses.length > 0
              ) {
                const onPaymentDelegaResponse = onPaymentDelegaResponses.responses.find((el) => el.selected);
                if (onPaymentDelegaResponse) {
                  onPaymentDelega = onPaymentDelegaResponse.text.trim() === 'Si';
                }
              }
            }
            if (!onPaymentDelega) return;
            if (i.number === 'ND') return;

            numCount += 1;
            if (rows.length === 0) {
              rows.push({
                // eslint-disable-next-line no-plusplus
                chiavePrimaria: 'Chiave primaria (GUID)',
                tipoDocumento: 'Tipo documento',
                ciclo: 'Ciclo',
                codiceCausaleDocumento: 'Codice Causale documento',
                tipoAnagForzaVendita: 'Tipologia anagrafica forza vendita',
                tipoMagazzino: 'Tipologia Magazzino (solo unità logistica tipo 2)',
                dataRegistrazione: 'Data di registrazione',
                numeroRegistrazione: 'Numero registrazione',
                tipoSoggettoIntestatario: 'Tipo Soggetto Intestatario',
                numeroProtocollo: 'Numero Protocollo',
                suffissoNumerazioneProtocollo: 'Suffisso Numerazione protocollo',
                dataDocumento: 'Data documento',
                numeroDocumento: 'Numero Documento',
                codiceSoggettoIntestatario: 'Codice Soggetto Intestatario (ba_keysog)',
                valutaDocumento: 'Valuta documento',
                cambioValutaConto: 'Cambio rispetto alla valuta di conto',
                dataOperazione: 'Data Operazione',
                businessUnit: 'Business  Unit',
                codiceUnitOperativa: 'Codice unità operativa',
                codiceSoggettoFatturazione: 'Codice Soggetto di Fatturazione (ba_keysog)',
                sedeSoggettoFatturazione: 'Sede Soggetto di Fatturazione (ba_offices)',
                codiceMagazzino: 'Codice Magazzino',
                codicePagamento: 'Codice Pagamento',
                importoPrepagato: 'Importo prepagato',
                contoCorrenteImportoPrepagato: 'Conto corrente per importo prepagato',
                numeroRiga: 'Numero riga',
                progressivoRiga: 'Progressivo Riga',
                tipologiaRigaArticolo: 'Tipologia riga Articolo',
                codiceChiaveArticolo: 'Codice Chiave di ricerca Articolo (ba_artkey)',
                descrizione: 'Descrizione',
                unitaMisuraRiga: 'Unità di misura riga',
                qtaMovimentata: 'Qta movimentata',
                prezzoUnitario: 'Prezzo unitario',
                codiceIva: 'Codice Iva',
                codiceContoContropartita: 'Codice conto di contropartita',
                descrizioneSupplementare: 'Descrizione supplementare',
                tipologiaRigaDocumento: 'Tipologia riga documento',
                flagCalcoloPrezzo: 'Flag calcolo prezzo',
                contropartitaIvaDetraibile: 'Contropartita Iva Detraibile',
                totaleSommeNonSoggette: 'Totale somme non soggette',
                totalePrevidenzaOrdine: 'Totale importo per Cassa previdenza ordine',
                dataCompetenza: 'Data competenza (Default.=Data Operazione)',
                codiceTributo: 'Codice tributo',
                causalePrestazioneRitenute: 'Causale prestazione ritenute (Valori con lista: R)',
                importoSommeNonSoggette: 'Importo somme non soggette (escluse)',
                imponibileRitenuta: 'Imponibile ritenuta',
                percentualeRitenuta: 'Percentuale Ritenuta',
                importoRitenuta: 'Importo ritenuta',
                percentualePercipiente: 'Percentuale Ritenuta a carico del Percipiente',
                importoRitenutaAzienda: "Importo ritenuta a carico dell'Azienda",
                speseRimborsate: 'Spese rimborsate',
                contoAnaliticaContropartita: 'conto Analitica Contropartita',
                centroDiCostoContropartita: 'Centro Di Costo Contropartita',
              });
            }
            let rowNum = 1;

            let totaleSommeNonSoggette = '';
            if (i.taxes && i.taxes.length > 0) {
              const stampArray = i.taxes.find((el) => el.origin === 'stamp');
              totaleSommeNonSoggette = stampArray
                ? Number(stampArray.amount / 100)
                    .toFixed(2)
                    .toString()
                : '';
            }
            await i.accountingNotes.forEachAsync(async (n) => {
              if (n.invoiceAmount !== 0) {
                let codiceContoContropartitaCode = 'T5124020';
                let contoAnaliticaContropartita = 'T5124020';
                let centroDiCostoContropartita = 'PROV-L&W';
                if (n.origin === 'advance' || n.origin === 'debit') {
                  codiceContoContropartitaCode = 'T0616120';
                  contoAnaliticaContropartita = '';
                  centroDiCostoContropartita = '';
                }
                if (n.origin === 'management-fee') {
                  codiceContoContropartitaCode = 'T5124054';
                  contoAnaliticaContropartita = '';
                  centroDiCostoContropartita = '';
                }

                // eslint-disable-next-line no-plusplus
                const count = rowNum++;
                rows.push({
                  chiavePrimaria: getPrimaryKey(numCount),
                  tipoDocumento: 'FAT',
                  ciclo: 'ACQ',
                  codiceCausaleDocumento: mapCausaleContabile(promoter.tax.fiscalRegimeType),
                  tipoAnagForzaVendita: '',
                  tipoMagazzino: '',
                  dataRegistrazione: moment(i.issueDate).format('YYYY-MM-DD'),
                  numeroRegistrazione: '',
                  tipoSoggettoIntestatario: 'FOR',
                  numeroProtocollo: '',
                  suffissoNumerazioneProtocollo: '',
                  dataDocumento: moment(i.issueDate).format('YYYY-MM-DD'),
                  numeroDocumento: i.number.toString().slice(0, Math.max(0, i.number.toString().length - 5)),
                  codiceSoggettoIntestatario: promoter.subjectCode,
                  valutaDocumento: 'EUR',
                  cambioValutaConto: '1',
                  dataOperazione: moment(i.issueDate).format('YYYY-MM-DD'),
                  businessUnit: '001',
                  codiceUnitOperativa: '0000000012',
                  codiceSoggettoFatturazione: '',
                  sedeSoggettoFatturazione: '',
                  codiceMagazzino: '',
                  codicePagamento: 'B18',
                  importoPrepagato: '',
                  contoCorrenteImportoPrepagato: '',
                  // eslint-disable-next-line no-plusplus
                  numeroRiga: count,
                  progressivoRiga: '',
                  tipologiaRigaArticolo: '4',
                  codiceChiaveArticolo: 'PROTC',
                  descrizione: n.description || translateEntryOrigin(n.origin),
                  unitaMisuraRiga: 'N',
                  qtaMovimentata: '1',
                  prezzoUnitario: Number(n.invoiceAmount / 100).toFixed(2),
                  codiceIva: mapCodiceIva(promoter.taxCode),
                  codiceContoContropartita: codiceContoContropartitaCode,
                  descrizioneSupplementare: '',
                  tipologiaRigaDocumento: '',
                  flagCalcoloPrezzo: '',
                  contropartitaIvaDetraibile: '',
                  totaleSommeNonSoggette: count === 1 ? totaleSommeNonSoggette : '',
                  totalePrevidenzaOrdine: '',
                  dataCompetenza: '',
                  codiceTributo: promoter.taxCode,
                  causalePrestazioneRitenute: 'R',
                  importoSommeNonSoggette: count === 1 ? mapTaxNonSoggette(promoter.taxCode, i.grossAmount) : '',
                  imponibileRitenuta: count === 1 ? mapTaxRitenute(promoter.taxCode, i.grossAmount) : '',
                  percentualeRitenuta: '',
                  importoRitenuta: '',
                  percentualePercipiente: '',
                  importoRitenutaAzienda: '',
                  contoAnaliticaContropartita,
                  centroDiCostoContropartita,
                });
              }
            });
          });

          let canSet = false;
          if (productivePeriodYear === 2020 && productivePeriodMonth >= 2) {
            canSet = true;
          }
          if (productivePeriodYear > 2020) {
            canSet = true;
          }

          if (currentMonthIndex === 0 && canSet) {
            await setNumber(fastify.mongo.db, productivePeriodYear, productivePeriodMonth, numCount);
          }

          if (request.query.newExportNumber && canSet) {
            await setNumber(
              fastify.mongo.db,
              productivePeriodYear,
              productivePeriodMonth,
              Number.parseInt(request.query.newExportNumber, 10),
            );
          }

          return {
            headers: [
              { field: 'chiavePrimaria', position: 0, translation: 'DOSERIAL_K' },
              { field: 'tipoDocumento', position: 1, translation: 'DOTIPDOC' },
              { field: 'ciclo', position: 2, translation: 'DOFLCICL' },
              { field: 'codiceCausaleDocumento', position: 3, translation: 'DOCODCAU' },
              { field: 'tipoAnagForzaVendita', position: 4, translation: 'DOTIPAGE' },
              {
                field: 'tipoMagazzino',
                position: 5,
                translation: 'DOTIPMAG',
              },
              { field: 'dataRegistrazione', position: 6, translation: 'DODATREG' },
              { field: 'numeroRegistrazione', position: 7, translation: 'DONUMREG' },
              { field: 'tipoSoggettoIntestatario', position: 8, translation: 'DOTIPSOG' },
              { field: 'numeroProtocollo', position: 9, translation: 'DONUMPRO' },
              { field: 'suffissoNumerazioneProtocollo', position: 10, translation: 'DOALFPRO' },
              { field: 'dataDocumento', position: 11, translation: 'DODATDOC' },
              { field: 'numeroDocumento', position: 12, translation: 'DONUMDOC' },
              {
                field: 'codiceSoggettoIntestatario',
                position: 13,
                translation: 'DOCODSOG',
              },
              { field: 'valutaDocumento', position: 14, translation: 'DOCODVAL' },
              { field: 'cambioValutaConto', position: 15, translation: 'DOCAOVAL' },
              { field: 'dataOperazione', position: 16, translation: 'DODATOPE' },
              { field: 'businessUnit', position: 17, translation: 'DOBUSUNI' },
              { field: 'codiceUnitOperativa', position: 18, translation: 'DOCODUFF' },
              {
                field: 'codiceSoggettoFatturazione',
                position: 19,
                translation: 'DOSOGFAT',
              },
              {
                field: 'sedeSoggettoFatturazione',
                position: 20,
                translation: 'DODIPFAT',
              },
              { field: 'codiceMagazzino', position: 21, translation: 'DOCODMAG' },
              { field: 'codicePagamento', position: 22, translation: 'DOCODPAG' },
              { field: 'importoPrepagato', position: 23, translation: 'DOIMPPRE' },
              {
                field: 'contoCorrenteImportoPrepagato',
                position: 24,
                translation: 'DOCCRPRE',
              },
              { field: 'numeroRiga', position: 25, translation: 'gsdo_mdocume.CPROWNUM_K' },
              { field: 'progressivoRiga', position: 26, translation: 'gsdo_mdocume.CPROWORD' },
              { field: 'tipologiaRigaArticolo', position: 27, translation: 'gsdo_mdocume.DOFLGART' },
              {
                field: 'codiceChiaveArticolo',
                position: 28,
                translation: 'gsdo_mdocume.DOCODKEY',
              },
              { field: 'descrizione', position: 29, translation: 'gsdo_mdocume.DODESART' },
              { field: 'unitaMisuraRiga', position: 30, translation: 'gsdo_mdocume.DOUNIMIS' },
              { field: 'qtaMovimentata', position: 31, translation: 'gsdo_mdocume.DOQTAMOV' },
              { field: 'prezzoUnitario', position: 32, translation: 'gsdo_mdocume.DOPREZZO' },
              { field: 'codiceIva', position: 33, translation: 'gsdo_mdocume.DOCODIVA' },
              { field: 'codiceContoContropartita', position: 34, translation: 'gsdo_mdocume.DOCODCON' },
              { field: 'descrizioneSupplementare', position: 35, translation: 'gsdo_mdocume.DODESSUP' },
              { field: 'tipologiaRigaDocumento', position: 36, translation: 'gsdo_mdocume.DOCODDES' },
              { field: 'flagCalcoloPrezzo', position: 37, translation: 'gsdo_mdocume.DOFLPREZ' },
              { field: 'contropartitaIvaDetraibile', position: 38, translation: 'gsdo_mdocume.DOCODCID' },
              { field: 'contoAnaliticaContropartita', position: 38, translation: 'gsdo_mdocume.DOVOCCOA' },
              { field: 'centroDiCostoContropartita', position: 38, translation: 'gsdo_mdocume.DOCDCCOA' },
              { field: 'progressivoRiga', position: 39, translation: 'gsdo_dritdoc.CPROWNUM4_K' },
              { field: 'totaleSommeNonSoggette', position: 40, translation: 'gsdo_dritdoc.RITOTESC' },
              {
                field: 'totalePrevidenzaOrdine',
                position: 41,
                translation: 'gsdo_dritdoc.RITOTCPO',
              },
              { field: 'dataCompetenza', position: 42, translation: 'gsdo_dritdoc.RIDATCON' },
              { field: 'progressivoRiga', position: 43, translation: 'gsdo_dritdoc.CPROWORD' },
              { field: 'codiceTributo', position: 44, translation: 'gsdo_dritdoc.RICODTRI' },
              {
                field: 'causalePrestazioneRitenute',
                position: 45,
                translation: 'gsdo_dritdoc.RIRITCAU',
              },
              { field: 'importoSommeNonSoggette', position: 46, translation: 'gsdo_dritdoc.RIIMPESC' },
              { field: 'imponibileRitenuta', position: 47, translation: 'gsdo_dritdoc.RIIMPONI' },
              { field: 'percentualeRitenuta', position: 48, translation: 'gsdo_dritdoc.RIPERRIT' },
              { field: 'importoRitenuta', position: 49, translation: 'gsdo_dritdoc.RIIMPRIT' },
              {
                field: 'percentualePercipiente',
                position: 50,
                translation: 'gsdo_dritdoc.RIPERAZI',
              },
              { field: 'importoRitenutaAzienda', position: 51, translation: 'gsdo_dritdoc.RIIMPAZI' },
              { field: 'speseRimborsate', position: 52, translation: 'gsdo_dritdoc.RISPERIM' },
            ],
            data: rows,
          };
        })
        .then((data) => Promise.resolve(excelReport(data)))
        .then((buffer) =>
          documentService.addDocument(
            {
              type: documentTypes.INVOICES,
              ownerId: 'SYSTEM',
              displayName: `Export invoices ${new Date().toString()}.xlsx`,
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
