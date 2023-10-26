const S3 = require('aws-sdk/clients/s3');
const moment = require('moment');
const { Binary } = require('mongodb');
const Customer = require('./customer');
const CustomerSync = require('./customer-sync');
const IdentityCard = require('./identity-card');
const IdentityCardSync = require('./identity-card-sync');
const customerRepository = require('./customer-repository');
const NetworkService = require('../network-srv');
const DocumentService = require('../document-srv');
const PracticeService = require('../practice-srv');
const CustomerInsurerService = require('../customer-insurer-srv');
const customerInsurerRepository = require('../customer-insurer-srv/customer-insurer-repository');
const DocumentObject = require('../document-srv/document');
const { seed } = require('./seed/customer');
const { uuidToBinary } = require('../../utils/uuid-to-binary');
const roleIds = require('../promoter-job-srv/role-ids');
const { excelReport } = require('../excel-report-srv');
const { types: documentTypes } = require('../document-srv/document-types');
const { translateRoleId } = require('../promoter-job-srv/role-ids');

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

class CustomerService {
  constructor(mongodb) {
    this.mongodb = mongodb;
    this.networkService = new NetworkService(mongodb);
    this.practiceService = new PracticeService(mongodb);
    this.customerInsurerService = new CustomerInsurerService(mongodb);

    const s3Client = new S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || '',
    });
    this.documentService = new DocumentService(mongodb, process.env.AWS_S3_BUCKET_NAME_DOCUMENTS || '', s3Client);
  }

  /**
   * @param {string} networkId
   * @param {string | undefined} promoterId
   * @param {object} productivePeriodRange
   * @param {string} type
   * @returns {Promise<object>}
   */
  async prepareNetworkFilterIds(networkId, promoterId, productivePeriodRange, type) {
    let customerAndPromoterIds = [];
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

        promoterFilterAnd.push({ productivePeriodMonth: i, networkNodeId: { $in: [...nextNetworkIds] } });
      }

      // eslint-disable-next-line no-await-in-loop
      customerAndPromoterIds = await customerInsurerRepository.getIdsAndPromoterByPromoterFilter(this.mongodb, {
        productivePeriodYear: productivePeriodRange.fromProductivePeriodYear,
        $or: promoterFilterAnd,
      });
    } else {
      let filterCustomers = {
        productivePeriodYear: productivePeriodRange.fromProductivePeriodYear,
        $and: [
          { productivePeriodMonth: { $gte: productivePeriodRange.fromProductivePeriodMonth } },
          { productivePeriodMonth: { $lte: productivePeriodRange.toProductivePeriodMonth } },
        ],
      };

      // eslint-disable-next-line max-len
      filterCustomers = promoterId
        ? { ...filterCustomers, promoterId }
        : { ...filterCustomers, networkNodeId: networkId };

      // eslint-disable-next-line no-await-in-loop
      customerAndPromoterIds = await customerInsurerRepository.getIdsAndPromoterByPromoterFilter(
        this.mongodb,
        filterCustomers,
      );
    }

    return customerAndPromoterIds;
  }

  /**
   * @param {string} customerId
   * @returns {Promise<Customer>}
   */
  getCustomerById(customerId) {
    return customerRepository.getById(this.mongodb, customerId);
  }

  /**
   * @param {string} customerId
   */
  deleteCustomerById(customerId) {
    return customerRepository.deleteById(this.mongodb, customerId);
  }

  /**
   * @param {object} body
   */
  createCustomer(body) {
    return customerRepository.create(this.mongodb, body);
  }

  /**
   * @param {object} customer
   */
  updateCustomer(customer) {
    return customerRepository.update(this.mongodb, customer);
  }

  /**
   * @param {object} customer
   */
  updateCustomerDocument(customer) {
    return customerRepository.updateDocument(this.mongodb, customer);
  }

  /**
   * @param {object} customer
   */
  updateCustomerLegalPerson(customer) {
    return customerRepository.updateLegalPerson(this.mongodb, customer);
  }

  /**
   * @param {number} skip
   * @param {number} limit
   * @param {object} filter
   * @returns {Promise<Array<Customer>>}
   */
  async getCustomers(skip = 0, limit = 0, filter = {}) {
    return customerRepository.getAll(this.mongodb, skip, limit, filter);
  }

  /**
   * @param {number} skip
   * @param {number} limit
   * @param {object} filter
   * @returns {Promise<Array<CustomerSync>>}
   */
  async getCustomersForSync(skip = 0, limit = 0, filter = {}) {
    return customerRepository.getAllForSync(this.mongodb, skip, limit, filter);
  }

  /**
   * @param {number} skip
   * @param {number} limit
   * @param {object} filter
   * @param {object} filterIdCard
   * @param {boolean} nosort
   * @returns {Promise<Array<IdentityCard>>}
   */
  async getCustomersIdentityCardsPrivacy(skip = 0, limit = 0, filter = {}, filterIdCard = {}, nosort = false) {
    return customerRepository.getAllIdentityCardsPrivacy(this.mongodb, skip, limit, filter, filterIdCard, nosort);
  }

  /**
   * @returns {Promise<Array<IdentityCardSync>>}
   */
  async getCustomersIdentityCardsNoFilterPrivacy() {
    return customerRepository.getAllIdentityCardsNoFilterPrivacy(this.mongodb);
  }

  /**
   * @param {number} skip
   * @param {number} limit
   * @param {object} filter
   * @param {object} filterIdCard
   * @param {boolean} nosort
   * @returns {Promise<Array<IdentityCard>>}
   */
  async getCustomersIdentityCardsMandato(skip = 0, limit = 0, filter = {}, filterIdCard = {}, nosort = false) {
    return customerRepository.getAllIdentityCardsMandato(this.mongodb, skip, limit, filter, filterIdCard, nosort);
  }

  /**
   * @returns {Promise<Array<IdentityCardSync>>}
   */
  async getCustomersIdentityCardsNoFilterMandato() {
    return customerRepository.getAllIdentityCardsNoFilterMandato(this.mongodb);
  }

  /**
   * @param {Array<string>} customerIds
   * @returns {Promise<Array<Customer>>}
   */
  getByIds(customerIds) {
    return customerRepository.getByIds(this.mongodb, customerIds);
  }

  /**
   * @param {object} firstNode
   * @param {number} myRoleId
   * @param {string} myUserId
   * @param {string} promoterId
   * @param {string} networkId
   * @param {string} type
   * @param {number} fromProductivePeriodYear
   * @param {number} fromProductivePeriodMonth
   * @param {number} toProductivePeriodYear
   * @param {number} toProductivePeriodMonth
   * @returns {Promise<Array<Binary> | undefined>}
   */
  async getCustomerIds(
    firstNode,
    myRoleId,
    myUserId,
    promoterId,
    networkId,
    type,
    fromProductivePeriodYear,
    fromProductivePeriodMonth,
    toProductivePeriodYear,
    toProductivePeriodMonth,
  ) {
    const promoterToQuery = myUserId === promoterId ? undefined : promoterId;

    if (
      !promoterToQuery &&
      myRoleId >= 7 &&
      !networkId &&
      !type &&
      fromProductivePeriodYear === new Date().getFullYear() &&
      fromProductivePeriodMonth === new Date().getMonth() + 1
    )
      // eslint-disable-next-line unicorn/no-useless-undefined
      return undefined;

    const customerAndPromoterIds = await this.prepareNetworkFilterIds(
      networkId || firstNode.model._id,
      promoterToQuery,
      {
        fromProductivePeriodYear,
        fromProductivePeriodMonth,
        toProductivePeriodYear,
        toProductivePeriodMonth,
        currentProductivePeriodYear: new Date().getFullYear(),
        currentProductivePeriodMonth: new Date().getMonth() + 1,
      },
      type,
    );

    const customerIDs = new Set(customerAndPromoterIds.map((el) => uuidToBinary(el.customerId)));

    return [...customerIDs];
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
   * @param {number} status
   * @param {string} networkId
   * @param {string} type
   * @param {number} fromProductivePeriodYear
   * @param {number} fromProductivePeriodMonth
   * @param {number} toProductivePeriodYear
   * @param {number} toProductivePeriodMonth
   * @returns {Promise<DocumentObject>}
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async exportCustomers(
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
  ) {
    const firstNode = await this.networkService.userCanSeeProductivePeriod(
      myRoleId,
      myUserId,
      promoterId,
      toProductivePeriodYear,
      toProductivePeriodMonth,
    );
    const customerIDs = await this.getCustomerIds(
      firstNode,
      myRoleId,
      myUserId,
      promoterId,
      networkId,
      type,
      fromProductivePeriodYear,
      fromProductivePeriodMonth,
      toProductivePeriodYear,
      toProductivePeriodMonth,
    );

    const previousWeek = moment().add(-1, 'weeks');
    const today = moment();
    const customerfilter = {
      ...(searchCustomer
        ? {
            NomeCompleto: { $regex: searchCustomer, $options: 'i' },
          }
        : {}),
      ...(customerIDs
        ? {
            _id: { $in: [...customerIDs] },
          }
        : {}),
      ...(birthday
        ? {
            $expr: {
              $and: [
                { $lte: [{ $dayOfYear: '$DataDiNascita' }, { $dayOfYear: today.toDate() }] },
                { $gte: [{ $dayOfYear: '$DataDiNascita' }, { $dayOfYear: previousWeek.toDate() }] },
                { $ne: [{ $year: '$DataDiNascita' }, 1] },
              ],
            },
          }
        : {}),
      ...getTypeFilter(contactType),
      ...getStatusFilter(status),
    };

    return (
      this.getCustomers(0, 0, customerfilter)
        // eslint-disable-next-line sonarjs/cognitive-complexity
        .then(async (customers) => {
          const nodeList = await this.networkService.getNetworkListFlatPeriod(
            myRoleId,
            myUserId,
            productivePeriodYear,
            productivePeriodMonth,
            true,
          );

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
          const rows = [];
          // @ts-ignore
          await customers.forEachAsync(async (p) => {
            const filter = {
              'DatiBase.ClienteIdentifier': uuidToBinary(p._id),
            };

            const contractList = await this.practiceService.listContractsByDossierFilterAndProductiveRange(
              filter,
              0,
              0,
            );
            const contrattiInVigore = contractList.length;

            let contrattiAssociati = '';
            if (contractList.length > 0) {
              contractList.forEach((element, index, array) => {
                // eslint-disable-next-line max-len
                contrattiAssociati =
                  index === array.length - 1
                    ? `${contrattiAssociati} ${element.contractId}`
                    : `${contrattiAssociati} ${element.contractId},`;
              });
            }

            const projectionMandato = {
              _id: true,
              Allegati: true,
              StatoApprovazione: true,
              DataApprovazione: true,
              NomeApprovatore: true,
              NomeProduttore: true,
              DataFirma: true,
              DataRevoca: true,
              NumeroMandato: true,
            };

            // eslint-disable-next-line promise/no-nesting
            const mandate = await this.mongodb
              .collection('MandatoCliente')
              .findOne({ CustomerIdentifier: uuidToBinary(p._id) }, { projectionMandato })
              .then((record) => record)
              .catch((error) => error);

            let checkMandato = '';
            if (mandate) {
              const found = mandate.Allegati.some((el) => el.CheckDirezione === null);
              if (found) {
                checkMandato = 'no check';
              } else {
                checkMandato = 'no check';
                if (mandate.Allegati) {
                  // @ts-ignore
                  // eslint-disable-next-line prefer-spread
                  checkMandato = moment(
                    new Date(
                      // eslint-disable-next-line prefer-spread
                      Math.max.apply(
                        Math,
                        mandate.Allegati.map((o) => o.CheckDirezione),
                      ),
                    ),
                  )
                    .format('DD/MM/YYYY')
                    .toString();
                }
              }
            }

            const projectionPrivacy = {
              _id: true,
              Allegati: true,
              DataFirma: true,
              DataRevoca: true,
              AccettaPrivacyAssicurativa: true,
              AccettaPrivacyCommerciale: true,
              AccettaPrivacyProfilazione: true,
            };

            // eslint-disable-next-line promise/no-nesting
            const privacy = await this.mongodb
              .collection('PrivacyCliente')
              .find({ CustomerIdentifier: uuidToBinary(p._id) }, { projectionPrivacy })
              .sort({ DataApprovazione: -1 })
              .toArray()
              .then((x) => (x && x.length > 0 ? x[0] : null))
              .catch((error) => error);

            let checkPrivacy = '';
            if (privacy) {
              const foundPrivacy = privacy.Allegati.some((el) => el.CheckDirezione === null);
              if (foundPrivacy) {
                checkPrivacy = 'no check';
              } else {
                checkPrivacy = 'no check';
                if (privacy.Allegati) {
                  // @ts-ignore
                  // eslint-disable-next-line prefer-spread
                  checkPrivacy = moment(
                    new Date(
                      // eslint-disable-next-line prefer-spread
                      Math.max.apply(
                        Math,
                        privacy.Allegati.map((o) => o.CheckDirezione),
                      ),
                    ),
                  )
                    .format('DD/MM/YYYY')
                    .toString();
                }
              }
            }

            // eslint-disable-next-line no-await-in-loop
            const customerInsurer = await this.customerInsurerService.getCustomerInsurer(
              p._id,
              productivePeriodYear,
              productivePeriodMonth,
            );

            let networkHierarchy = 'Nodo non trovato';
            let promoterName = 'Nessuno';
            let roleId = roleIds.NONE;
            const nodeOriginalPeriod = nodeList.find((el) => el._id === customerInsurer.networkNodeId);
            if (nodeOriginalPeriod) {
              networkHierarchy = nodeOriginalPeriod.displayHierarchy;
              promoterName = nodeOriginalPeriod.validPromoterName;
              const thisJob = jobs.find((job) => job.promoterId === nodeOriginalPeriod.validPromoterId);
              if (thisJob) roleId = thisJob.roleId;
            }

            roleId = roleId ? await translateRoleId(this.mongodb, roleId) : 'Nessuno';
            let birthDate = '';

            if (p.birthDate && new Date(p.birthDate) >= new Date('0002-01-01')) {
              birthDate = moment(p.birthDate).utcOffset('+0200').format('DD/MM/YYYY');
            }

            rows.push({
              displayHierarchy: networkHierarchy,
              promoterName: promoterName || '',
              ruolo: roleId,
              nome: p.name,
              cognome: p.surname,
              email: p.email,
              fiscalCode: p.fiscalCode,
              birthDate,
              isPersonaFisica: p.physicalPerson,
              cellulare: p.mobilePhone,
              telefono: p.fixedPhone,
              status: p.statusDisplayValue,
              priority: p.priorityDisplayValue,
              createdOn: p.created,
              modifiedOn: p.modified,
              contrattiAssociati,
              contrattiInVigore: contrattiInVigore || 0,
              indirizzo: `${p.address.route ? p.address.route : ''} ${
                p.address.streetNumber ? p.address.streetNumber : ''
              }`,
              cap: p.address.postalCode,
              citta: p.address.city,
              mandateNumber: mandate ? mandate.NumeroMandato : '',
              // eslint-disable-next-line no-nested-ternary
              stateApproved: mandate ? (mandate.StatoApprovazione ? mandate.StatoApprovazione.value : '') : '',
              dateApproved: mandate ? mandate.DataApprovazione : '',
              nameProducer: mandate ? mandate.NomeProduttore : '',
              nameApprover: mandate ? mandate.NomeApprovatore : '',
              dateSign: mandate ? mandate.DataFirma : '',
              dateRevoca: mandate ? mandate.DataRevoca : '',
              checkMandato,
              dateSignPrivacy: privacy ? privacy.DataFirma : '',
              dateRevocaPrivacy: privacy ? privacy.DataRevoca : '',
              // eslint-disable-next-line no-nested-ternary
              accettaPrivacyAssicurativa: privacy ? (privacy.AccettaPrivacyAssicurativa ? 'si' : 'no') : '',
              // eslint-disable-next-line no-nested-ternary
              accettaPrivacyCommerciale: privacy ? (privacy.AccettaPrivacyCommerciale ? 'si' : 'no') : '',
              // eslint-disable-next-line no-nested-ternary
              accettaPrivacyProfilazione: privacy ? (privacy.AccettaPrivacyProfilazione ? 'si' : 'no') : '',
              checkPrivacy,
            });
          });
          if (edition === 'sheltia')
            return {
              headers: [
                { field: 'displayHierarchy', position: 3, translation: 'Rete' },
                { field: 'promoterName', position: 4, translation: 'Nome promotore' },
                { field: 'ruolo', position: 5, translation: 'Ruolo' },
                { field: 'nome', position: 10, translation: 'Nome' },
                { field: 'cognome', position: 11, translation: 'Cognome' },
                { field: 'email', position: 12, translation: 'Email' },
                { field: 'fiscalCode', position: 13, translation: 'Codice Fiscale' },
                { field: 'birthDate', position: 14, translation: 'Data di nascita' },
                { field: 'isPersonaFisica', position: 16, translation: 'IsPersonaFisica' },
                { field: 'cellulare', position: 17, translation: 'Cellulare' },
                { field: 'telefono', position: 18, translation: 'Telefono' },
                { field: 'status', position: 19, translation: 'Status' },
                { field: 'priority', position: 20, translation: 'Priority' },
                { field: 'createdOn', position: 21, translation: 'CreatedOn' },
                { field: 'modifiedOn', position: 22, translation: 'ModifiedOn' },
                { field: 'contrattiAssociati', position: 23, translation: 'ContrattiAssociati' },
                { field: 'contrattiInVigore', position: 24, translation: 'ContrattiInVigore' },
                { field: 'indirizzo', position: 25, translation: 'Indirizzo' },
                { field: 'cap', position: 26, translation: 'Cap' },
                { field: 'citta', position: 27, translation: 'Citta' },
                { field: 'mandateNumber', position: 30, translation: 'Numero Mandato' },
                { field: 'stateApproved', position: 31, translation: 'Stato Approvazione' },
                { field: 'dateApproved', position: 32, translation: 'Data Approvazione' },
                { field: 'nameProducer', position: 33, translation: 'Nome Produttore' },
                { field: 'nameApprover', position: 34, translation: 'Nome Approvatore' },
                { field: 'dateSign', position: 35, translation: 'Data Firma' },
                { field: 'dateRevoca', position: 36, translation: 'Data Revoca' },
                { field: 'checkMandato', position: 37, translation: 'Check Mandato' },
                { field: 'dateSignPrivacy', position: 43, translation: 'Data Firma Privacy' },
                { field: 'dateRevocaPrivacy', position: 44, translation: 'Data Revoca Privacy' },
                { field: 'accettaPrivacyAssicurativa', position: 45, translation: 'AccettaPrivacyAssicurativa' },
                { field: 'accettaPrivacyCommerciale', position: 46, translation: 'AccettaPrivacyCommerciale' },
                { field: 'accettaPrivacyProfilazione', position: 47, translation: 'AccettaPrivacyProfilazione' },
                { field: 'checkPrivacy', position: 48, translation: 'Check Privacy' },
              ],
              data: rows,
            };
          return {
            headers: [
              { field: 'displayHierarchy', position: 3, translation: 'Rete' },
              { field: 'promoterName', position: 4, translation: 'Nome promotore' },
              { field: 'ruolo', position: 5, translation: 'Ruolo' },
              { field: 'nome', position: 10, translation: 'Nome' },
              { field: 'cognome', position: 11, translation: 'Cognome' },
              { field: 'email', position: 12, translation: 'Email' },
              { field: 'fiscalCode', position: 13, translation: 'Codice Fiscale' },
              { field: 'birthDate', position: 14, translation: 'Data di nascita' },
              { field: 'isPersonaFisica', position: 16, translation: 'IsPersonaFisica' },
              { field: 'cellulare', position: 17, translation: 'Cellulare' },
              { field: 'telefono', position: 18, translation: 'Telefono' },
              { field: 'status', position: 19, translation: 'Status' },
              { field: 'priority', position: 20, translation: 'Priority' },
              { field: 'createdOn', position: 21, translation: 'CreatedOn' },
              { field: 'modifiedOn', position: 22, translation: 'ModifiedOn' },
              { field: 'contrattiAssociati', position: 23, translation: 'ContrattiAssociati' },
              { field: 'contrattiInVigore', position: 24, translation: 'ContrattiInVigore' },
              { field: 'indirizzo', position: 25, translation: 'Indirizzo' },
              { field: 'cap', position: 26, translation: 'Cap' },
              { field: 'citta', position: 27, translation: 'Citta' },
              { field: 'dateSignPrivacy', position: 43, translation: 'Data Firma Privacy' },
              { field: 'dateRevocaPrivacy', position: 44, translation: 'Data Revoca Privacy' },
              { field: 'accettaPrivacyAssicurativa', position: 45, translation: 'AccettaPrivacyAssicurativa' },
              { field: 'accettaPrivacyCommerciale', position: 46, translation: 'AccettaPrivacyCommerciale' },
              { field: 'accettaPrivacyProfilazione', position: 47, translation: 'AccettaPrivacyProfilazione' },
              { field: 'checkPrivacy', position: 48, translation: 'Check Privacy' },
            ],
            data: rows,
          };
        })
        .then((data) => Promise.resolve(excelReport(data)))
        .then((buffer) =>
          this.documentService.addDocument(
            {
              type: documentTypes.CUSTOMERS,
              ownerId: myUserId,
              displayName: `export-clienti.xlsx`,
              locked: true,
              additionalData: {
                exportId,
                export: true,
              },
            },
            buffer,
          ),
        )
    );
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
   * @param {number} status
   * @param {string} networkId
   * @param {string} type
   * @param {number} fromProductivePeriodYear
   * @param {number} fromProductivePeriodMonth
   * @param {number} toProductivePeriodYear
   * @param {number} toProductivePeriodMonth
   * @param {string} expired
   * @param {string} complete
   * @returns {Promise<DocumentObject>}
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async exportCustomersIdentityCards(
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
    expired,
    complete,
  ) {
    const firstNode = await this.networkService.userCanSeeProductivePeriod(
      myRoleId,
      myUserId,
      promoterId,
      toProductivePeriodYear,
      toProductivePeriodMonth,
    );
    const customerIDs = await this.getCustomerIds(
      firstNode,
      myRoleId,
      myUserId,
      promoterId,
      networkId,
      type,
      fromProductivePeriodYear,
      fromProductivePeriodMonth,
      toProductivePeriodYear,
      toProductivePeriodMonth,
    );

    const nextMonth = moment().add(1, 'months');
    const today = moment();
    const filter = {
      ...(searchCustomer
        ? {
            NomeCliente: { $regex: searchCustomer, $options: 'i' },
          }
        : {}),
      ...(customerIDs
        ? {
            CustomerIdentifier: { $in: [...customerIDs] },
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

    const customerPromise =
      edition === 'tcw'
        ? this.getCustomersIdentityCardsPrivacy(0, 0, filter, filterIdCard, true)
            .then((items) => items)
            .catch((error) => error)
        : this.getCustomersIdentityCardsMandato(0, 0, filter, filterIdCard, true)
            .then((items) => items)
            .catch((error) => error);

    return customerPromise
      .then(async (customers) => {
        const nodeList = await this.networkService.getNetworkListFlatPeriod(
          myRoleId,
          myUserId,
          toProductivePeriodYear,
          toProductivePeriodMonth,
          true,
        );

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
        const rows = [];
        // @ts-ignore
        await customers.forEachAsync(async (p) => {
          // eslint-disable-next-line no-await-in-loop
          const customerInsurer = await this.customerInsurerService.getCustomerInsurer(
            p._id,
            toProductivePeriodYear,
            toProductivePeriodMonth,
          );

          // eslint-disable-next-line no-await-in-loop
          const customer = await this.getCustomerById(p._id);

          let networkHierarchy = 'Nodo non trovato';
          let promoterName = 'Nessuno';
          let roleId = roleIds.NONE;
          const nodeOriginalPeriod = nodeList.find((el) => el._id === customerInsurer.networkNodeId);
          if (nodeOriginalPeriod) {
            networkHierarchy = nodeOriginalPeriod.displayHierarchy;
            promoterName = nodeOriginalPeriod.validPromoterName;
            const thisJob = jobs.find((job) => job.promoterId === nodeOriginalPeriod.validPromoterId);
            if (thisJob) roleId = thisJob.roleId;
          }

          roleId = roleId ? await translateRoleId(this.mongodb, roleId) : 'Nessuno';

          rows.push({
            displayHierarchy: networkHierarchy,
            promoterName: promoterName || '',
            ruolo: roleId,
            nome: customer.name,
            cognome: customer.surname,
            email: customer.email,
            fiscalCode: customer.fiscalCode,
            isPersonaFisica: customer.physicalPerson,
            cellulare: customer.mobilePhone,
            telefono: customer.fixedPhone,
            status: customer.statusDisplayValue,
            priority: customer.priorityDisplayValue,
            createdOn: customer.created,
            modifiedOn: customer.modified,
            indirizzo: `${customer.address.route ? customer.address.route : ''} ${
              customer.address.streetNumber ? customer.address.streetNumber : ''
            }`,
            cap: customer.address.postalCode,
            citta: customer.address.city,
            identityCardType: p.identityCardType,
            identityCardNumber: p.identityCardNumber,
            identityCardIssueDate: p.identityCardIssueDate,
            identityCardExpiryDate: p.identityCardExpiryDate,
          });
        });
        if (edition === 'sheltia')
          return {
            headers: [
              { field: 'displayHierarchy', position: 3, translation: 'Rete' },
              { field: 'promoterName', position: 4, translation: 'Nome promotore' },
              { field: 'ruolo', position: 5, translation: 'Ruolo' },
              { field: 'nome', position: 10, translation: 'Nome' },
              { field: 'cognome', position: 11, translation: 'Cognome' },
              { field: 'email', position: 12, translation: 'Email' },
              { field: 'fiscalCode', position: 13, translation: 'Codice Fiscale' },
              { field: 'isPersonaFisica', position: 16, translation: 'IsPersonaFisica' },
              { field: 'cellulare', position: 17, translation: 'Cellulare' },
              { field: 'telefono', position: 18, translation: 'Telefono' },
              { field: 'status', position: 19, translation: 'Status' },
              { field: 'priority', position: 20, translation: 'Priority' },
              { field: 'createdOn', position: 21, translation: 'CreatedOn' },
              { field: 'modifiedOn', position: 22, translation: 'ModifiedOn' },
              { field: 'indirizzo', position: 25, translation: 'Indirizzo' },
              { field: 'cap', position: 26, translation: 'Cap' },
              { field: 'citta', position: 27, translation: 'Citta' },
              { field: 'identityCardType', position: 50, translation: 'Tipo Documento' },
              { field: 'identityCardNumber', position: 51, translation: 'Numero Documento' },
              { field: 'identityCardIssueDate', position: 52, translation: 'Data Emissione Documento' },
              { field: 'identityCardExpiryDate', position: 53, translation: 'Data Scadenza Documento' },
            ],
            data: rows,
          };
        return {
          headers: [
            { field: 'displayHierarchy', position: 3, translation: 'Rete' },
            { field: 'promoterName', position: 4, translation: 'Nome promotore' },
            { field: 'ruolo', position: 5, translation: 'Ruolo' },
            { field: 'nome', position: 10, translation: 'Nome' },
            { field: 'cognome', position: 11, translation: 'Cognome' },
            { field: 'email', position: 12, translation: 'Email' },
            { field: 'fiscalCode', position: 13, translation: 'Codice Fiscale' },
            { field: 'isPersonaFisica', position: 16, translation: 'IsPersonaFisica' },
            { field: 'cellulare', position: 17, translation: 'Cellulare' },
            { field: 'telefono', position: 18, translation: 'Telefono' },
            { field: 'status', position: 19, translation: 'Status' },
            { field: 'priority', position: 20, translation: 'Priority' },
            { field: 'createdOn', position: 21, translation: 'CreatedOn' },
            { field: 'modifiedOn', position: 22, translation: 'ModifiedOn' },
            { field: 'indirizzo', position: 25, translation: 'Indirizzo' },
            { field: 'cap', position: 26, translation: 'Cap' },
            { field: 'citta', position: 27, translation: 'Citta' },
            { field: 'identityCardType', position: 50, translation: 'Tipo Documento' },
            { field: 'identityCardNumber', position: 51, translation: 'Numero Documento' },
            { field: 'identityCardIssueDate', position: 52, translation: 'Data Emissione Documento' },
            { field: 'identityCardExpiryDate', position: 53, translation: 'Data Scadenza Documento' },
          ],
          data: rows,
        };
      })
      .then((data) => Promise.resolve(excelReport(data)))
      .then((buffer) =>
        this.documentService.addDocument(
          {
            type: documentTypes.CUSTOMERS,
            ownerId: myUserId,
            displayName: `export-documenti-identita.xlsx`,
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
    return customerRepository.insertSeed(this.mongodb, seed);
  }

  createIndexes() {
    return customerRepository.createIndexes(this.mongodb);
  }
}

module.exports = CustomerService;
