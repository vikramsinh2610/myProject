const Boom = require('boom');
const moment = require('moment');
const KpiService = require('../../../services/kpi-srv');
const NetworkService = require('../../../services/network-srv');
const CustomerService = require('../../../services/customer-srv');
const DocumentService = require('../../../services/document-srv');
const { csvReport } = require('../../../services/excel-report-srv');
const { types: documentTypes } = require('../../../services/document-srv/document-types');
const { translateCountryISO } = require('../../../utils/iso-country');
const errorHandler = require('../../../utils/error-handler');
const { periodOrToday } = require('../../../utils/productive-period-helper');
require('../../../utils/foreach');
const PromoterService = require('../../../services/promoter-srv');
const DossierInsurerSrv = require('../../../services/dossier-insurer-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Dossiers Export',
      description: 'Get dossier list for specified promoter',
      tags: ['invoicing'],
      querystring: {
        type: 'object',
        required: [
          'promoterId',
          'toProductivePeriodYear',
          'toProductivePeriodMonth',
          'fromProductivePeriodYear',
          'fromProductivePeriodMonth',
        ],
        properties: {
          promoterId: {
            type: 'string',
            description: 'id of the root promoter for the summary',
          },
          networkId: {
            type: 'string',
            description: 'id of the root promoter for the summary',
          },
          fullSearch: {
            type: 'string',
            description: 'full periods search flag',
          },
          solarSearch: {
            type: 'string',
            description: 'solar periods search flag',
          },
          searchCustomer: {
            type: 'string',
            description: 'id of the customer for the summary',
          },
          contractSearch: {
            type: 'string',
            description: 'text of the contract to search',
          },
          commissionType: {
            description: 'type of practice',
          },
          status: {
            description: 'status of practice',
          },
          companyId: {
            type: 'string',
            description: 'company id',
          },
          productId: {
            type: 'string',
            description: 'product id',
          },
          type: {
            type: 'string',
            description: 'type id',
          },
          skip: {
            type: 'integer',
            default: 0,
            description: 'Number of items to skip',
          },
          count: {
            type: 'integer',
            default: 20,
            description: 'Number of items to return',
          },
          toProductivePeriodYear: {
            type: 'integer',
            description: 'To productive period - year',
          },
          toProductivePeriodMonth: {
            type: 'integer',
            description: 'To productive period - month',
          },
          fromProductivePeriodYear: {
            type: 'integer',
            description: 'From productive period - year',
          },
          fromProductivePeriodMonth: {
            type: 'integer',
            description: 'From productive period - month',
          },
        },
      },
    },
  };

  fastify.get(
    '/',
    options,
    // eslint-disable-next-line sonarjs/cognitive-complexity
    errorHandler(async (request, reply) => {
      // eslint-disable-next-line prefer-destructuring
      const sql = fastify.knex;
      const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);
      const kpiService = new KpiService(fastify.mongo.db, fastify.knex);
      const { productivePeriodYear, productivePeriodMonth } = periodOrToday(
        request.query.toProductivePeriodYear,
        request.query.toProductivePeriodMonth,
      );
      const dossierInsurerSrv = new DossierInsurerSrv(fastify.mongo.db);
      const promoterService = new PromoterService(fastify.mongo.db);
      const customerService = new CustomerService(fastify.mongo.db);
      const networkService = new NetworkService(fastify.mongo.db);
      const firstNode = await networkService.userCanSeeProductivePeriod(
        request.identity.roleId,
        request.identity._id,
        request.query.promoterId,
        productivePeriodYear,
        productivePeriodMonth,
      );
      if (!firstNode) return reply.send(Boom.badRequest('Utente non autorizzato'));

      const nodeList = await networkService.getNetworkListFlat(7, '');

      const promoterToQuery = request.identity._id === request.query.promoterId ? undefined : request.query.promoterId;

      const sheltiaCompanyId = 'db70a2e5-81d8-9046-9b9c-aa2c008d0a1e';

      return kpiService
        .listContractsKpiByFilter(
          request.query.networkId || firstNode.model._id,
          promoterToQuery,
          request.query.contractSearch,
          request.query.commissionType ? JSON.parse(request.query.commissionType) : [],
          sheltiaCompanyId,
          request.query.productId,
          request.query.searchCustomer,
          request.query.fullSearch,
          request.query.solarSearch,
          request.query.status ? JSON.parse(request.query.status) : [],
          request.query.type,
          {
            fromProductivePeriodYear: Number.parseInt(request.query.fromProductivePeriodYear, 10),
            fromProductivePeriodMonth: Number.parseInt(request.query.fromProductivePeriodMonth, 10),
            toProductivePeriodYear: Number.parseInt(request.query.toProductivePeriodYear, 10),
            toProductivePeriodMonth: Number.parseInt(request.query.toProductivePeriodMonth, 10),
            currentProductivePeriodYear: new Date().getFullYear(),
            currentProductivePeriodMonth: new Date().getMonth() + 1,
          },
          0,
          0,
        )
        .then(async (practices) => {
          const rows = [];
          // eslint-disable-next-line unicorn/consistent-function-scoping
          await practices.forEachAsync(async (p) => {
            // eslint-disable-next-line no-plusplus
            const dossierInsurer = await dossierInsurerSrv.getLastDossierInsurer(p.dossierId);
            const nodeOriginalPeriod = nodeList.find((item) => item._id === dossierInsurer.networkNodeId);

            if (!p.customer || (p.customer && p.customer.length < 0)) return;

            const cp = await customerService.getCustomerById(p.customerId);

            const partitaIva = p.customer[0].PartitaIva;
            const statoDiNascita = p.customer[0].LuogoNascita.StatoDiNascita
              ? p.customer[0].LuogoNascita.StatoDiNascita.toLowerCase()
              : '';

            const promotersFullCurrent = [];

            if (nodeOriginalPeriod && nodeOriginalPeriod.displayPromoterNamesIds.length > 0) {
              // eslint-disable-next-line consistent-return
              await nodeOriginalPeriod.displayPromoterNamesIds.forEachAsync(async (i) => {
                if (!i) return promotersFullCurrent.push('');
                const promoter = await promoterService.getPromoterById(i);
                if (promoter) promotersFullCurrent.push(`${promoter.serialNumber} ${promoter.displayName}`);
              });
            }

            // eslint-disable-next-line promise/no-nesting
            const consulting = await sql
              .select('data')
              .from('consulting')
              .where('proposalNumber', `SUB${p.dossierId.slice(3)}`)
              .first()
              .then((x) => x && x.data);

            rows.push({
              tipoRecord: 'GEN',
              tipoAnag: 1,
              codFornitore: '0', // GEN: se zero ass. autom.
              codAltroSistema: cp._id, // excel: 20, 12, 15?
              partitaIva: partitaIva || '',
              codFiscale: cp.fiscalCode || '',
              // 1-Società di capitali, 2-Società di persone, 3-Persona fisica, 4-Altro
              tipoSoggetto: cp.physicalPerson ? 3 : 1, // ci sarebbe un flag IsPersonaFisica, l'alternativa è 1 o 2?
              ragSoc1: `${cp.name} ${cp.surname}`, // o il contrario? Occhio però a casi come "Acc Marchesi Srl"
              ragSoc2: '',
              sedeLegIndirizzo: `${cp.legalAddress.route} ${cp.legalAddress.streetNumber}`,
              sedeLegCAP: `${cp.legalAddress.postalCode}`,
              sedeLegLocalita: `${cp.legalAddress.city}`,
              sedeLegLocalita2: '',
              sedeLegProvincia: `${cp.legalAddress.province}`,
              sedeLegStatoISO2: 'IT', // valori su db: Italia o null
              titPartitaIVA: '1', // o dipende dall'esistenza di p.tax.vat?
              pfCognome: cp.physicalPerson ? cp.surname : '',
              pfNome: cp.physicalPerson ? cp.name : '',
              pfSesso: cp.physicalPerson ? cp.sex : '',
              pfComuneNascita: cp.physicalPerson ? cp.birthCity : '',
              pfProvinciaNascita: cp.birthRegion ? cp.birthRegion : '',
              pfStatoNascita: statoDiNascita ? translateCountryISO(statoDiNascita) : '',
              pfDataNascita: cp.physicalPerson ? moment(cp.birthDate).format('DDMMYYYY') : '',
              cellulare: cp.mobilePhone,
              email: cp.email,
              contoPatrim: '110301',
              tipoRilevanzaIVA: 0, // ?
              anagAgente: 1, // verificare
              anagRitAcconto: 1, // verificare
              valuta: 'EUR',
              codCondPagamento: 300,
              tipoOperRitenute: 'AG15', // verificare
              tipoContribPrevid: '',
              codContoBanca: 4, // verificare
              // tutti campi recuperabili da IBAN? (Vedi tax.getPaese())
              apfCodice: '',
              apfABI: '',
              apfCAB: '',
              apfCinIban: '',
              apfCinBban: '',
              apfConto: '', // p.tax.getConto(),
              apfBIC: '',
              apfCodPaese:
                consulting && consulting.sepa && consulting.sepa.iban ? consulting.sepa.iban.iban.slice(0, 2) : '',
              apfIBAN: consulting && consulting.sepa && consulting.sepa.iban ? consulting.sepa.iban.iban : '',
              codalt2: consulting && consulting.sepa ? consulting.sepa.number : '',
            });
          });

          return {
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
              { field: 'valuta', position: 29, translation: 'valuta' },
              { field: 'codCondPagamento', position: 30, translation: 'codice cond. pag.' },
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
              { field: 'codalt2', position: 43, translation: 'codice alternativo 2' },
            ],
            data: rows,
          };
        })
        .then((data) => Promise.resolve(csvReport(data)))
        .then((buffer) =>
          documentService.addDocument(
            {
              type: documentTypes.DOSSIERS,
              ownerId: 'SYSTEM',
              displayName: `Export anagrafica ${new Date().toString()}.csv`,
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
