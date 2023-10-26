const Boom = require('boom');
const moment = require('moment');
const InvoicingFlowService = require('../../services/invoicing-flow-srv');
const InvoiceService = require('../../services/invoice-srv');
const PromoterService = require('../../services/promoter-srv');
const DocumentService = require('../../services/document-srv');
const errorHandler = require('../../utils/error-handler');
const { csvReport } = require('../../services/excel-report-srv');
const { types: documentTypes } = require('../../services/document-srv/document-types');

const list = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Create Promoters Report',
      description: 'Create promoters report and get the document',
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
      const invoicesAll = await invoiceService
        .getInvoices(0, 0, { _id: { $in: confirmedInvoices } })
        .then((state) => state)
        .catch((error) => error);

      promoterService
        .getByIds(invoicesAll.map((el) => el.promoterId))
        .then((promoters) => ({
          headers: [
            { field: 'tipoRecord', position: 0, translation: 'tipo record' },
            { field: 'tipoAnag', position: 1, translation: ' tipo anag' },
            { field: 'codFornitore', position: 2, translation: 'codice fornitore' },
            { field: 'codAltroSistema', position: 3, translation: 'cod altro sistema' },
            { field: 'partitaIva', position: 4, translation: 'partita iva' },
            { field: 'codFiscale', position: 5, translation: 'codice fiscale' },
            { field: 'tipoSoggetto', position: 6, translation: 'tipo soggetto' },
            { field: 'ragSoc1', position: 7, translation: 'rag soc 1' },
            { field: 'ragSoc2', position: 8, translation: 'rag soc 2' },
            { field: 'sedeLegIndirizzo', position: 9, translation: 'sede leg: indirizzo' },
            { field: 'sedeLegCAP', position: 10, translation: 'sede leg: cap' },
            { field: 'sedeLegLocalita', position: 11, translation: 'sede leg: localita' },
            { field: 'sedeLegLocalita2', position: 12, translation: 'sede leg: localita 2' },
            { field: 'sedeLegProvincia', position: 13, translation: 'sede leg: provincia' },
            { field: 'sedeLegStatoISO2', position: 14, translation: 'sede leg: stato ISO2' },
            { field: 'titPartitaIVA', position: 15, translation: 'titolare partita iva' },
            { field: 'pfCognome', position: 16, translation: 'persona fisica: cognome' },
            { field: 'pfNome', position: 17, translation: 'persona fisica: nome' },
            { field: 'pfSesso', position: 18, translation: 'persona fisica: sesso' },
            { field: 'pfComuneNascita', position: 19, translation: 'persona fisica: comune nascita' },
            { field: 'pfProvinciaNascita', position: 20, translation: 'persona fisica: provincia nascita' },
            { field: 'pfStatoNascita', position: 21, translation: 'Persona fisica:stato ISO nascita' },
            { field: 'pfDataNascita', position: 22, translation: 'Persona fisica: data di nascita' },
            { field: 'cellulare', position: 23, translation: 'cellulare' },
            { field: 'email', position: 24, translation: 'email' },
            { field: 'contoPatrim', position: 25, translation: 'conto patrim' },
            { field: 'tipoRilevanzaIVA', position: 26, translation: 'tipo rilevanza iva' },
            { field: 'anagAgente', position: 27, translation: 'anag. agente' },
            { field: 'anagRitAcconto', position: 28, translation: 'anag. rit.acc.' },
            { field: 'valuta', position: 29, translation: 'valuta' },
            { field: 'codCondPagamento', position: 30, translation: 'codice cond. pag.' },
            { field: 'tipoOperRitenute', position: 31, translation: 'tipo oper. ritenute' },
            { field: 'tipoContribPrevid', position: 32, translation: 'tipo contrib previd' },
            { field: 'codContoBanca', position: 33, translation: 'codice ns conto banca' },
            { field: 'apfCodice', position: 34, translation: 'app.banc.fornit: codice' },
            { field: 'apfABI', position: 35, translation: 'app.banc.fornit: ABI' },
            { field: 'apfCAB', position: 36, translation: 'app.banc.fornit: CAB' },
            { field: 'apfCinIban', position: 37, translation: 'app.banc.fornit: CIN IBAN' },
            { field: 'apfCinBban', position: 38, translation: 'app.banc.fornit: CIN BBAN' },
            { field: 'apfConto', position: 39, translation: 'app.banc.fornit: conto' },
            { field: 'apfBIC', position: 40, translation: 'app.banc.fornit: BIC' },
            { field: 'apfCodPaese', position: 41, translation: 'app.banc.fornit: Codice paese' },
            { field: 'apfIBAN', position: 42, translation: 'app.banc.fornit: IBAN' },
          ],
          data: promoters.map((p) => ({
            tipoRecord: 'GEN',
            tipoAnag: 2,
            codFornitore: '0', // GEN: se zero ass. autom.
            codAltroSistema: p._id, // excel: 20, 12, 15?
            partitaIva: p.tax.fiscalRegimeType === 'occasional-performance' ? '' : p.tax.vat || '',
            codFiscale: p.fiscalCode || '',
            // 1-Società di capitali, 2-Società di persone, 3-Persona fisica, 4-Altro
            tipoSoggetto: p.physicalPerson ? 3 : 1, // ci sarebbe un flag IsPersonaFisica, l'alternativa è 1 o 2?
            ragSoc1: `${p.name} ${p.surname}`, // o il contrario? Occhio però a casi come "Acc Marchesi Srl"
            ragSoc2: '',
            sedeLegIndirizzo: `${p.address.route} ${p.address.streetNumber}`,
            sedeLegCAP: `${p.address.postalCode}`,
            sedeLegLocalita: `${p.address.city}`,
            sedeLegLocalita2: '',
            sedeLegProvincia: `${p.address.province}`,
            sedeLegStatoISO2: 'IT', // valori su db: Italia o null
            titPartitaIVA: '1', // o dipende dall'esistenza di p.tax.vat?
            pfCognome: p.physicalPerson ? p.surname : '',
            pfNome: p.physicalPerson ? p.name : '',
            pfSesso: p.physicalPerson ? p.sex : '',
            pfComuneNascita: p.physicalPerson ? p.birthCity : '',
            pfProvinciaNascita: p.birthRegion ? p.birthRegion : '',
            pfStatoNascita: p.birthState ? p.birthState : '',
            pfDataNascita: p.physicalPerson ? moment(p.birthDate).format('DDMMYYYY') : '',
            cellulare: p.mobilePhone,
            email: p.username,
            contoPatrim: '330301',
            tipoRilevanzaIVA: 0, // ?
            anagAgente: p.physicalPerson ? 1 : '0', // verificare
            anagRitAcconto: p.physicalPerson ? 1 : '0', // verificare
            valuta: 'EUR',
            codCondPagamento: 400,
            // eslint-disable-next-line no-nested-ternary
            tipoOperRitenute: p.physicalPerson
              ? p.tax.fiscalRegimeType !== 'occasional-performance'
                ? 'AG15'
                : 'LA66'
              : '0', // verificare
            tipoContribPrevid: '',
            codContoBanca: 3, // verificare
            // tutti campi recuperabili da IBAN? (Vedi tax.getPaese())
            apfCodice: '',
            apfABI: '',
            apfCAB: '',
            apfCinIban: '',
            apfCinBban: '',
            apfConto: '', // p.tax.getConto(),
            apfBIC: '',
            apfCodPaese: p.tax.getPaese(),
            apfIBAN: p.tax.iban,
          })),
        }))
        .then((data) => Promise.resolve(csvReport(data)))
        .then((buffer) =>
          documentService.addDocument(
            {
              type: documentTypes.PROMOTERS,
              ownerId: 'SYSTEM',
              displayName: `Export promoters ${new Date().toString()}.csv`,
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
