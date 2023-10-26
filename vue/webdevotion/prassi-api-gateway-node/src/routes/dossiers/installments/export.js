const Boom = require('boom');
const NetworkService = require("../../../services/network-srv");
const DocumentService = require('../../../services/document-srv');
const { excelReport } = require('../../../services/excel-report-srv');
const { types: documentTypes } = require("../../../services/document-srv/document-types");
const errorHandler = require("../../../utils/error-handler");
const { translateRoleId } = require('../../../services/promoter-job-srv/role-ids');
const { periodOrToday } = require('../../../utils/productive-period-helper');
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
          confirmed: {
            type: 'string',
            description: 'confirmed id',
          },
          paid: {
            type: 'string',
            description: 'paid id',
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

      const networkService = new NetworkService(fastify.mongo.db);
      const firstNode = await networkService.userCanSeeProductivePeriod(
        request.identity.roleId,
        request.identity._id,
        request.query.promoterId,
        productivePeriodYear,
        productivePeriodMonth,
      );
      if (!firstNode) return reply.send(Boom.badRequest('Utente non autorizzato'));

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
        .distinctOn('_id')
        .select(
          '*',
          'practice_commission.productivePeriodMonth as productivePeriodMonth',
          'practice_commission.productivePeriodYear as productivePeriodYear', 'commissionType as type',
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
          .andWhere('practice_commission.productivePeriodYear', productivePeriodYear)
          .andWhere('practice_commission.productivePeriodMonth', productivePeriodMonth);
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
        queryPractices.andWhere(
          'practice_commission.confirmed',
          request.query.confirmed === 'confirmed',
        );
      }

      if (request.query.paid) {
        queryPractices.andWhere(
          'practice_commission.paidToNetwork',
          request.query.paid === 'paid',
        );
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
              { field: 'promoterDisplayPromoterNames', position: 26, translation: 'Responsabili' },
              { field: 'lastModifiedDate', position: 27, translation: 'Data ultima modifica' },
              { field: 'emitDate', position: 28, translation: 'Data primo invio' },
              { field: 'postForce', position: 29, translation: 'Stato Post Vigore' },
              { field: 'adequacy', position: 30, translation: 'Stato Adeguatezza' },
              { field: 'optionId', position: 31, translation: 'Opzioni' },
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
              displayName: `Export dossiers ${new Date().toString()}.xlsx`,
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
