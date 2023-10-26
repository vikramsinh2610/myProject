const Boom = require('boom');
const moment = require('moment');
const KpiService = require('../../../services/kpi-srv');
const NetworkService = require('../../../services/network-srv');
const CustomerService = require('../../../services/customer-srv');
const DocumentService = require('../../../services/document-srv');
const { csvReport } = require('../../../services/excel-report-srv');
const { types: documentTypes } = require('../../../services/document-srv/document-types');
const errorHandler = require('../../../utils/error-handler');
const { translateRoleId } = require('../../../services/promoter-job-srv/role-ids');
const { periodOrToday } = require('../../../utils/productive-period-helper');
require('../../../utils/foreach');
const PromoterService = require('../../../services/promoter-srv');
const DossierInsurerSrv = require('../../../services/dossier-insurer-srv');

function getMonthDateRange(year, month) {
  const startDate = moment([year, month - 1]);
  const endDate = moment(startDate).endOf('month');
  return { startDate, endDate };
}

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
          const numberToRate = (rate) => {
            switch (rate) {
              case 1:
                return 'Annuale';
              case 2:
                return 'Semestrale';
              case 4:
                return 'Trimestrale';
              case 12:
                return 'Mensile';
              default:
                return '';
            }
          };
          // @ts-ignore
          let rowNum = 1;
          await practices.forEachAsync(async (p) => {
            // eslint-disable-next-line no-plusplus
            const count = rowNum++;
            let roleId = 'Nessuno';
            roleId = p.promoterRoleId ? await translateRoleId(fastify.mongo.db, p.promoterRoleId) : 'Nessuno';
            const dossierInsurer = await dossierInsurerSrv.getLastDossierInsurer(p.dossierId);
            const nodeOriginalPeriod = nodeList.find((item) => item._id === dossierInsurer.networkNodeId);

            const currentPromoter = dossierInsurer.promoterId
              ? await promoterService.getPromoterById(dossierInsurer.promoterId)
              : '';


            if (!p.customer || (p.customer && p.customer.length < 0)) return;

            const cp = await customerService.getCustomerById(p.customerId);

            const promotersFullCurrent = [];

            if (nodeOriginalPeriod && nodeOriginalPeriod.displayPromoterNamesIds.length > 0) {
              // eslint-disable-next-line consistent-return
              await nodeOriginalPeriod.displayPromoterNamesIds.forEachAsync(async (i) => {
                if (!i) return promotersFullCurrent.push('');
                const promoter = await promoterService.getPromoterById(i);
                if (promoter) promotersFullCurrent.push(`${promoter.serialNumber} ${promoter.displayName}`);
              });
            }

            const promoterDisplayPromoterNamesWithSerialNumberCurrent = promotersFullCurrent.map((i) => i).join(' / ');

            const { startDate, endDate } = getMonthDateRange(
              p.effectProductivePeriodYear,
              p.effectProductivePeriodMonth,
            );

            let code = '';
            if (cp) {
              code = cp.physicalPerson ? cp.fiscalCode : cp.vat;
            }

            rows.push({
              dossierId: p.dossierId,
              practiceId: p.practiceId,
              contractId: p.contractId,
              productName: p.productName,
              companyName: p.companyName,
              insuredName: p.insuredName,
              lastModifiedDate: p.lastModifiedDate,
              createdDate: p.createdDate,
              effectDate: p.effectDate,
              effectProductivePeriodYear: p.effectProductivePeriodYear,
              effectProductivePeriodMonth: p.effectProductivePeriodMonth,
              statusName: p.statusName,
              emitDate: p.emitDate,
              premiumNet: p.premiumNet / 100,
              premiumGross: p.premiumGross / 100,
              optionId: p.optionId,
              installmentsPerYear: numberToRate(p.installmentsPerYear),
              commissionSacrifice: p.commissionSacrifice,
              iv: p.iv / 100,
              promoterDisplayName: p.promoterDisplayName,
              promoterDisplayHierarchy: p.promoterDisplayHierarchy,
              promoterRoleId: roleId,
              promoterDisplayPromoterNames: p.promoterDisplayPromoterNames,
              unique: p.unique,
              adequacy: p.adequacy,
              postForce: p.postForce,
              paymentMode: p.paymentMode ? p.paymentMode.value : '',
              uniquePremium: p.uniquePremium / 100,
              recurringPremium: p.recurringPremium / 100,
              loading: p.loading,
              amountPaid: '',
              years: p.years,
              currentPromoter: `${currentPromoter ? currentPromoter.serialNumber : ''} ${
                currentPromoter ? currentPromoter.displayName : ''
              }`,
              promoterDisplayPromoterNamesWithSerialNumberCurrent,
              tipoRecord: 'TES',
              tipoDocumento: '705',
              dataRegistrazione: moment().format('DDMMYYYY'),
              numeroRegistrazione: count,
              codiceFiscale: `${code}`,
              numeroDocumento: count,
              tipoRiga: '',
              importoValuta: '',
              codiceIva: '',
              descrizione: '',
              dataDocumento: '',
              dataScadenza: '',
              condizionePagamento: '300',
            });

            rows.push({
              dossierId: p.dossierId,
              practiceId: p.practiceId,
              contractId: p.contractId,
              productName: p.productName,
              companyName: p.companyName,
              insuredName: p.insuredName,
              lastModifiedDate: p.lastModifiedDate,
              createdDate: p.createdDate,
              effectDate: p.effectDate,
              effectProductivePeriodYear: p.effectProductivePeriodYear,
              effectProductivePeriodMonth: p.effectProductivePeriodMonth,
              statusName: p.statusName,
              emitDate: p.emitDate,
              premiumNet: p.premiumNet / 100,
              premiumGross: p.premiumGross / 100,
              optionId: p.optionId,
              installmentsPerYear: numberToRate(p.installmentsPerYear),
              commissionSacrifice: p.commissionSacrifice,
              iv: p.iv / 100,
              promoterDisplayName: p.promoterDisplayName,
              promoterDisplayHierarchy: p.promoterDisplayHierarchy,
              promoterRoleId: roleId,
              promoterDisplayPromoterNames: p.promoterDisplayPromoterNames,
              unique: p.unique,
              adequacy: p.adequacy,
              postForce: p.postForce,
              paymentMode: p.paymentMode ? p.paymentMode.value : '',
              uniquePremium: p.uniquePremium / 100,
              recurringPremium: p.recurringPremium / 100,
              loading: p.loading,
              amountPaid: p.amountPaid / 100,
              years: p.years,
              currentPromoter: `${currentPromoter ? currentPromoter.serialNumber : ''} ${
                currentPromoter ? currentPromoter.displayName : ''
              }`,
              promoterDisplayPromoterNamesWithSerialNumberCurrent,
              tipoRecord: 'RIG',
              tipoDocumento: '705',
              dataRegistrazione: moment().format('DDMMYYYY'),
              numeroRegistrazione: count,
              codiceFiscale: '',
              numeroDocumento: count,
              tipoRiga: '2',
              importoValuta: '',
              codiceIva: 'EA60',
              descrizione: `Prestazioni per consulenza a clienti (${p.practiceId})`,
              dataDocumento: `${moment(startDate).format('DDMMYYYY')}`,
              dataScadenza: `${moment(endDate).format('DDMMYYYY')}`,
              condizionePagamento: '',
            });
          });

          return {
            headers: [
              { field: 'tipoRecord', position: 0, translation: 'TIPO RECORD' },
              { field: 'tipoDocumento', position: 1, translation: 'TES: TIPO DOCUMENTO FATTURE DI VENDITA' },
              { field: 'dataRegistrazione', position: 2, translation: 'TES: DATA REGISTRAZIONE' },
              { field: 'numeroRegistrazione', position: 3, translation: 'TES: NUMERO REGISTRAZIONE (obbligatorio)' },
              { field: 'codiceFiscale', position: 4, translation: 'TES: CODICE FISCALE PARTITARIO' },
              { field: 'numeroDocumento', position: 5, translation: 'TES: NUMERO DOCUMENTO' },
              { field: 'tipoRiga', position: 6, translation: 'RIG: TIPO RIGA (obbligatorio)' },
              { field: 'amountPaid', position: 7, translation: 'RIG: IMPORTO IN VALUTA' },
              { field: 'codiceIva', position: 8, translation: 'RIG: CODICE IVA' },
              { field: 'descrizione', position: 9, translation: 'RIG: DESCRIZIONE 1' },
              { field: 'dataDocumento', position: 12, translation: 'RIG: PERIODO COMPETENZA DA' },
              { field: 'dataScadenza', position: 13, translation: 'RIG: PERIODO COMPETENZA A' },
              { field: 'condizionePagamento', position: 14, translation: 'TES: CODICE CONDIZIONE DI PAGAMENTO' },
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
              displayName: `Export fatture ${new Date().toString()}.csv`,
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
