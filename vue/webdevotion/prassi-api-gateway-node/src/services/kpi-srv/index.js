const Mongo = require('mongodb');
const Knex = require('knex');
const moment = require('moment');
const S3 = require('aws-sdk/clients/s3');
const DocumentService = require('../document-srv');
const PracticeService = require('../practice-srv');
const PracticeCommissionService = require('../practice-commission-srv');
const PromoterService = require('../promoter-srv');
const NetworkService = require('../network-srv');
const DossierInsurerSrv = require('../dossier-insurer-srv');
const CustomerService = require('../customer-srv');
const AdjustedPremiumService = require('../adjusted-premium-srv');
const ProductConfigurationService = require('../product-configuration-srv');
const KPI = require('../letter-srv/bonus/kpi');
const installmentRepository = require('./installment-repository');
const { toQuarter } = require('../../utils/productive-period-helper');
const kpis = require('./kpi-functions');
const { parse, unparse, toDate, toDateEnd } = require('../../utils/productive-period-helper');
const { seed } = require('./seed/kpi');
const dossierInsurerRepository = require('../dossier-insurer-srv/dossier-insurer-repository');
const { uuidToBinary } = require('../../utils/uuid-to-binary');
const roleIds = require('../promoter-job-srv/role-ids');
const { types: practiceTypes } = require('../practice-srv/practice-types');
const DocumentObject = require('../document-srv/document');
const { excelReport } = require('../excel-report-srv');
const { types: documentTypes } = require('../document-srv/document-types');
const { translateRoleId } = require('../promoter-job-srv/role-ids');
require('../../utils/foreach');

function getTypeFilter(type) {
  switch (type) {
    case 'contact':
      return { 'Tipo.key': 1 };
    case 'customer':
      return { 'Tipo.key': 2 };
    case 'all':
    default:
      return {};
  }
}

function getStatusFilter(status) {
  switch (status) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      return { 'Status.key': status };
    default:
      return {};
  }
}

class KpiService {
  /**
   * @param {Mongo.Db} mongodb
   * @param {Knex} sql
   */
  constructor(mongodb, sql) {
    this.mongodb = mongodb;
    this.sql = sql;
    this.networkService = new NetworkService(this.mongodb);
    this.practiceService = new PracticeService(this.mongodb);
    this.practiceCommissionService = new PracticeCommissionService(this.mongodb, sql);
    this.promoterService = new PromoterService(this.mongodb);
    this.customerService = new CustomerService(this.mongodb);
    this.dossierInsurerSrv = new DossierInsurerSrv(this.mongodb);

    const s3Client = new S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || '',
    });
    this.documentService = new DocumentService(mongodb, process.env.AWS_S3_BUCKET_NAME_DOCUMENTS || '', s3Client);
  }

  /**
   * @param {string} promoterId
   * @param {object} productivePeriodRange
   * @returns {Promise<number>}
   */
  async iv(promoterId, productivePeriodRange) {
    const practiceService = new PracticeService(this.mongodb);
    const practices = await practiceService.getByPromoterIdAndProductiveRange(promoterId, productivePeriodRange);

    return kpis.iv(practices);
  }

  /**
   * @param {string} promoterId
   * @param {object} productivePeriodRange
   * @param {object} options
   * @returns {Promise<number>}
   */
  async product(promoterId, productivePeriodRange, options = {}) {
    const practiceService = new PracticeService(this.mongodb);
    const practices = await practiceService.getByPromoterIdAndProductiveRange(promoterId, productivePeriodRange);
    if (options.productId) {
      return practices.filter((p) => p.productId === options.productId).length * 100;
    }
    return practices.length * 100;
  }

  /**
   * @param {string} promoterId
   * @param {object} productivePeriodRange
   * @param {object} options
   * @returns {Promise<number>}
   */
  async monthlyProduct(promoterId, productivePeriodRange, options = {}) {
    const practiceService = new PracticeService(this.mongodb);
    const practices = await practiceService.getByPromoterIdAndProductivePeriod(promoterId, productivePeriodRange);
    if (options.productId) {
      return practices.filter((p) => p.productId === options.productId).length * 100;
    }
    return practices.length * 100;
  }

  /**
   * @param {string} promoterId
   * @param {object} productivePeriodRange
   * @param {object} options
   * @param {string} group
   * @returns {Promise<number>}
   */
  async adjustedPremium(promoterId, productivePeriodRange, options = {}, group) {
    const practiceService = new PracticeService(this.mongodb);
    let practices = await practiceService.getByPromoterIdAndProductiveRange(promoterId, productivePeriodRange, group);
    if (options.productId) {
      practices = practices.filter((p) => p.productId === options.productId);
    }

    const adjustedPremiumService = new AdjustedPremiumService(this.mongodb);
    const adjustment = await adjustedPremiumService.getById(
      toQuarter(productivePeriodRange.currentProductivePeriodYear, productivePeriodRange.currentProductivePeriodMonth),
    );

    const productConfigurationService = new ProductConfigurationService(this.mongodb);
    const products = await productConfigurationService.getAll();

    return kpis.adjustedPremium(practices, adjustment, products);
  }

  /**
   * @param {string} promoterId
   * @param {object} productivePeriodRange
   * @param {object} options
   * @param {string} group
   * @returns {Promise<number>}
   */
  async monthlyAdjustedPremium(promoterId, productivePeriodRange, options = {}, group) {
    const practiceService = new PracticeService(this.mongodb);
    let practices = await practiceService.getByPromoterIdAndProductivePeriod(promoterId, productivePeriodRange, group);
    if (options.productId) {
      practices = practices.filter((p) => p.productId === options.productId);
    }

    const adjustedPremiumService = new AdjustedPremiumService(this.mongodb);
    const adjustment = await adjustedPremiumService.getById(
      toQuarter(productivePeriodRange.currentProductivePeriodYear, productivePeriodRange.currentProductivePeriodMonth),
    );

    const productConfigurationService = new ProductConfigurationService(this.mongodb);
    const products = await productConfigurationService.getAll();

    return kpis.adjustedPremium(practices, adjustment, products);
  }

  /**
   * @param {string} promoterId
   * @param {object} productivePeriodRange
   * @returns {Promise<number>}
   */
  async promotersNumber(promoterId, productivePeriodRange) {
    const networkService = new NetworkService(this.mongodb);
    const { productivePeriodYear, productivePeriodMonth } = unparse(
      Math.min(
        parse(productivePeriodRange.toProductivePeriodYear, productivePeriodRange.toProductivePeriodMonth),
        parse(productivePeriodRange.currentProductivePeriodYear, productivePeriodRange.currentProductivePeriodMonth),
      ),
    );
    const tree = await networkService.getNetworkAsTree(productivePeriodYear, productivePeriodMonth);

    return kpis.promotersNumber(promoterId, tree);
  }

  /**
   * @param {string} promoterId
   * @param {object} productivePeriodRange
   * @returns {Promise<number>}
   */
  async correntizzazione(promoterId, productivePeriodRange) {
    const firstNode = await this.networkService.getFirstNode();

    const practices = await this.listProductionKpiByFilter(
      // @ts-ignore
      firstNode.model._id,
      promoterId,
      '',
      // @ts-ignore
      null,
      '',
      '',
      '',
      true,
      false,
      // @ts-ignore
      '',
      '',
      productivePeriodRange,
      0,
      0,
    );

    const cleanIds = practices.map((el) => el._id);

    const installments = await installmentRepository.getByIdsAndProductiveRange(
      this.mongodb,
      cleanIds,
      productivePeriodRange,
    );

    return kpis.correntizzazione(installments);
  }

  /**
   * @param {KPI} kpi
   * @param {string} promoterId
   * @param {object} productivePeriodRange
   * @param {object} productivePeriodRange.fromProductivePeriodMonth
   * @param {object} productivePeriodRange.fromProductivePeriodYear
   * @param {object} productivePeriodRange.toProductivePeriodYear
   * @param {object} productivePeriodRange.toProductivePeriodMonth
   * @param {object} productivePeriodRange.currentProductivePeriodYear
   * @param {object} productivePeriodRange.currentProductivePeriodMonth
   * @returns {Promise<number>}
   */
  calculateKpi(
    kpi,
    promoterId,
    {
      fromProductivePeriodYear,
      fromProductivePeriodMonth,
      toProductivePeriodYear,
      toProductivePeriodMonth,
      currentProductivePeriodYear,
      currentProductivePeriodMonth,
    },
  ) {
    const productivePeriodRange = {
      fromProductivePeriodYear,
      fromProductivePeriodMonth,
      toProductivePeriodYear,
      toProductivePeriodMonth,
      currentProductivePeriodYear,
      currentProductivePeriodMonth,
    };

    switch (kpi._id) {
      case 'IV':
        return this.iv(promoterId, productivePeriodRange);
      case 'PRODUCT':
        return this.product(promoterId, productivePeriodRange, kpi.options);
      case 'MONTHLY-PRODUCT':
        return this.monthlyProduct(promoterId, productivePeriodRange, kpi.options);
      case 'ADJUSTED-PREMIUM':
      case 'PRODUCTION-ADJUSTED-PREMIUM':
        return this.adjustedPremium(promoterId, productivePeriodRange, kpi.options, 'all');
      case 'ADJUSTED-PREMIUM-DIRECT':
        return this.adjustedPremium(promoterId, productivePeriodRange, kpi.options, 'direct');
      case 'ADJUSTED-PREMIUM-INDIRECT':
        return this.adjustedPremium(promoterId, productivePeriodRange, kpi.options, 'indirect');
      case 'MONTHLY-ADJUSTED-PREMIUM':
      case 'MONTHLY-PRODUCTION-ADJUSTED-PREMIUM':
        return this.monthlyAdjustedPremium(promoterId, productivePeriodRange, kpi.options, 'all');
      case 'MONTHLY-ADJUSTED-PREMIUM-DIRECT':
        return this.monthlyAdjustedPremium(promoterId, productivePeriodRange, kpi.options, 'direct');
      case 'MONTHLY-ADJUSTED-PREMIUM-INDIRECT':
        return this.monthlyAdjustedPremium(promoterId, productivePeriodRange, kpi.options, 'indirect');
      case 'PROMOTERS-NUMBER':
        return this.promotersNumber(promoterId, productivePeriodRange);
      case 'CORRENTIZZAZIONE':
        return this.correntizzazione(promoterId, productivePeriodRange);
      default:
        return Promise.resolve(0);
    }
  }

  /**
   * @param {string} promoterId
   * @param {object} productivePeriodRange
   * @param {boolean} direct
   * @returns {Promise<object>}
   */
  async preparePromoterFilterIds(promoterId, productivePeriodRange, direct) {
    let promoterIds = [];

    if (!direct) {
      for (
        let i = productivePeriodRange.fromProductivePeriodMonth;
        i <= productivePeriodRange.toProductivePeriodMonth;
        i += 1
      ) {
        // eslint-disable-next-line no-await-in-loop
        const nextPromoterIds = await this.networkService.getPromoterListIdByPromoterAndPeriod(
          promoterId,
          productivePeriodRange.fromProductivePeriodYear,
          i,
        );

        promoterIds = [...new Set([...promoterIds, ...nextPromoterIds])];
      }
    } else {
      promoterIds = [promoterId];
    }

    return {
      productivePeriodYear: productivePeriodRange.fromProductivePeriodYear,
      $and: [
        { productivePeriodMonth: { $gte: productivePeriodRange.fromProductivePeriodMonth } },
        { productivePeriodMonth: { $lte: productivePeriodRange.toProductivePeriodMonth } },
      ],
      promoterId: { $in: [...promoterIds] },
    };
  }

  /**
   * @param {string} networkId
   * @param {string} promoterId
   * @param {object} productivePeriodRange
   * @param {string} type
   * @returns {Promise<object>}
   */
  async prepareNetworkFilterIds(networkId, promoterId, productivePeriodRange, type) {
    let dossierAndPromoterIds = [];
    const promoterFilterAnd = [];

    if (type !== 'direct') {
      for (
        let i = productivePeriodRange.fromProductivePeriodMonth;
        i <= productivePeriodRange.toProductivePeriodMonth;
        i += 1
      ) {
        // eslint-disable-next-line no-await-in-loop
        const nextNetworkIds = await this.networkService.getNetworkListIdByPromoterAndPeriod(
          networkId,
          promoterId,
          type === 'indirect',
          productivePeriodRange.fromProductivePeriodYear,
          i,
        );

        promoterFilterAnd.push({
          $and: [{ productivePeriodMonth: i }, { networkNodeId: { $in: [...nextNetworkIds] } }],
        });
      }
      // eslint-disable-next-line no-await-in-loop
      dossierAndPromoterIds = await dossierInsurerRepository.getIdsAndPromoterByPromoterFilter(this.mongodb, {
        productivePeriodYear: productivePeriodRange.fromProductivePeriodYear,
        $or: promoterFilterAnd,
      });
    } else {
      let filterDossiers = {
        productivePeriodYear: productivePeriodRange.fromProductivePeriodYear,
        $and: [
          { productivePeriodMonth: { $gte: productivePeriodRange.fromProductivePeriodMonth } },
          { productivePeriodMonth: { $lte: productivePeriodRange.toProductivePeriodMonth } },
        ],
      };

      filterDossiers = promoterId ? { ...filterDossiers, promoterId } : { ...filterDossiers, networkNodeId: networkId };
      // eslint-disable-next-line no-await-in-loop
      dossierAndPromoterIds = await dossierInsurerRepository.getIdsAndPromoterByPromoterFilter(
        this.mongodb,
        filterDossiers,
      );
    }
    return dossierAndPromoterIds;
  }

  /**
   * @param {string | null} contractSearch
   * @param {object} filterDossiers
   * @returns {Promise<object>}
   */
  async addSearchContractfilter(contractSearch, filterDossiers) {
    if (contractSearch) {
      const dossierSearchList = await this.practiceService.searchByContract(contractSearch);
      const dossierSearchListFilter = new Set(dossierSearchList.map((el) => el.dossierId));

      if (dossierSearchList.length > 0) {
        return {
          ...filterDossiers,
          $or: [
            {
              dossierId: { $regex: contractSearch, $options: 'i' },
            },
            {
              dossierId: { $in: [...dossierSearchListFilter] },
            },
          ],
        };
      }

      return {
        ...filterDossiers,
        dossierId: { $regex: contractSearch, $options: 'i' },
      };
    }

    return filterDossiers;
  }

  /**
   * @param {string} networkId
   * @param {string} promoterId
   * @param {string} type
   * @param {string | null} contractSearch
   * @returns {Promise<object>}
   */
  async prepareNetworkFilterIdsAllPeriods(networkId, promoterId, type, contractSearch = null) {
    let dossierAndPromoterIds = [];

    if (type !== 'direct') {
      const nextNetworkIds = await this.networkService.getLastNetworkListIdByPromoter(
        networkId,
        promoterId,
        type === 'indirect',
      );

      let filterDossiers = {
        networkNodeId: { $in: [...nextNetworkIds] },
      };

      filterDossiers = await this.addSearchContractfilter(contractSearch, filterDossiers);

      dossierAndPromoterIds = await dossierInsurerRepository.getIdsAndPromoterByPromoterFilter(
        this.mongodb,
        filterDossiers,
      );
    } else {
      let filterDossiers = {};

      filterDossiers = promoterId ? { ...filterDossiers, promoterId } : { ...filterDossiers, networkNodeId: networkId };

      filterDossiers = await this.addSearchContractfilter(contractSearch, filterDossiers);

      // eslint-disable-next-line no-await-in-loop
      dossierAndPromoterIds = await dossierInsurerRepository.getIdsAndPromoterByPromoterFilter(
        this.mongodb,
        filterDossiers,
      );
    }

    return dossierAndPromoterIds;
  }

  /**
   * @param {Array} dossierAndPromoterIds
   * @param {string} contractSearch
   * @param {Array} commissionType
   * @param {string} companyId
   * @param {string} productId
   * @param {string} searchCustomer
   * @param {Array} status
   * @param {object} productivePeriodRange
   * @param {boolean} fullSearch
   * @param {boolean} solarSearch
   * @returns {object}
   */
  static buildDossierSearchFilter(
    dossierAndPromoterIds,
    contractSearch,
    commissionType,
    companyId,
    productId,
    searchCustomer,
    status,
    productivePeriodRange,
    fullSearch = false,
    solarSearch = false,
  ) {
    const dossierIds = new Set(dossierAndPromoterIds.map((el) => el.dossierId));
    let filter = {
      'DatiBase.NumeroProposta': { $in: [...dossierIds] },
    };

    if (!fullSearch && !solarSearch)
      filter = {
        ...filter,
        'StatoCorrente.PeriodoProduttivo.Anno': productivePeriodRange.fromProductivePeriodYear,
        $and: [
          { 'StatoCorrente.PeriodoProduttivo.Mese': { $gte: productivePeriodRange.fromProductivePeriodMonth } },
          { 'StatoCorrente.PeriodoProduttivo.Mese': { $lte: productivePeriodRange.toProductivePeriodMonth } },
        ],
      };

    if (solarSearch) {
      const dataStart = toDate(
        parse(productivePeriodRange.fromProductivePeriodYear, productivePeriodRange.fromProductivePeriodMonth),
      );
      const dataEnd = toDateEnd(
        parse(productivePeriodRange.toProductivePeriodYear, productivePeriodRange.toProductivePeriodMonth),
      );
      filter = {
        ...filter,
        $and: [
          { 'DatePratica.DataPrimoInvio': { $ne: null } },
          { 'DatePratica.DataPrimoInvio': { $gte: dataStart } },
          { 'DatePratica.DataPrimoInvio': { $lte: dataEnd } },
        ],
      };
    }

    if (contractSearch)
      filter = {
        ...filter,
        $or: [
          { 'DatiBase.NumeroContratto': { $regex: contractSearch, $options: 'i' } },
          { 'DatiBase.NumeroProposta': { $regex: contractSearch, $options: 'i' } },
          { 'DatiBase.NumeroPratica': { $regex: contractSearch, $options: 'i' } },
        ],
      };
    if (commissionType.length > 0) filter = { ...filter, 'TipoPratica.key': { $in: [...commissionType] } };
    if (companyId) filter = { ...filter, 'DatiProdotto.CompagniaIdentifier': uuidToBinary(companyId) };
    if (productId) filter = { ...filter, 'DatiProdotto.ProdottoIdentifier': uuidToBinary(productId) };
    if (searchCustomer) filter = { ...filter, 'DatiBase.NomeContraente': { $regex: searchCustomer, $options: 'i' } };
    if (status.length > 0) filter = { ...filter, 'StatoCorrente.Stato.key': { $in: [...status] } };

    return filter;
  }

  /**
   * @param {Array} dossierAndPromoterIds
   * @param {string} contractSearch
   * @param {Array} commissionType
   * @param {string} companyId
   * @param {string} productId
   * @param {string} searchCustomer
   * @param {number} status
   * @param {object} productivePeriodRange
   * @returns {object}
   */
  static buildOverdueSearchFilter(
    dossierAndPromoterIds,
    contractSearch,
    commissionType,
    companyId,
    productId,
    searchCustomer,
    status,
    productivePeriodRange,
  ) {
    const dossierIds = new Set(dossierAndPromoterIds.map((el) => el.dossierId));
    let filter = {
      productivePeriod: {
        $lte: parse(productivePeriodRange.toProductivePeriodYear, productivePeriodRange.toProductivePeriodMonth),
      },
      practiceType: practiceTypes.SUBSCRIPTION,
      dossierId: { $in: [...dossierIds] },
      postForce: { $nin: [11, 12, 13, 14, 15, 17, 19] },
    };

    if (contractSearch)
      filter = {
        ...filter,
        $or: [
          { contractId: { $regex: contractSearch, $options: 'i' } },
          { dossierId: { $regex: contractSearch, $options: 'i' } },
          { practiceId: { $regex: contractSearch, $options: 'i' } },
        ],
      };
    if (companyId) filter = { ...filter, companyId };
    if (productId) filter = { ...filter, productId };
    if (searchCustomer) filter = { ...filter, insuredName: { $regex: searchCustomer, $options: 'i' } };

    return filter;
  }

  /**
   * @param {Array} dossierAndPromoterIds
   * @param {string} contractSearch
   * @param {Array} commissionType
   * @param {string} companyId
   * @param {string} productId
   * @param {string} searchCustomer
   * @param {number} status
   * @param {string} confirmed
   * @param {string} paid
   * @param {object} productivePeriodRange
   * @param {boolean} fullSearch
   * @returns {object}
   */
  static buildInstallmentsSearchFilter(
    dossierAndPromoterIds,
    contractSearch,
    commissionType,
    companyId,
    productId,
    searchCustomer,
    status,
    confirmed,
    paid,
    productivePeriodRange,
    fullSearch,
  ) {
    const dossierIds = new Set(dossierAndPromoterIds.map((el) => el.dossierId));
    let filter = {
      dossierId: { $in: [...dossierIds] },
    };

    if (!fullSearch)
      filter = {
        ...filter,
        productivePeriodYear: productivePeriodRange.fromProductivePeriodYear,
        $and: [
          { productivePeriodMonth: { $gte: productivePeriodRange.fromProductivePeriodMonth } },
          { productivePeriodMonth: { $lte: productivePeriodRange.toProductivePeriodMonth } },
        ],
      };

    if (contractSearch)
      filter = {
        ...filter,
        $or: [
          { contractId: { $regex: contractSearch, $options: 'i' } },
          { dossierId: { $regex: contractSearch, $options: 'i' } },
          { practiceId: { $regex: contractSearch, $options: 'i' } },
        ],
      };
    if (companyId) filter = { ...filter, companyId };
    if (productId) filter = { ...filter, productId };
    if (confirmed) filter = { ...filter, confirmed: confirmed === 'confirmed' };
    if (paid) filter = { ...filter, paidToNetwork: paid === 'paid' };
    if (searchCustomer) filter = { ...filter, insuredName: { $regex: searchCustomer, $options: 'i' } };

    return filter;
  }

  /**
   * @param {Array} customersAndPromoterIds
   * @param {object} productivePeriodRange
   * @returns {object}
   */
  static buildCustomerSearchFilter(customersAndPromoterIds, productivePeriodRange) {
    const customerIds = new Set(customersAndPromoterIds.map((el) => uuidToBinary(el.customerId)));
    return {
      'StatoCorrente.PeriodoProduttivo.Anno': productivePeriodRange.fromProductivePeriodYear,
      $and: [
        { 'StatoCorrente.PeriodoProduttivo.Mese': { $gte: productivePeriodRange.fromProductivePeriodMonth } },
        { 'StatoCorrente.PeriodoProduttivo.Mese': { $lte: productivePeriodRange.toProductivePeriodMonth } },
      ],
      'DatiBase.ClienteIdentifier': { $in: [...customerIds] },
    };
  }

  /**
   * @param {string} networkId
   * @param {string} promoterId
   * @param {string} contractSearch
   * @param {Array} commissionType
   * @param {string} companyId
   * @param {string} productId
   * @param {string} searchCustomer
   * @param {boolean} fullSearch
   * @param {boolean} solarSearch
   * @param {Array} status
   * @param {string} type
   * @param {object} productivePeriodRange
   * @returns {Promise<object>}
   */
  async sumContractsKpiByFilter(
    networkId,
    promoterId,
    contractSearch,
    commissionType,
    companyId,
    productId,
    searchCustomer,
    fullSearch,
    solarSearch,
    status,
    type,
    productivePeriodRange,
  ) {
    let dossierAndPromoterIds;
    if (!fullSearch && !solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(networkId, promoterId, productivePeriodRange, type);
    } else if (solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(
        networkId,
        promoterId,
        { ...productivePeriodRange, toProductivePeriodMonth: 12 },
        type,
      );
    } else {
      dossierAndPromoterIds = await this.prepareNetworkFilterIdsAllPeriods(networkId, promoterId, type);
    }

    const filter = KpiService.buildDossierSearchFilter(
      dossierAndPromoterIds,
      contractSearch,
      commissionType,
      companyId,
      productId,
      searchCustomer,
      status,
      productivePeriodRange,
      fullSearch,
      solarSearch,
    );

    const kpiObject = await this.practiceService.sumContractsByDossierFilterAndProductiveRange(filter);
    const listDossiers = await this.practiceService.listContractsByDossierFilterAndProductiveRange(filter, 0, 0);
    const customers = await this.practiceService.countCustomerIdContractsByDossierFilterAndProductiveRange(filter);

    const finalKpi = kpiObject || { premiumGross: 0, iv: 0, count: 0 };

    const dossierAndPromoterIdsFiltered = dossierAndPromoterIds.filter((item) =>
      listDossiers.find((el) => el.dossierId === item.dossierId),
    );
    const consultants = [...new Set(dossierAndPromoterIdsFiltered.map((el) => el.promoterId))];

    return {
      ...finalKpi,
      consultants: consultants.length * 100,
      customers: customers || 0,
    };
  }

  /**
   * @param {string} networkId
   * @param {string} promoterId
   * @param {string} contractSearch
   * @param {Array} commissionType
   * @param {string} companyId
   * @param {string} productId
   * @param {string} searchCustomer
   * @param {boolean} fullSearch
   * @param {boolean} solarSearch
   * @param {Array} status
   * @param {string} type
   * @param {object} productivePeriodRange
   * @returns {Promise<object>}
   */
  async sumProductionKpiByFilter(
    networkId,
    promoterId,
    contractSearch,
    commissionType,
    companyId,
    productId,
    searchCustomer,
    fullSearch,
    solarSearch,
    status,
    type,
    productivePeriodRange,
  ) {
    let dossierAndPromoterIds;
    if (!fullSearch && !solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(networkId, promoterId, productivePeriodRange, type);
    } else if (solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(
        networkId,
        promoterId,
        { ...productivePeriodRange, toProductivePeriodMonth: 12 },
        type,
      );
    } else {
      dossierAndPromoterIds = await this.prepareNetworkFilterIdsAllPeriods(networkId, promoterId, type);
    }

    const filter = KpiService.buildDossierSearchFilter(
      dossierAndPromoterIds,
      contractSearch,
      commissionType,
      companyId,
      productId,
      searchCustomer,
      status,
      productivePeriodRange,
      fullSearch,
      solarSearch,
    );

    const kpiObject = await this.practiceService.sumProductionByDossierFilterAndProductiveRange(filter);
    const listDossiers = await this.practiceService.listProductionByDossierFilterAndProductiveRange(filter, 0, 0);
    const customers = await this.practiceService.countCustomerIdProductionByDossierFilterAndProductiveRange(filter);

    const finalKpi = kpiObject || { premiumGross: 0, iv: 0, count: 0 };

    const dossierAndPromoterIdsFiltered = dossierAndPromoterIds.filter((item) =>
      listDossiers.find((el) => el.dossierId === item.dossierId),
    );
    const consultants = [...new Set(dossierAndPromoterIdsFiltered.map((el) => el.promoterId))];

    return {
      ...finalKpi,
      consultants: consultants.length * 100,
      customers: customers || 0,
    };
  }

  /**
   * @param {string} networkId
   * @param {string} promoterId
   * @param {string} contractSearch
   * @param {Array} commissionType
   * @param {string} companyId
   * @param {string} productId
   * @param {string} searchCustomer
   * @param {boolean} fullSearch
   * @param {boolean} solarSearch
   * @param {Array} status
   * @param {string} type
   * @param {object} productivePeriodRange
   * @returns {Promise<object>}
   */
  async sumProposalsKpiByFilter(
    networkId,
    promoterId,
    contractSearch,
    commissionType,
    companyId,
    productId,
    searchCustomer,
    fullSearch,
    solarSearch,
    status,
    type,
    productivePeriodRange,
  ) {
    let dossierAndPromoterIds;
    if (!fullSearch && !solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(networkId, promoterId, productivePeriodRange, type);
    } else if (solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(
        networkId,
        promoterId,
        { ...productivePeriodRange, toProductivePeriodMonth: 12 },
        type,
      );
    } else {
      dossierAndPromoterIds = await this.prepareNetworkFilterIdsAllPeriods(networkId, promoterId, type);
    }

    const filter = KpiService.buildDossierSearchFilter(
      dossierAndPromoterIds,
      contractSearch,
      commissionType,
      companyId,
      productId,
      searchCustomer,
      status,
      productivePeriodRange,
      fullSearch,
      solarSearch,
    );

    const kpiObject = await this.practiceService.sumProposalsByDossierFilterAndProductiveRange(filter);
    const listDossiers = await this.practiceService.listProsposalsByDossierFilterAndProductiveRange(filter, 0, 0);
    const customers = await this.practiceService.countCustomerIdProposalsByDossierFilterAndProductiveRange(filter);

    const finalKpi = kpiObject || { premiumGross: 0, iv: 0, count: 0 };

    const dossierAndPromoterIdsFiltered = dossierAndPromoterIds.filter((item) =>
      listDossiers.find((el) => el.dossierId === item.dossierId),
    );
    const consultants = [...new Set(dossierAndPromoterIdsFiltered.map((el) => el.promoterId))];

    return {
      ...finalKpi,
      consultants: consultants.length * 100,
      customers: customers || 0,
    };
  }

  /**
   * @param {string} networkId
   * @param {string} promoterId
   * @param {string} contractSearch
   * @param {Array} commissionType
   * @param {string} companyId
   * @param {string} productId
   * @param {string} searchCustomer
   * @param {boolean} fullSearch
   * @param {boolean} solarSearch
   * @param {Array} status
   * @param {string} type
   * @param {object} productivePeriodRange
   * @returns {Promise<object>}
   */
  async sumPackageKpiByFilter(
    networkId,
    promoterId,
    contractSearch,
    commissionType,
    companyId,
    productId,
    searchCustomer,
    fullSearch,
    solarSearch,
    status,
    type,
    productivePeriodRange,
  ) {
    let dossierAndPromoterIds;
    if (!fullSearch && !solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(networkId, promoterId, productivePeriodRange, type);
    } else if (solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(
        networkId,
        promoterId,
        { ...productivePeriodRange, toProductivePeriodMonth: 12 },
        type,
      );
    } else {
      dossierAndPromoterIds = await this.prepareNetworkFilterIdsAllPeriods(networkId, promoterId, type);
    }

    const filter = KpiService.buildDossierSearchFilter(
      dossierAndPromoterIds,
      contractSearch,
      commissionType,
      companyId,
      productId,
      searchCustomer,
      status,
      productivePeriodRange,
      fullSearch,
      solarSearch,
    );

    const kpiObject = await this.practiceService.sumPackageByDossierFilterAndProductiveRange(filter);
    const listDossiers = await this.practiceService.listPackageByDossierFilterAndProductiveRange(filter, 0, 0);
    const customers = await this.practiceService.countCustomerIdPackageByDossierFilterAndProductiveRange(filter);

    const finalKpi = kpiObject || { premiumGross: 0, iv: 0, count: 0 };

    const dossierAndPromoterIdsFiltered = dossierAndPromoterIds.filter((item) =>
      listDossiers.find((el) => el.dossierId === item.dossierId),
    );
    const consultants = [...new Set(dossierAndPromoterIdsFiltered.map((el) => el.promoterId))];

    return {
      ...finalKpi,
      consultants: consultants.length * 100,
      customers: customers || 0,
    };
  }

  /**
   * @param {string} networkId
   * @param {string} promoterId
   * @param {string} contractSearch
   * @param {Array} commissionType
   * @param {string} companyId
   * @param {string} productId
   * @param {string} searchCustomer
   * @param {boolean} fullSearch
   * @param {boolean} solarSearch
   * @param {Array} status
   * @param {string} type
   * @param {object} productivePeriodRange
   * @returns {Promise<object>}
   */
  async sumNegativeKpiByFilter(
    networkId,
    promoterId,
    contractSearch,
    commissionType,
    companyId,
    productId,
    searchCustomer,
    fullSearch,
    solarSearch,
    status,
    type,
    productivePeriodRange,
  ) {
    let dossierAndPromoterIds;
    if (!fullSearch && !solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(networkId, promoterId, productivePeriodRange, type);
    } else if (solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(
        networkId,
        promoterId,
        { ...productivePeriodRange, toProductivePeriodMonth: 12 },
        type,
      );
    } else {
      dossierAndPromoterIds = await this.prepareNetworkFilterIdsAllPeriods(networkId, promoterId, type);
    }

    const filter = KpiService.buildDossierSearchFilter(
      dossierAndPromoterIds,
      contractSearch,
      commissionType,
      companyId,
      productId,
      searchCustomer,
      status,
      productivePeriodRange,
      fullSearch,
      solarSearch,
    );

    const kpiObject = await this.practiceService.sumNegativeByDossierFilterAndProductiveRange(filter);
    const listDossiers = await this.practiceService.listNegativeByDossierFilterAndProductiveRange(filter, 0, 0);
    const customers = await this.practiceService.countCustomerIdNegativeByDossierFilterAndProductiveRange(filter);

    const dossierAndPromoterIdsFiltered = dossierAndPromoterIds.filter((item) =>
      listDossiers.find((el) => el.dossierId === item.dossierId),
    );
    const consultants = [...new Set(dossierAndPromoterIdsFiltered.map((el) => el.promoterId))];

    const finalKpi = kpiObject || { premiumGross: 0, iv: 0, count: 0 };

    return {
      ...finalKpi,
      consultants: consultants.length * 100,
      customers: customers || 0,
    };
  }

  /**
   * @param {number} role
   * @param {string} firstNode
   * @param {string} networkId
   * @param {string} promoterId
   * @param {string} searchCustomer
   * @param {string} identityId
   * @param {string} type
   * @param {string} contactType
   * @param {number} status
   * @param {boolean} birthday
   * @param {object} productivePeriodRange
   * @returns {Promise<object>}
   */
  // eslint-disable-next-line sonarjs/no-identical-functions,sonarjs/cognitive-complexity
  async sumCustomersKpiByFilter(
    role,
    firstNode,
    networkId,
    promoterId,
    searchCustomer,
    identityId,
    type,
    contactType,
    status,
    birthday,
    productivePeriodRange,
  ) {
    let filter;
    let customerNumber = 0;
    if (
      firstNode === networkId &&
      role >= 7 &&
      !promoterId &&
      !type &&
      productivePeriodRange.fromProductivePeriodYear === new Date().getFullYear() &&
      productivePeriodRange.fromProductivePeriodMonth === new Date().getMonth() + 1
    ) {
      filter = {
        'StatoCorrente.PeriodoProduttivo.Anno': productivePeriodRange.fromProductivePeriodYear,
        $and: [
          { 'StatoCorrente.PeriodoProduttivo.Mese': { $gte: productivePeriodRange.fromProductivePeriodMonth } },
          { 'StatoCorrente.PeriodoProduttivo.Mese': { $lte: productivePeriodRange.toProductivePeriodMonth } },
        ],
      };

      if (contactType || status || birthday || searchCustomer) {
        const previousWeek = moment().add(-1, 'weeks');
        const today = moment();
        const filterCustomer = {
          ...(searchCustomer
            ? {
                NomeCompleto: { $regex: searchCustomer, $options: 'i' },
              }
            : {}),
          ...(birthday
            ? {
                $expr: {
                  $and: [
                    { $lte: [{ $dayOfYear: '$DataDiNascita' }, { $dayOfYear: today.toDate() }] },
                    { $gte: [{ $dayOfYear: '$DataDiNascita' }, { $dayOfYear: previousWeek.toDate() }] },
                  ],
                },
              }
            : {}),
          ...getTypeFilter(contactType),
          ...getStatusFilter(status),
        };

        const customerItems = await this.customerService.getCustomers(0, 0, filterCustomer);
        const customerIds = new Set(customerItems.map((el) => uuidToBinary(el._id)));
        // eslint-disable-next-line unicorn/explicit-length-check
        customerNumber = [...customerIds].length || 0;
        filter = {
          'StatoCorrente.PeriodoProduttivo.Anno': productivePeriodRange.fromProductivePeriodYear,
          $and: [
            { 'StatoCorrente.PeriodoProduttivo.Mese': { $gte: productivePeriodRange.fromProductivePeriodMonth } },
            { 'StatoCorrente.PeriodoProduttivo.Mese': { $lte: productivePeriodRange.toProductivePeriodMonth } },
          ],
          'DatiBase.ClienteIdentifier': { $in: [...customerIds] },
        };
      } else {
        customerNumber = await this.mongodb.collection('Customer').find({}).count();
      }
    } else {
      let customersAndPromoterIds = await this.customerService.prepareNetworkFilterIds(
        networkId,
        promoterId,
        productivePeriodRange,
        type,
      );

      let customerIds = new Set(customersAndPromoterIds.map((el) => el.customerId));
      // eslint-disable-next-line unicorn/explicit-length-check
      customerNumber = [...customerIds].length || 0;
      const customerIDsBin = new Set(customersAndPromoterIds.map((el) => uuidToBinary(el.customerId)));

      if (contactType || status || birthday || searchCustomer) {
        const previousWeek = moment().add(-1, 'weeks');
        const today = moment();
        const filterCustomer = {
          ...(networkId || (promoterId && promoterId !== identityId)
            ? {
                _id: { $in: [...customerIDsBin] },
              }
            : {}),
          ...(searchCustomer
            ? {
                NomeCompleto: { $regex: searchCustomer, $options: 'i' },
              }
            : {}),
          ...(birthday
            ? {
                $expr: {
                  $and: [
                    { $lte: [{ $dayOfYear: '$DataDiNascita' }, { $dayOfYear: today.toDate() }] },
                    { $gte: [{ $dayOfYear: '$DataDiNascita' }, { $dayOfYear: previousWeek.toDate() }] },
                  ],
                },
              }
            : {}),
          ...getTypeFilter(contactType),
          ...getStatusFilter(status),
        };

        const customerItems = await this.customerService.getCustomers(0, 0, filterCustomer);
        customersAndPromoterIds = customersAndPromoterIds.filter((el) =>
          customerItems.find((thisc) => thisc._id === el.customerId),
        );

        customerIds = new Set(customersAndPromoterIds.map((el) => el.customerId));
        // eslint-disable-next-line unicorn/explicit-length-check
        customerNumber = [...customerIds].length || 0;
      }

      filter = KpiService.buildCustomerSearchFilter(customersAndPromoterIds, productivePeriodRange);
    }

    const kpiObject = await this.practiceService.sumContractsByDossierFilterAndProductiveRange(filter);
    const insured = await this.practiceService.countCustomerIdContractsByDossierFilterAndProductiveRange(filter);

    const finalKpi = kpiObject || { premiumGross: 0, iv: 0, count: 0 };

    return {
      ...finalKpi,
      insured: insured || 0,
      customers: customerNumber * 100,
    };
  }

  /**
   * @param {number} role
   * @param {string} firstNode
   * @param {string} networkId
   * @param {string} promoterId
   * @param {string} searchCustomer
   * @param {string} identityId
   * @param {string} type
   * @param {string} contactType
   * @param {number} status
   * @param {string} expired
   * @param {string} complete
   * @param {string} edition
   * @param {object} productivePeriodRange
   * @returns {Promise<object>}
   */
  // eslint-disable-next-line sonarjs/no-identical-functions,sonarjs/cognitive-complexity
  async sumCustomersIdentityCardsKpiByFilter(
    role,
    firstNode,
    networkId,
    promoterId,
    searchCustomer,
    identityId,
    type,
    contactType,
    status,
    expired,
    complete,
    edition,
    productivePeriodRange,
  ) {
    let filter;
    let customerNumber = 0;
    if (
      firstNode === networkId &&
      role >= 7 &&
      !promoterId &&
      !type &&
      productivePeriodRange.fromProductivePeriodYear === new Date().getFullYear() &&
      productivePeriodRange.fromProductivePeriodMonth === new Date().getMonth() + 1
    ) {
      filter = {
        'StatoCorrente.PeriodoProduttivo.Anno': productivePeriodRange.fromProductivePeriodYear,
        $and: [
          { 'StatoCorrente.PeriodoProduttivo.Mese': { $gte: productivePeriodRange.fromProductivePeriodMonth } },
          { 'StatoCorrente.PeriodoProduttivo.Mese': { $lte: productivePeriodRange.toProductivePeriodMonth } },
        ],
      };

      if (contactType || status || searchCustomer || expired || complete !== 'all') {
        const nextMonth = moment().add(1, 'months');
        const today = moment();
        const filterCustomer = {
          ...(searchCustomer
            ? {
                NomeCliente: { $regex: searchCustomer, $options: 'i' },
              }
            : {}),
          ...getTypeFilter(contactType),
          ...getStatusFilter(status),
        };
        const filterIdCard = {
          ...(expired === 'expired'
            ? {
                DataScadenza: { $lt: today.toDate() },
              }
            : {}),
          ...(expired === 'expiring' && complete === 'complete'
            ? {
                $and: [
                  {
                    DataScadenza: { $gte: today.toDate() },
                  },
                  {
                    DataScadenza: { $lte: nextMonth.toDate() },
                  },
                  { DataScadenza: { $ne: null } },
                  { TipoDocumento: { $ne: null } },
                  { NumeroDocumento: { $ne: null } },
                  { DataEmissioneDocumento: { $ne: null } },
                ],
              }
            : {}),
          ...(expired === 'expiring' && complete !== 'complete'
            ? {
                $and: [
                  {
                    DataScadenza: { $gte: today.toDate() },
                  },
                  {
                    DataScadenza: { $lte: nextMonth.toDate() },
                  },
                  { DataScadenza: { $ne: null } },
                  { TipoDocumento: { $ne: null } },
                  { NumeroDocumento: { $ne: null } },
                  { DataEmissioneDocumento: { $ne: null } },
                ],
              }
            : {}),
          ...(complete === 'complete' && expired !== 'expiring'
            ? {
                $and: [
                  { DataScadenza: { $ne: null } },
                  { TipoDocumento: { $ne: null } },
                  { NumeroDocumento: { $ne: null } },
                  { DataEmissioneDocumento: { $ne: null } },
                ],
              }
            : {}),
          ...(complete === 'incomplete'
            ? {
                $or: [
                  { DataScadenza: null },
                  { DataScadenza: null },
                  { TipoDocumento: null },
                  { NumeroDocumento: null },
                  { DataEmissioneDocumento: null },
                ],
              }
            : {}),
        };

        const customerItems =
          edition === 'tcw'
            ? await this.customerService
                .getCustomersIdentityCardsPrivacy(0, 0, filterCustomer, filterIdCard, true)
                .then((items) => items)
                .catch((error) => error)
            : await this.customerService
                .getCustomersIdentityCardsMandato(0, 0, filterCustomer, filterIdCard, true)
                .then((items) => items)
                .catch((error) => error);

        const customerIds = new Set(customerItems.map((el) => uuidToBinary(el._id)));
        // eslint-disable-next-line unicorn/explicit-length-check
        customerNumber = [...customerIds].length || 0;
        filter = {
          'StatoCorrente.PeriodoProduttivo.Anno': productivePeriodRange.fromProductivePeriodYear,
          $and: [
            { 'StatoCorrente.PeriodoProduttivo.Mese': { $gte: productivePeriodRange.fromProductivePeriodMonth } },
            { 'StatoCorrente.PeriodoProduttivo.Mese': { $lte: productivePeriodRange.toProductivePeriodMonth } },
          ],
          'DatiBase.ClienteIdentifier': { $in: [...customerIds] },
        };
      } else {
        customerNumber = await this.mongodb.collection('Customer').find({}).count();
      }
    } else {
      let customersAndPromoterIds = await this.customerService.prepareNetworkFilterIds(
        networkId,
        promoterId,
        productivePeriodRange,
        type,
      );

      let customerIds = new Set(customersAndPromoterIds.map((el) => el.customerId));
      // eslint-disable-next-line unicorn/explicit-length-check
      customerNumber = [...customerIds].length || 0;
      const customerIDsBin = new Set(customersAndPromoterIds.map((el) => uuidToBinary(el.customerId)));

      if (contactType || status || searchCustomer || expired || complete !== 'all') {
        const nextMonth = moment().add(1, 'months');
        const today = moment();
        const filterCustomer = {
          ...(networkId || (promoterId && promoterId !== identityId)
            ? {
                CustomerIdentifier: { $in: [...customerIDsBin] },
              }
            : {}),
          ...(searchCustomer
            ? {
                NomeCliente: { $regex: searchCustomer, $options: 'i' },
              }
            : {}),
          ...getTypeFilter(contactType),
          ...getStatusFilter(status),
        };
        const filterIdCard = {
          ...(expired === 'expired'
            ? {
                DataScadenza: { $lt: today.toDate() },
              }
            : {}),
          ...(expired === 'expiring' && complete === 'complete'
            ? {
                $and: [
                  {
                    DataScadenza: { $gte: today.toDate() },
                  },
                  {
                    DataScadenza: { $lte: nextMonth.toDate() },
                  },
                  { DataScadenza: { $ne: null } },
                  { TipoDocumento: { $ne: null } },
                  { NumeroDocumento: { $ne: null } },
                  { DataEmissioneDocumento: { $ne: null } },
                ],
              }
            : {}),
          ...(expired === 'expiring' && complete !== 'complete'
            ? {
                $and: [
                  {
                    DataScadenza: { $gte: today.toDate() },
                  },
                  {
                    DataScadenza: { $lte: nextMonth.toDate() },
                  },
                  { DataScadenza: { $ne: null } },
                  { TipoDocumento: { $ne: null } },
                  { NumeroDocumento: { $ne: null } },
                  { DataEmissioneDocumento: { $ne: null } },
                ],
              }
            : {}),
          ...(complete === 'complete' && expired !== 'expiring'
            ? {
                $and: [
                  { DataScadenza: { $ne: null } },
                  { TipoDocumento: { $ne: null } },
                  { NumeroDocumento: { $ne: null } },
                  { DataEmissioneDocumento: { $ne: null } },
                ],
              }
            : {}),
          ...(complete === 'incomplete'
            ? {
                $or: [
                  { DataScadenza: null },
                  { DataScadenza: null },
                  { TipoDocumento: null },
                  { NumeroDocumento: null },
                  { DataEmissioneDocumento: null },
                ],
              }
            : {}),
        };

        const customerItems =
          edition === 'tcw'
            ? await this.customerService
                .getCustomersIdentityCardsPrivacy(0, 0, filterCustomer, filterIdCard, true)
                .then((items) => items)
                .catch((error) => error)
            : await this.customerService
                .getCustomersIdentityCardsMandato(0, 0, filterCustomer, filterIdCard, true)
                .then((items) => items)
                .catch((error) => error);

        customersAndPromoterIds = customersAndPromoterIds.filter((el) =>
          customerItems.find((thisc) => thisc._id === el.customerId),
        );

        customerIds = new Set(customersAndPromoterIds.map((el) => el.customerId));
        // eslint-disable-next-line unicorn/explicit-length-check
        customerNumber = [...customerIds].length || 0;
      }

      filter = KpiService.buildCustomerSearchFilter(customersAndPromoterIds, productivePeriodRange);
    }

    const kpiObject = await this.practiceService.sumContractsByDossierFilterAndProductiveRange(filter);
    const insured = await this.practiceService.countCustomerIdContractsByDossierFilterAndProductiveRange(filter);

    const finalKpi = kpiObject || { premiumGross: 0, iv: 0, count: 0 };

    return {
      ...finalKpi,
      insured: insured || 0,
      customers: customerNumber * 100,
    };
  }

  /**
   * @param {Array} contractList
   * @param {Array} dossierAndPromoterIds
   * @returns {Promise<object>}
   */
  async addPromoterDisplayName(contractList, dossierAndPromoterIds) {
    const finalContractList = [];
    const nodeListMap = new Map();
    const treeMap = new Map();
    const jobs = await this.mongodb
      .collection('promoter-job')
      .aggregate([
        { $sort: { _id: -1 } },
        {
          $group: {
            _id: {
              promoterId: '$promoterId',
            },
            roleId: { $first: '$roleId' },
          },
        },
        {
          $project: {
            promoterId: '$_id.promoterId',
            roleId: '$roleId',
          },
        },
      ])
      .toArray();

    // @ts-ignore
    // eslint-disable-next-line sonarjs/cognitive-complexity
    await contractList.forEachAsync(async (el) => {
      let thisDox = dossierAndPromoterIds.find(
        (elDox) =>
          el.dossierId === elDox.dossierId &&
          el.effectProductivePeriodYear === elDox.productivePeriodYear &&
          el.effectProductivePeriodMonth === elDox.productivePeriodMonth,
      );

      if (!thisDox) {
        thisDox = await this.dossierInsurerSrv.getDossierInsurer(
          el.dossierId,
          el.effectProductivePeriodYear,
          el.effectProductivePeriodMonth,
        );
      }

      const dossierPeriod = parse(el.effectProductivePeriodYear, el.effectProductivePeriodMonth);

      let nodeList = nodeListMap.get(dossierPeriod);
      if (!nodeList) {
        nodeList = await this.networkService.getNetworkListFlatPeriod(
          7,
          '',
          el.effectProductivePeriodYear,
          el.effectProductivePeriodMonth,
          true,
        );
        nodeListMap.set(dossierPeriod, nodeList);
      }

      let tree = treeMap.get(dossierPeriod);
      if (!tree) {
        tree = await this.networkService.getNetworkAsTree(
          el.effectProductivePeriodYear,
          el.effectProductivePeriodMonth,
        );
        treeMap.set(dossierPeriod, tree);
      }

      let promoterDisplayHierarchy = 'Nodo non trovato';
      let promoterDisplayPromoterNames = 'Nodo non trovato';
      let promoterDisplayPromoterNamesIds = [];
      let promoterDisplayName = 'Nessuno';
      let promoterRoleId = roleIds.NONE;
      let inherited = false;
      let nameDM = '';
      let nameBM = '';
      let nameTM = '';
      let branch = '';
      let validPromoterId = '';
      const nodeOriginalPeriod = nodeList.find((item) => item._id === thisDox.networkNodeId);

      if (nodeOriginalPeriod) {
        promoterDisplayHierarchy = nodeOriginalPeriod.displayHierarchy;
        promoterDisplayPromoterNames = nodeOriginalPeriod.displayPromoterNames;
        promoterDisplayPromoterNamesIds = nodeOriginalPeriod.displayPromoterNamesIds;
        promoterDisplayName = nodeOriginalPeriod.validPromoterName;
        inherited = nodeOriginalPeriod.inherited;
        validPromoterId = nodeOriginalPeriod.validPromoterId;
        const thisJob = jobs.find((job) => job.promoterId === validPromoterId);
        const branches = await this.networkService.getNetworkAllBranches(tree, validPromoterId);

        branches.forEach((node) => {
          if (node.model.roleId === 'district-manager') {
            nameDM = node.model.promoterId;
          }
          if (node.model.roleId === 'branch-manager') {
            nameBM = node.model.promoterId;
            branch = node.model.name;
          }
          if (node.model.roleId === 'team-manager') {
            nameTM = node.model.promoterId;
          }
        });
        if (thisJob) promoterRoleId = thisJob.roleId;
      }

      let originalPracticeId = el._id;
      if (el.type === practiceTypes.ADDITIONAL_INCOME) {
        const originalPractice = await this.practiceService.getPracticeSubscriptionById(el.dossierId);
        originalPracticeId = originalPractice._id;
      }

      finalContractList.push({
        ...el,
        promoterInherited: inherited,
        promoterDisplayName,
        promoterDisplayHierarchy,
        promoterDisplayPromoterNames,
        promoterDisplayPromoterNamesIds,
        promoterRoleId,
        originalPracticeId,
        nameDM,
        nameBM,
        nameTM,
        branch,
        validPromoterId,
      });
    });
    return finalContractList;
  }

  /**
   * @param {Array} contractList
   * @param {Array} dossierAndPromoterIds
   * @returns {Promise<object>}
   */
  async addPromoterDisplayNamePracticeCommissioning(contractList, dossierAndPromoterIds) {
    const finalContractList = [];
    const nodeListMap = new Map();
    const treeMap = new Map();
    const jobs = await this.mongodb
      .collection('promoter-job')
      .aggregate([
        { $sort: { _id: -1 } },
        {
          $group: {
            _id: {
              promoterId: '$promoterId',
            },
            roleId: { $first: '$roleId' },
          },
        },
        {
          $project: {
            promoterId: '$_id.promoterId',
            roleId: '$roleId',
          },
        },
      ])
      .toArray();

    // @ts-ignore
    await contractList.forEachAsync(async (el) => {
      let thisDox = dossierAndPromoterIds.find(
        (elDox) =>
          el.dossierId === elDox.dossierId &&
          el.productivePeriodYear === elDox.productivePeriodYear &&
          el.productivePeriodMonth === elDox.productivePeriodMonth,
      );

      if (!thisDox) {
        thisDox = await this.dossierInsurerSrv.getDossierInsurer(
          el.dossierId,
          el.productivePeriodYear,
          el.productivePeriodMonth,
        );
      }

      const dossierPeriod = parse(el.productivePeriodYear, el.productivePeriodMonth);

      let nodeList = nodeListMap.get(dossierPeriod);
      if (!nodeList) {
        nodeList = await this.networkService.getNetworkListFlatPeriod(
          7,
          '',
          el.productivePeriodYear,
          el.productivePeriodMonth,
          true,
        );

        if (nodeList === undefined || nodeList.length === 0) {
          nodeList = await this.networkService.getNetworkListFlat(7, '');
        }
        nodeListMap.set(dossierPeriod, nodeList);
      }

      let tree = treeMap.get(dossierPeriod);
      if (!tree) {
        tree = await this.networkService.getNetworkAsTree(el.productivePeriodYear, el.productivePeriodMonth);
        treeMap.set(dossierPeriod, tree);
      }

      let promoterDisplayHierarchy = 'Nodo non trovato';
      let promoterDisplayPromoterNames = 'Nodo non trovato';
      let promoterDisplayName = 'Nessuno';
      let promoterRoleId = roleIds.NONE;
      let inherited = false;
      const nodeOriginalPeriod = nodeList.find((item) => item._id === thisDox.networkNodeId);

      if (nodeOriginalPeriod) {
        promoterDisplayHierarchy = nodeOriginalPeriod.displayHierarchy;
        promoterDisplayPromoterNames = nodeOriginalPeriod.displayPromoterNames;
        promoterDisplayName = nodeOriginalPeriod.validPromoterName;
        inherited = nodeOriginalPeriod.inherited;
        const thisJob = jobs.find((job) => job.promoterId === nodeOriginalPeriod.validPromoterId);
        if (thisJob) promoterRoleId = thisJob.roleId;
      }

      const originalPractice = await this.practiceService.getPracticeSubscriptionById(el.dossierId);
      const originalPracticeId = originalPractice._id;
      const { unique } = originalPractice;

      finalContractList.push({
        ...el,
        promoterInherited: inherited,
        promoterDisplayName,
        promoterDisplayHierarchy,
        promoterDisplayPromoterNames,
        promoterRoleId,
        originalPracticeId,
        unique,
      });
    });
    return finalContractList;
  }

  /**
   * @param {string} networkId
   * @param {string} promoterId
   * @param {string} contractSearch
   * @param {Array} commissionType
   * @param {string} companyId
   * @param {string} productId
   * @param {string} searchCustomer
   * @param {boolean} fullSearch
   * @param {boolean} solarSearch
   * @param {Array} status
   * @param {string} type
   * @param {object} productivePeriodRange
   * @param {number} skip
   * @param {number} count
   * @returns {Promise<object>}
   */
  async listContractsKpiByFilter(
    networkId,
    promoterId,
    contractSearch,
    commissionType,
    companyId,
    productId,
    searchCustomer,
    fullSearch,
    solarSearch,
    status,
    type,
    productivePeriodRange,
    skip,
    count,
  ) {
    let dossierAndPromoterIds;
    if (!fullSearch && !solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(networkId, promoterId, productivePeriodRange, type);
    } else if (solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(
        networkId,
        promoterId,
        { ...productivePeriodRange, toProductivePeriodMonth: 12 },
        type,
      );
    } else {
      dossierAndPromoterIds = await this.prepareNetworkFilterIdsAllPeriods(networkId, promoterId, type);
    }

    const filter = KpiService.buildDossierSearchFilter(
      dossierAndPromoterIds,
      contractSearch,
      commissionType,
      companyId,
      productId,
      searchCustomer,
      status,
      productivePeriodRange,
      fullSearch,
      solarSearch,
    );

    const contractList = await this.practiceService.listContractsByDossierFilterAndProductiveRange(filter, skip, count);
    return this.addPromoterDisplayName(contractList, dossierAndPromoterIds);
  }

  /**
   * @param {string} networkId
   * @param {string} promoterId
   * @param {string} contractSearch
   * @param {Array} commissionType
   * @param {string} companyId
   * @param {string} productId
   * @param {string} searchCustomer
   * @param {boolean} fullSearch
   * @param {boolean} solarSearch
   * @param {Array} status
   * @param {string} type
   * @param {object} productivePeriodRange
   * @param {number} skip
   * @param {number} count
   * @returns {Promise<object>}
   */
  async listProductionKpiByFilter(
    networkId,
    promoterId,
    contractSearch,
    commissionType,
    companyId,
    productId,
    searchCustomer,
    fullSearch,
    solarSearch,
    status,
    type,
    productivePeriodRange,
    skip,
    count,
  ) {
    let dossierAndPromoterIds;
    if (!fullSearch && !solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(networkId, promoterId, productivePeriodRange, type);
    } else if (solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(
        networkId,
        promoterId,
        { ...productivePeriodRange, toProductivePeriodMonth: 12 },
        type,
      );
    } else {
      dossierAndPromoterIds = await this.prepareNetworkFilterIdsAllPeriods(networkId, promoterId, type);
    }

    const filter = KpiService.buildDossierSearchFilter(
      dossierAndPromoterIds,
      contractSearch,
      commissionType,
      companyId,
      productId,
      searchCustomer,
      status,
      productivePeriodRange,
      fullSearch,
      solarSearch,
    );

    const contractList = await this.practiceService.listProductionByDossierFilterAndProductiveRange(
      filter,
      skip,
      count,
    );
    return this.addPromoterDisplayName(contractList, dossierAndPromoterIds);
  }

  /**
   * @param {string} networkId
   * @param {string} promoterId
   * @param {string} contractSearch
   * @param {Array} commissionType
   * @param {string} companyId
   * @param {string} productId
   * @param {string} searchCustomer
   * @param {boolean} fullSearch
   * @param {boolean} solarSearch
   * @param {Array} status
   * @param {string} type
   * @param {object} productivePeriodRange
   * @param {number} skip
   * @param {number} count
   * @returns {Promise<object>}
   */
  async listProductionExportKpiByFilter(
    networkId,
    promoterId,
    contractSearch,
    commissionType,
    companyId,
    productId,
    searchCustomer,
    fullSearch,
    solarSearch,
    status,
    type,
    productivePeriodRange,
    skip,
    count,
  ) {
    let dossierAndPromoterIds;
    if (!fullSearch && !solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(networkId, promoterId, productivePeriodRange, type);
    } else if (solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(
        networkId,
        promoterId,
        { ...productivePeriodRange, toProductivePeriodMonth: 12 },
        type,
      );
    } else {
      dossierAndPromoterIds = this.prepareNetworkFilterIdsAllPeriods(networkId, promoterId, type, contractSearch);
    }

    const filter = KpiService.buildDossierSearchFilter(
      dossierAndPromoterIds,
      contractSearch,
      commissionType,
      companyId,
      productId,
      searchCustomer,
      status,
      productivePeriodRange,
      fullSearch,
      solarSearch,
    );

    const contractList = await this.practiceService.listProductionExportByDossierFilterAndProductiveRange(
      filter,
      skip,
      count,
    );

    return this.addPromoterDisplayName(contractList, dossierAndPromoterIds);
  }

  /**
   * @param {string} networkId
   * @param {string} promoterId
   * @param {string} contractSearch
   * @param {Array} commissionType
   * @param {string} companyId
   * @param {string} productId
   * @param {string} searchCustomer
   * @param {boolean} fullSearch
   * @param {boolean} solarSearch
   * @param {Array} status
   * @param {string} type
   * @param {object} productivePeriodRange
   * @param {number} skip
   * @param {number} count
   */
  async listProposalsKpiByFilter(
    networkId,
    promoterId,
    contractSearch,
    commissionType,
    companyId,
    productId,
    searchCustomer,
    fullSearch,
    solarSearch,
    status,
    type,
    productivePeriodRange,
    skip,
    count,
  ) {
    let dossierAndPromoterIds;
    // eslint-disable-next-line max-len, prefer-const
    if (!fullSearch && !solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(networkId, promoterId, productivePeriodRange, type);
    } else if (solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(
        networkId,
        promoterId,
        { ...productivePeriodRange, toProductivePeriodMonth: 12 },
        type,
      );
    } else {
      dossierAndPromoterIds = await this.prepareNetworkFilterIdsAllPeriods(networkId, promoterId, type);
    }

    const filter = KpiService.buildDossierSearchFilter(
      dossierAndPromoterIds,
      contractSearch,
      commissionType,
      companyId,
      productId,
      searchCustomer,
      status,
      productivePeriodRange,
      fullSearch,
      solarSearch,
    );

    const contractList = await this.practiceService.listProsposalsByDossierFilterAndProductiveRange(
      filter,
      skip,
      count,
    );
    return this.addPromoterDisplayName(contractList, dossierAndPromoterIds);
  }

  /**
   * @param {string} networkId
   * @param {string} promoterId
   * @param {string} contractSearch
   * @param {Array} commissionType
   * @param {string} companyId
   * @param {string} productId
   * @param {string} searchCustomer
   * @param {boolean} fullSearch
   * @param {boolean} solarSearch
   * @param {Array} status
   * @param {string} type
   * @param {object} productivePeriodRange
   * @param {number} skip
   * @param {number} count
   */
  async listPackageKpiByFilter(
    networkId,
    promoterId,
    contractSearch,
    commissionType,
    companyId,
    productId,
    searchCustomer,
    fullSearch,
    solarSearch,
    status,
    type,
    productivePeriodRange,
    skip,
    count,
  ) {
    let dossierAndPromoterIds;
    if (!fullSearch && !solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(networkId, promoterId, productivePeriodRange, type);
    } else if (solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(
        networkId,
        promoterId,
        { ...productivePeriodRange, toProductivePeriodMonth: 12 },
        type,
      );
    } else {
      dossierAndPromoterIds = await this.prepareNetworkFilterIdsAllPeriods(networkId, promoterId, type);
    }

    const filter = KpiService.buildDossierSearchFilter(
      dossierAndPromoterIds,
      contractSearch,
      commissionType,
      companyId,
      productId,
      searchCustomer,
      status,
      productivePeriodRange,
      fullSearch,
      solarSearch,
    );

    const contractList = await this.practiceService.listPackageByDossierFilterAndProductiveRange(filter, skip, count);
    return this.addPromoterDisplayName(contractList, dossierAndPromoterIds);
  }

  /**
   * @param {string} networkId
   * @param {string} promoterId
   * @param {string} contractSearch
   * @param {Array} commissionType
   * @param {string} companyId
   * @param {string} productId
   * @param {string} searchCustomer
   * @param {boolean} fullSearch
   * @param {boolean} solarSearch
   * @param {Array} status
   * @param {string} type
   * @param {object} productivePeriodRange
   * @param {number} skip
   * @param {number} count
   */
  async listNegativeKpiByFilter(
    networkId,
    promoterId,
    contractSearch,
    commissionType,
    companyId,
    productId,
    searchCustomer,
    fullSearch,
    solarSearch,
    status,
    type,
    productivePeriodRange,
    skip,
    count,
  ) {
    let dossierAndPromoterIds;
    if (!fullSearch && !solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(networkId, promoterId, productivePeriodRange, type);
    } else if (solarSearch) {
      dossierAndPromoterIds = await this.prepareNetworkFilterIds(
        networkId,
        promoterId,
        { ...productivePeriodRange, toProductivePeriodMonth: 12 },
        type,
      );
    } else {
      dossierAndPromoterIds = await this.prepareNetworkFilterIdsAllPeriods(networkId, promoterId, type);
    }

    const filter = KpiService.buildDossierSearchFilter(
      dossierAndPromoterIds,
      contractSearch,
      commissionType,
      companyId,
      productId,
      searchCustomer,
      status,
      productivePeriodRange,
      fullSearch,
      solarSearch,
    );

    const contractList = await this.practiceService.listNegativeByDossierFilterAndProductiveRange(filter, skip, count);
    return this.addPromoterDisplayName(contractList, dossierAndPromoterIds);
  }

  /**
   * @param {number} myRoleId
   * @param {string} myUserId
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @param {string} edition
   * @param {string} exportId
   * @param {string} searchCustomer
   * @param {string} promoterId
   * @param {boolean} birthday
   * @param {string} contactType
   * @param {string} status
   * @param {string} networkId
   * @param {string} type
   * @param {number} fromProductivePeriodYear
   * @param {number} fromProductivePeriodMonth
   * @param {number} toProductivePeriodYear
   * @param {number} toProductivePeriodMonth
   * @param {string} contractSearch
   * @param {string} commissionType
   * @param {string} companyId
   * @param {string} productId
   * @param {string} fullSearch
   * @param {string} solarSearch
   * @returns {Promise<DocumentObject>}
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async exportProduction(
    myRoleId,
    myUserId,
    productivePeriodYear,
    productivePeriodMonth,
    edition,
    exportId,
    searchCustomer,
    promoterId,
    birthday,
    contactType,
    status,
    networkId,
    type,
    fromProductivePeriodYear,
    fromProductivePeriodMonth,
    toProductivePeriodYear,
    toProductivePeriodMonth,
    contractSearch,
    commissionType,
    companyId,
    productId,
    fullSearch,
    solarSearch,
  ) {
    const firstNode = await this.networkService.userCanSeeProductivePeriod(
      myRoleId,
      myUserId,
      promoterId,
      toProductivePeriodYear,
      toProductivePeriodMonth,
    );

    const nodeList = await this.networkService.getNetworkListFlat(7, '');

    const promoterToQuery = myUserId === promoterId ? undefined : promoterId;

    return this.listProductionExportKpiByFilter(
      // @ts-ignore
      networkId || firstNode.model._id,
      // @ts-ignore
      promoterToQuery,
      contractSearch,
      commissionType ? JSON.parse(commissionType) : [],
      companyId,
      productId,
      searchCustomer,
      // @ts-ignore
      fullSearch,
      solarSearch,
      status ? JSON.parse(status) : [],
      type,
      {
        fromProductivePeriodYear,
        fromProductivePeriodMonth,
        toProductivePeriodYear,
        toProductivePeriodMonth,
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
        await practices.forEachAsync(async (p) => {
          const roleId = p.promoterRoleId ? await translateRoleId(this.mongodb, p.promoterRoleId) : 'Nessuno';
          const dossierInsurer = await this.dossierInsurerSrv.getLastDossierInsurer(p.dossierId);
          const nodeOriginalPeriod = nodeList.find((item) => item._id === dossierInsurer.networkNodeId);

          const { fiscalCode } = await this.customerService.getCustomerById(p.customerId);
          const currentPromoter = dossierInsurer.promoterId
            ? await this.promoterService.getPromoterById(dossierInsurer.promoterId)
            : '';
          const districtManager = p.nameDM ? await this.promoterService.getPromoterById(p.nameDM) : '';
          const branchManager = p.nameBM ? await this.promoterService.getPromoterById(p.nameBM) : '';
          const teamManager = p.nameTM ? await this.promoterService.getPromoterById(p.nameTM) : '';
          const promoterObject = p.validPromoterId ? await this.promoterService.getPromoterById(p.validPromoterId) : '';

          const promotersFull = [];

          if (p.promoterDisplayPromoterNamesIds.length > 0) {
            // eslint-disable-next-line consistent-return
            await p.promoterDisplayPromoterNamesIds.forEachAsync(async (i) => {
              if (!i) return promotersFull.push('');
              const promoter = await this.promoterService.getPromoterById(i);
              if (promoter) promotersFull.push(`${promoter.serialNumber} ${promoter.displayName}`);
            });
          }

          const promoterDisplayPromoterNamesWithSerialNumber = promotersFull.map((i) => i).join(' / ');

          const promotersFullCurrent = [];
          let promoterDisplayPromoterNamesWithSerialNumberCurrent = 'NON IN RETE';

          if (nodeOriginalPeriod && nodeOriginalPeriod.displayPromoterNamesIds.length > 0) {
            // eslint-disable-next-line consistent-return
            await nodeOriginalPeriod.displayPromoterNamesIds.forEachAsync(async (i) => {
              if (!i) return promotersFullCurrent.push('');
              const promoter = await this.promoterService.getPromoterById(i);
              if (promoter) promotersFullCurrent.push(`${promoter.serialNumber} ${promoter.displayName}`);
            });

            promoterDisplayPromoterNamesWithSerialNumberCurrent = promotersFullCurrent.map((i) => i).join(' / ');
          }

          let ape = 0;
          if (p.uniquePremium) {
            ape = p.uniquePremium / 1000;
          } else if (p.praticeType === 'Incasso') {
            ape = 0;
          } else {
            ape = p.recurringPremium / 100;
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
            approvalDate: p.approvalDate,
            effectProductivePeriod: `${p.effectProductivePeriodMonth}/${p.effectProductivePeriodYear}`,
            statusName: p.statusName,
            emitDate: p.emitDate,
            premiumNet: p.premiumNet / 100,
            premiumGross: p.premiumGross / 100,
            optionId: p.optionId,
            installmentsPerYear: numberToRate(p.installmentsPerYear),
            commissionSacrifice: p.commissionSacrifice,
            iv: p.iv / 100,
            promoterDisplayName: `${promoterObject ? promoterObject.serialNumber : ''} ${
              promoterObject ? promoterObject.displayName : ''
            }`,
            promoterDisplayHierarchy: p.promoterDisplayHierarchy,
            promoterRoleId: roleId,
            promoterDisplayPromoterNames: promoterDisplayPromoterNamesWithSerialNumber,
            unique: p.unique,
            adequacy: p.adequacy,
            postForce: p.postForce,
            paymentMode: p.paymentMode ? p.paymentMode.value : '',
            uniquePremium: p.uniquePremium / 100,
            recurringPremium: p.recurringPremium / 100,
            loading: Number.parseFloat(p.loading || 0),
            amountPaid: p.amountPaid / 100,
            years: p.years,
            praticeIdentifier: p.legacyViewId,
            ape,
            nomeDM: `${districtManager ? districtManager.serialNumber : ''} ${
              districtManager ? districtManager.displayName : ''
            }`,
            nomeBM: `${branchManager ? branchManager.serialNumber : ''} ${
              branchManager ? branchManager.displayName : ''
            }`,
            nomeTM: `${teamManager ? teamManager.serialNumber : ''} ${teamManager ? teamManager.displayName : ''}`,
            branch: p.branch,
            praticeType: p.praticeType,
            payable: p.isPayable,
            fiscalCode,
            currentPromoter: `${currentPromoter ? currentPromoter.serialNumber : ''} ${
              currentPromoter ? currentPromoter.displayName : ''
            }`,
            promoterDisplayPromoterNamesWithSerialNumberCurrent,
          });
        });

        return {
          headers: [
            { field: 'practiceId', position: 0, translation: 'Numero Pratica' },
            { field: 'contractId', position: 1, translation: 'Numero Contratto' },
            { field: 'companyName', position: 2, translation: 'Azienda' },
            { field: 'productName', position: 3, translation: 'Nome Prodotto' },
            { field: 'praticeIdentifier', position: 4, translation: 'Pratica Identifier' },
            { field: 'approvalDate', position: 5, translation: 'Data Approvazione' },
            { field: 'effectDate', position: 6, translation: 'Data decorrenza' },
            { field: 'effectProductivePeriod', position: 7, translation: 'Periodo Produttivo' },
            { field: 'uniquePremium', position: 8, translation: 'Premio Unico' },
            { field: 'recurringPremium', position: 9, translation: 'Premio Ricorrente' },
            { field: 'ape', position: 10, translation: 'APE' },
            { field: 'years', position: 11, translation: 'Durata del contratto' },
            { field: 'insuredName', position: 12, translation: 'Contraente' },
            { field: 'nomeDM', position: 13, translation: 'nomeDM' },
            { field: 'nomeBM', position: 14, translation: 'nomeBM' },
            { field: 'nomeTM', position: 15, translation: 'nomeTM' },
            { field: 'promoterDisplayName', position: 16, translation: 'Promotore' },
            { field: 'promoterDisplayPromoterNames', position: 17, translation: 'Responsabili' },
            { field: 'promoterRoleId', position: 18, translation: 'Ruolo' },
            { field: 'branch', position: 19, translation: 'Filiale' },
            { field: 'iv', position: 20, translation: 'IV' },
            { field: 'statusName', position: 21, translation: 'Stato Pratica' },
            { field: 'postForce', position: 22, translation: 'Stato Post Vigore' },
            { field: 'praticeType', position: 23, translation: 'Tipo Pratica' },
            { field: 'amountPaid', position: 24, translation: 'Importo Versato' },
            { field: 'payable', position: 25, translation: 'Pagabile' },
            { field: 'installmentsPerYear', position: 26, translation: 'Frazionamento' },
            { field: 'loading', position: 27, translation: 'Caricamento' },
            { field: 'paymentMode', position: 28, translation: 'Modalità di Pagamento' },
            { field: 'fiscalCode', position: 29, translation: 'Codice Fiscale' },
            { field: 'promoterDisplayHierarchy', position: 30, translation: 'Rete' },
            { field: 'commissionSacrifice', position: 31, translation: 'Sacrificio' },
            { field: 'lastModifiedDate', position: 32, translation: 'Data ultima modifica' },
            { field: 'createdDate', position: 33, translation: 'Data di creazione' },
            { field: 'premiumNet', position: 34, translation: 'Premio netto' },
            { field: 'premiumGross', position: 35, translation: 'Premio lordo' },
            { field: 'emitDate', position: 36, translation: 'Data primo invio' },
            { field: 'adequacy', position: 37, translation: 'Stato Adeguatezza' },
            { field: 'optionId', position: 38, translation: 'Opzioni' },
            { field: 'currentPromoter', position: 38, translation: 'Promotore Attuale' },
            {
              field: 'promoterDisplayPromoterNamesWithSerialNumberCurrent',
              position: 38,
              translation: 'Responsabili Attuale',
            },
          ],
          data: rows,
        };
      })
      .then((data) => Promise.resolve(excelReport(data)))
      .then((buffer) =>
        this.documentService.addDocument(
          {
            type: documentTypes.DOSSIERS,
            ownerId: 'SYSTEM',
            displayName: `Export_produzione_${moment(new Date())
              .utcOffset('+0200')
              .format('DD_MM_YYYY')
              .toString()}.xlsx`,
            locked: true,
            additionalData: {
              exportId,
              export: true,
            },
          },
          buffer,
        ),
      );
  }

  insertSeed() {
    return installmentRepository.insertSeed(this.mongodb, seed);
  }

  createIndexes() {
    return installmentRepository.createIndexes(this.mongodb);
  }
}

module.exports = KpiService;
