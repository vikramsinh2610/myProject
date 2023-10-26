const Boom = require('boom');
const moment = require('moment');
const NetworkService = require("../../../services/network-srv");
const DocumentService = require('../../../services/document-srv');
const { excelReport } = require('../../../services/excel-report-srv');
const { types: documentTypes } = require("../../../services/document-srv/document-types");
const errorHandler = require("../../../utils/error-handler");
const { translateRoleId } = require('../../../services/promoter-job-srv/role-ids');
const { periodOrToday, parse} = require('../../../utils/productive-period-helper');
const PromoterService = require('../../../services/promoter-srv');
const DossierInsurerSrv = require('../../../services/dossier-insurer-srv');
require('../../../utils/foreach');

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
            type: 'integer',
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
          option: {
            type: 'integer',
            default: 2,
            description: 'Number of overdue installments',
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
      const { productivePeriodYear, productivePeriodMonth } = periodOrToday(
        request.query.toProductivePeriodYear,
        request.query.toProductivePeriodMonth,
      );
      const productivePeriod = parse(productivePeriodYear, productivePeriodMonth);

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

      const networkIds = await networkService.getNetworkListIdByPromoterAndPeriod(
        request.query.networkId || firstNode.model._id,
        promoterToQuery,
        request.query.type === 'indirect',
        productivePeriodYear,
        productivePeriodMonth,
      );

      const queryPractices = sql
        .from('practice_commission')
        .select(
          'practice_commission.dossierId',
          'practice_commission.contractId',
          'practice_commission.practiceId',
          'practice_commission.productName',
          'practice_commission.companyName',
          'practice_commission.installmentsPerYear',
          // eslint-disable-next-line max-len
          sql.raw('sum(CASE WHEN installment = 1 THEN practice_commission."premiumGross" ELSE 0 END) as "premiumGross"'),
          sql.raw('count(*) as installments'),
          sql.raw('SUM(CASE WHEN NOT confirmed THEN 1 ELSE 0 END) as "overdueInstallments"'),
          sql.raw('SUM(CASE WHEN NOT confirmed THEN iv ELSE 0 END) as iv'),
          // eslint-disable-next-line max-len
          sql.raw('SUM(CASE WHEN NOT confirmed THEN practice_commission."premiumGross" / practice_commission."installmentsPerYear" ELSE 0 END) as amount'),
        )
        // eslint-disable-next-line func-names
        .join('practice_owner AS po', function () {
          // @ts-ignore
          // eslint-disable-next-line max-len
          this.on('po.uuid', '=', sql.raw('(select uuid from practice_owner where practice_owner."dossierId" = "practice_commission"."dossierId" order by "productivePeriodYear" desc, "productivePeriodMonth" desc limit 1)'));
        })
        .join('person', 'person.uuid', 'practice_commission.customerId')
        // eslint-disable-next-line func-names,sonarjs/no-identical-functions
        .join('network_node AS nn', function () {
          // @ts-ignore
          this.on('nn.uuid', '=', 'po.networkNodeId')
            .andOn('nn.productivePeriodMonth', '=', productivePeriodMonth)
            .andOn('nn.productivePeriodYear', '=', productivePeriodYear);
        })
        .whereIn('po.networkNodeId', networkIds);

      if (!request.query.fullSearch) {
        queryPractices
          .andWhere('practice_commission.productivePeriod', '<=', productivePeriod);
      }

      if (request.query.type === 'direct') {
        if (promoterToQuery) {
          queryPractices.andWhere('po.ownerId', promoterToQuery);
        } else {
          queryPractices.andWhere('po.networkNodeId', request.query.networkId || firstNode.model._id);
        }
      }

      if (request.query.type === 'inherited') {
        queryPractices.andWhere('nn.inherited', true);
      }

      if (request.query.companyId) {
        queryPractices.andWhere('practice_commission.companyId', request.query.companyId);
      }

      if (request.query.productId) {
        queryPractices.andWhere('practice_commission.productId', request.query.productId);
      }

      if (request.query.confirmed) {
        queryPractices.andWhere('practice_commission.confirmed', request.query.confirmed === 'confirmed');
      }

      if (request.query.paid) {
        queryPractices.andWhere('practice_commission.paidToNetwork', request.query.paid === 'paid');
      }

      if (request.query.commissionType) {
        queryPractices.andWhere(
          'practice_commission.practiceType',
          request.query.commissionType === '2' ? 'additional-income' : 'subscription',
        );
      }

      if (request.query.searchCustomer) {
        // eslint-disable-next-line func-names
        queryPractices.andWhere(function () {
          // @ts-ignore
          this.where('person.name', 'ILIKE', `%${request.query.searchCustomer}%`)
            .orWhere('person.surname', 'ILIKE', `%${request.query.searchCustomer}%`)
            .orWhere('person.companyName', 'ILIKE', `%${request.query.searchCustomer}%`);
        });
      }

      if (request.query.contractSearch) {
        // eslint-disable-next-line func-names
        queryPractices.andWhere(function () {
          // @ts-ignore
          this.where('practice_commission.dossierId', 'ILIKE', `%${request.query.contractSearch}%`)
            .orWhere('practice_commission.contractId', 'ILIKE', `%${request.query.contractSearch}%`)
            .orWhere('practice_commission.practiceId', 'ILIKE', `%${request.query.contractSearch}%`);
        });
      }

      queryPractices.groupBy(
        'practice_commission.dossierId',
        'practice_commission.contractId',
        'practice_commission.practiceId',
        'practice_commission.productName',
        'practice_commission.companyName',
        'practice_commission.installmentsPerYear',
      ).havingRaw('SUM(CASE WHEN NOT confirmed THEN 1 ELSE 0 END) >= ?', [request.query.option]);
     return queryPractices
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
              { field: 'gerarchiaDMnum', position: 39, translation: 'DM Matricola Originale' },
              { field: 'gerarchiaDM', position: 39, translation: 'DM Originale' },
              { field: 'gerarchiaBMnum', position: 39, translation: 'BM Matricola Originale' },
              { field: 'gerarchiaBM', position: 39, translation: 'BM Attuale' },
              { field: 'gerarchiaTMnum', position: 39, translation: 'TM Matricola Originale' },
              { field: 'gerarchiaTM', position: 39, translation: 'TM Originale' },
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
              displayName: `Export_arretrati_${moment(new Date())
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
