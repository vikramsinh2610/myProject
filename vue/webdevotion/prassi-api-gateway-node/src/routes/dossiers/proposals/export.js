const Boom = require('boom');
const moment = require('moment');
const KpiService = require('../../../services/kpi-srv');
const NetworkService = require("../../../services/network-srv");
const DocumentService = require('../../../services/document-srv');
const { excelReport } = require('../../../services/excel-report-srv');
const { types: documentTypes } = require("../../../services/document-srv/document-types");
const errorHandler = require("../../../utils/error-handler");
const { translateRoleId } = require('../../../services/promoter-job-srv/role-ids');
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
      const sql = fastify.knex;

      const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);
      const kpiService = new KpiService(fastify.mongo.db, sql);
      const { productivePeriodYear, productivePeriodMonth } = periodOrToday(
        request.query.toProductivePeriodYear,
        request.query.toProductivePeriodMonth,
      );
      const dossierInsurerSrv = new DossierInsurerSrv(fastify.mongo.db);
      const promoterService = new PromoterService(fastify.mongo.db);
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

      const promoterToQuery =
        request.identity._id === request.query.promoterId
          ? undefined
          : request.query.promoterId;

      return kpiService
        .listProposalsKpiByFilter(
          request.query.networkId || firstNode.model._id,
          promoterToQuery,
          request.query.contractSearch,
          request.query.commissionType ? JSON.parse(request.query.commissionType) : [],
          request.query.companyId,
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
          const ivTcw = fastify.edition === 'tcw' ? ' Rb' : 'IV';
          // @ts-ignore
          await practices.forEachAsync(async (p) => {
            let roleId = 'Nessuno';
            roleId = p.promoterRoleId ? await translateRoleId(fastify.mongo.db, p.promoterRoleId) : 'Nessuno';

            const dossierInsurer = await dossierInsurerSrv.getLastDossierInsurer(p.dossierId);
            const dossierInsurerFirst = await dossierInsurerSrv.getFirstDossierInsurer(p.dossierId);
            const nodeCurrentPeriod = nodeList.find((item) => item._id === dossierInsurer.networkNodeId);
            const nodeFirstPeriod = nodeList.find((item) => item._id === dossierInsurerFirst.networkNodeId);

            const currentPromoter = dossierInsurer.promoterId
                ? await promoterService.getPromoterById(dossierInsurer.promoterId)
                : '';

            const firstPromoter = dossierInsurerFirst.promoterId
              ? await promoterService.getPromoterById(dossierInsurerFirst.promoterId)
              : '';

            const promotersFullFirst = [];
            const promotersFullCurrent = [];

            if (nodeCurrentPeriod && nodeCurrentPeriod.displayPromoterNamesIds.length > 0) {
              // eslint-disable-next-line consistent-return
              await nodeCurrentPeriod.displayPromoterNamesIds.forEachAsync(async (i) => {
                if (!i) return promotersFullCurrent.push('');
                const promoter = await promoterService.getPromoterById(i);
                if (promoter) promotersFullCurrent.push(`${promoter.serialNumber} ${promoter.displayName}`);
              });
            }

            if (nodeFirstPeriod && nodeFirstPeriod.displayPromoterNamesIds.length > 0) {
              // eslint-disable-next-line consistent-return
              await nodeFirstPeriod.displayPromoterNamesIds.forEachAsync(async (i) => {
                if (!i) return promotersFullFirst.push('');
                const promoter = await promoterService.getPromoterById(i);
                if (promoter) promotersFullFirst.push(`${promoter.serialNumber} ${promoter.displayName}`);
              });
            }

            let gerarchiaDM = '';
            let gerarchiaBM = '';
            let gerarchiaTM = '';
            let gerarchiaTMJ = '';
            let gerarchiaPA = '';
            let gerarchiaPACOACH = '';
            let gerarchiaDMnum = '';
            let gerarchiaBMnum = '';
            let gerarchiaTMnum = '';
            let gerarchiaTMJnum = '';
            let gerarchiaPAnum = '';
            let gerarchiaPACOACHnum = '';
            if (nodeCurrentPeriod && nodeCurrentPeriod.displayPromoterNamesIds.length > 0) {
              await nodeCurrentPeriod.displayPromoterNamesIds.forEachAsync(async (el) => {
                if (el && el !== '') {
                  const promo = await promoterService.getPromoterById(el);
                  if (promo) {
                    // eslint-disable-next-line promise/no-nesting
                    const nodeNet = await sql
                      .select('*')
                      .from('network_node')
                      .where('promoterId', promo._id)
                      .andWhere('productivePeriodYear', productivePeriodYear)
                      .andWhere('productivePeriodMonth', productivePeriodMonth)
                      .then((results) => results);

                    if (nodeNet && nodeNet[0] && nodeNet[0].roleId) {
                      switch (nodeNet[0].roleId) {
                        case 'district-manager':
                          gerarchiaDM = `${promo.name} ${promo.surname}`;
                          gerarchiaDMnum = `${promo.serialNumber}`;
                          break;
                        case 'branch-manager-junior':
                        case 'branch-manager-autonomous':
                        case 'branch-manager':
                          gerarchiaBM = `${promo.name} ${promo.surname}`;
                          gerarchiaBMnum = `${promo.serialNumber}`;
                          break;
                        case 'senior-promoter':
                        case 'team-manager':
                          gerarchiaTM = `${promo.name} ${promo.surname}`;
                          gerarchiaTMnum = `${promo.serialNumber}`;
                          break;
                        case 'team-manager-junior':
                          gerarchiaTMJ = `${promo.name} ${promo.surname}`;
                          gerarchiaTMJnum = `${promo.serialNumber}`;
                          break;
                        case 'pa-coach':
                          gerarchiaPACOACH = `${promo.name} ${promo.surname}`;
                          gerarchiaPACOACHnum = `${promo.serialNumber}`;
                          break;
                        default:
                          gerarchiaPA = `${promo.name} ${promo.surname}`;
                          gerarchiaPAnum = `${promo.serialNumber}`;
                      }
                    }
                  }
                }
              });
            }

            let gerarchiaDMFirst = '';
            let gerarchiaBMFirst = '';
            let gerarchiaTMFirst = '';
            let gerarchiaTMJFirst = '';
            let gerarchiaPAFirst = '';
            let gerarchiaPACOACHFirst = '';
            let gerarchiaDMnumFirst = '';
            let gerarchiaBMnumFirst = '';
            let gerarchiaTMnumFirst = '';
            let gerarchiaTMJnumFirst = '';
            let gerarchiaPAnumFirst = '';
            let gerarchiaPACOACHnumFirst = '';
            if (nodeFirstPeriod && nodeFirstPeriod.displayPromoterNamesIds.length > 0) {
              await nodeFirstPeriod.displayPromoterNamesIds.forEachAsync(async (el) => {
                if (el && el !== '') {
                  const promo = await promoterService.getPromoterById(el);
                  if (promo) {
                    // eslint-disable-next-line promise/no-nesting
                    const nodeNet = await sql
                      .select('*')
                      .from('network_node')
                      .where('promoterId', promo._id)
                      .andWhere('productivePeriodYear', productivePeriodYear)
                      .andWhere('productivePeriodMonth', productivePeriodMonth)
                      .then((results) => results);

                    if (nodeNet && nodeNet[0] && nodeNet[0].roleId) {
                      switch (nodeNet[0].roleId) {
                        case 'district-manager':
                          gerarchiaDMFirst = `${promo.name} ${promo.surname}`;
                          gerarchiaDMnumFirst = `${promo.serialNumber}`;
                          break;
                        case 'branch-manager-junior':
                        case 'branch-manager-autonomous':
                        case 'branch-manager':
                          gerarchiaBMFirst = `${promo.name} ${promo.surname}`;
                          gerarchiaBMnumFirst = `${promo.serialNumber}`;
                          break;
                        case 'senior-promoter':
                        case 'team-manager':
                          gerarchiaTMFirst = `${promo.name} ${promo.surname}`;
                          gerarchiaTMnumFirst = `${promo.serialNumber}`;
                          break;
                        case 'team-manager-junior':
                          gerarchiaTMJFirst = `${promo.name} ${promo.surname}`;
                          gerarchiaTMJnumFirst = `${promo.serialNumber}`;
                          break;
                        case 'pa-coach':
                          gerarchiaPACOACHFirst = `${promo.name} ${promo.surname}`;
                          gerarchiaPACOACHnumFirst = `${promo.serialNumber}`;
                          break;
                        default:
                          gerarchiaPAFirst = `${promo.name} ${promo.surname}`;
                          gerarchiaPAnumFirst = `${promo.serialNumber}`;
                      }
                    }
                  }
                }
              });
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
              unique: p.unique,
              adequacy: p.adequacy,
              postForce: p.postForce,
              paymentMode: p.paymentMode ? p.paymentMode.value : '',
              uniquePremium: p.practiceId.slice(0, 3) === 'EST' ? p.uniquePremium / 1000000 : p.uniquePremium / 100,
              recurringPremium: p.recurringPremium / 100,
              loading: p.loading,
              amountPaid: p.amountPaid / 100,
              years: p.years,
              firstPromoter: firstPromoter ? firstPromoter.displayName : '',
              firstSerialNumber: firstPromoter ? firstPromoter.serialNumber: '',
              gerarchiaDMFirst,
              gerarchiaBMFirst,
              gerarchiaTMFirst,
              gerarchiaTMJFirst,
              gerarchiaPAFirst,
              gerarchiaPACOACHFirst,
              gerarchiaDMnumFirst,
              gerarchiaBMnumFirst,
              gerarchiaTMnumFirst,
              gerarchiaTMJnumFirst,
              gerarchiaPAnumFirst,
              gerarchiaPACOACHnumFirst,
              currentPromoter: currentPromoter ? currentPromoter.displayName : '',
              currentSerialNumber: currentPromoter ? currentPromoter.serialNumber : '',
              gerarchiaDM,
              gerarchiaBM,
              gerarchiaTM,
              gerarchiaTMJ,
              gerarchiaPA,
              gerarchiaPACOACH,
              gerarchiaDMnum,
              gerarchiaBMnum,
              gerarchiaTMnum,
              gerarchiaTMJnum,
              gerarchiaPAnum,
              gerarchiaPACOACHnum,
            });
          });

          return {
            headers: [
              { field: 'dossierId', position: 0, translation: 'Numero Proposta' },
              { field: 'practiceId', position: 1, translation: 'Numero Pratica' },
              { field: 'contractId', position: 2, translation: 'Numero Contratto' },
              { field: 'productName', position: 4, translation: 'Nome Prodotto' },
              { field: 'companyName', position: 5, translation: 'Azienda' },
              { field: 'insuredName', position: 6, translation: 'Contraente' },
              { field: 'effectDate', position: 7, translation: 'Data decorrenza' },
              { field: 'effectProductivePeriodYear', position: 8, translation: 'Anno Produttivo' },
              { field: 'effectProductivePeriodMonth', position: 9, translation: 'Mese Produttivo' },
              { field: 'statusName', position: 10, translation: 'Stato Pratica' },
              { field: 'createdDate', position: 11, translation: 'Data di creazione' },
              { field: 'premiumNet', position: 12, translation: 'Premio netto' },
              { field: 'premiumGross', position: 13, translation: 'Premio lordo' },
              { field: 'uniquePremium', position: 14, translation: 'Premio Unico' },
              { field: 'recurringPremium', position: 15, translation: 'Premio Ricorrente' },
              { field: 'amountPaid', position: 16, translation: 'Importo Versato' },
              { field: 'years', position: 17, translation: 'Durata del contratto' },
              { field: 'paymentMode', position: 18, translation: 'Modalità di Pagamento' },
              { field: 'loading', position: 19, translation: 'Caricamento' },
              { field: 'installmentsPerYear', position: 20, translation: 'Frazionamento' },
              { field: 'commissionSacrifice', position: 21, translation: 'Sacrificio' },
              { field: 'iv', position: 22, translation: `${ivTcw}` },
              { field: 'promoterDisplayName', position: 23, translation: 'Promotore' },
              { field: 'promoterRoleId', position: 24, translation: 'Ruolo' },
              { field: 'promoterDisplayHierarchy', position: 25, translation: 'Rete' },
              { field: 'lastModifiedDate', position: 27, translation: 'Data ultima modifica' },
              { field: 'emitDate', position: 28, translation: 'Data primo invio' },
              { field: 'postForce', position: 29, translation: 'Stato Post Vigore' },
              { field: 'adequacy', position: 30, translation: 'Stato Adeguatezza' },
              { field: 'optionId', position: 31, translation: 'Opzioni' },
              { field: 'firstSerialNumber', position: 38, translation: 'Matricola Originale' },
              { field: 'firstPromoter', position: 38, translation: 'Promotore Originale' },
              { field: 'gerarchiaDMnumFirst', position: 39, translation: 'DM Matricola Originale' },
              { field: 'gerarchiaDMFirst', position: 39, translation: 'DM Originale' },
              { field: 'gerarchiaBMnumFirst', position: 39, translation: 'BM Matricola Originale' },
              { field: 'gerarchiaBMFirst', position: 39, translation: 'BM Attuale' },
              { field: 'gerarchiaTMnumFirst', position: 39, translation: 'TM Matricola Originale' },
              { field: 'gerarchiaTMFirst', position: 39, translation: 'TM Originale' },
              ...(fastify.edition === 'tcw'
                ? [{ field: 'gerarchiaTMJnumFirst', position: 39, translation: 'TMJ Matricola Originale' }]
                : []),
              ...(fastify.edition === 'tcw'
                ? [{ field: 'gerarchiaTMJFirst', position: 39, translation: 'TMJ Originale' }]
                : []),
              ...(fastify.edition === 'sheltia'
                ? [{ field: 'gerarchiaPACOACHnumFirst', position: 39, translation: 'PA-COACH Matricola Originale' }]
                : []),
              ...(fastify.edition === 'sheltia'
                ? [{ field: 'gerarchiaPACOACHFirst', position: 39, translation: 'PA-COACH Originale' }]
                : []),
              { field: 'gerarchiaPAnumFirst', position: 39, translation: 'PA Matricola Originale' },
              { field: 'gerarchiaPAFirst', position: 39, translation: 'PA Originale' },
              { field: 'currentSerialNumber', position: 39, translation: 'Matricola Attuale' },
              { field: 'currentPromoter', position: 39, translation: 'Promotore Attuale' },
              { field: 'gerarchiaDMnum', position: 39, translation: 'DM Matricola Attuale' },
              { field: 'gerarchiaDM', position: 39, translation: 'DM Attuale' },
              { field: 'gerarchiaBMnum', position: 39, translation: 'BM Matricola Attuale' },
              { field: 'gerarchiaBM', position: 39, translation: 'BM Attuale' },
              { field: 'gerarchiaTMnum', position: 39, translation: 'TM Matricola Attuale' },
              { field: 'gerarchiaTM', position: 39, translation: 'TM Attuale' },
              ...(fastify.edition === 'tcw'
                ? [{ field: 'gerarchiaTMJnum', position: 39, translation: 'TMJ Matricola Attuale' }]
                : []),
              ...(fastify.edition === 'tcw'
                ? [{ field: 'gerarchiaTMJ', position: 39, translation: 'TMJ Attuale' }]
                : []),
              ...(fastify.edition === 'sheltia'
                ? [{ field: 'gerarchiaPACOACHnum', position: 39, translation: 'PA-COACH Matricola Attuale' }]
                : []),
              ...(fastify.edition === 'sheltia'
                ? [{ field: 'gerarchiaPACOACH', position: 39, translation: 'PA-COACH Attuale' }]
                : []),
              { field: 'gerarchiaPAnum', position: 39, translation: 'PA Matricola Attuale' },
              { field: 'gerarchiaPA', position: 39, translation: 'PA Attuale' },
            ],
            data: rows,
          };
        })
        .then((data) => Promise.resolve(excelReport(data)))
        .then((buffer) =>
          documentService.addDocument(
            {
              type: documentTypes.DOSSIERS,
              ownerId: 'SYSTEM',
              displayName: `Export_proposte_${moment(new Date())
                  .utcOffset('+0200')
                  .format('DD_MM_YYYY')
                  .toString()}.xlsx`,
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
