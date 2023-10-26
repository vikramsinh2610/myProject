const Boom = require('boom');
const AdjustedPremiumService = require('../../services/adjusted-premium-srv');
const ProductConfigurationService = require("../../services/product-configuration-srv");
const installmentRepository = require('../../services/kpi-srv/installment-repository');
const PromoterService = require('../../services/promoter-srv');
const PromoterJobService = require('../../services/promoter-job-srv');
const PracticeService = require('../../services/practice-srv');
const LetterService = require('../../services/letter-srv');
const KpiService = require('../../services/kpi-srv');
const InvoicingFlowService = require('../../services/invoicing-flow-srv');
const InvoiceService = require('../../services/invoice-srv');
const DocumentService = require('../../services/document-srv');
const CompanyService = require('../../services/company-srv');
const CompanyAcquittanceService = require('../../services/company-acquittance-srv');
const CommissioningFlowService = require('../../services/commissioning-flow-srv');
const TcwCommissioningConfigurationService = require('../../services/tcw-commissioning-configuration-srv');
const ManagementFeeConfigurationService = require('../../services/management-fee-configuration-srv');
const ManagementFeeService = require('../../services/management-fee-srv');
const SignalerCommissionService = require('../../services/signaler-commission-srv');
const DossierInsurerService = require('../../services/dossier-insurer-srv');

module.exports = (fastify, opts, next) => {
  fastify.post('/', { schema: { hide: true } }, (request, reply) => {
    const sql = fastify.knex;
    const sqlReader = fastify.knex_reader;
    const { db } = fastify.mongo;
    const adjustedPremiumService = new AdjustedPremiumService(db);
    const productConfigurationService = new ProductConfigurationService(db);
    const promoterService = new PromoterService(db);
    const promoterJobService = new PromoterJobService(db);
    const practiceService = new PracticeService(db);
    const letterService = new LetterService(db, fastify.log, fastify.knex);
    const kpiService = new KpiService(fastify.mongo.db, fastify.knex);
    const invoicingFlowService = new InvoicingFlowService(db, fastify.edition, fastify.log, fastify.knex);
    const invoiceService = new InvoiceService(db);
    const documentService = new DocumentService(db, fastify.s3.buckets.documents);
    const companyService = new CompanyService(db);
    const companyAcquittanceService = new CompanyAcquittanceService(db, documentService, fastify.knex);
    const commissioningFlowService = new CommissioningFlowService(fastify.mongo.db, fastify.edition, sql, sqlReader);
    const tcwCommissioningConfigurationService = new TcwCommissioningConfigurationService(db);
    const managementFeeConfigurationService = new ManagementFeeConfigurationService(db);
    const managementFeeService = new ManagementFeeService(db);
    const signalerCommissionService = new SignalerCommissionService(db);
    const dossierInsurerService = new DossierInsurerService(db, sql);

    Promise.all([
      adjustedPremiumService.createIndexes(),
      installmentRepository.createIndexes(db),
      productConfigurationService.createIndexes(),
      promoterService.createIndexes(),
      promoterJobService.createIndexes(),
      practiceService.createIndexes(),
      letterService.createIndexes(),
      kpiService.createIndexes(),
      invoicingFlowService.createIndexes(),
      invoiceService.createIndexes(),
      documentService.createIndexes(),
      companyService.createIndexes(),
      companyAcquittanceService.createIndexes(),
      commissioningFlowService.createIndexes(),
      tcwCommissioningConfigurationService.createIndexes(),
      managementFeeConfigurationService.createIndexes(),
      managementFeeService.createIndexes(),
      signalerCommissionService.createIndexes(),
      dossierInsurerService.createIndexes(),
    ])
      .then(() => reply.code(201).send())
      .catch((error) => reply.send(Boom.badRequest(error)));
  });
  next();
};
