const { v4: uuid } = require('uuid');
const Int64 = require('mongodb').Long;
const { unparse: uuidunparse } = require('uuid-parse');
const practiceRepository = require('./practice-repository');
const NetworkService = require('../network-srv');
const dossierInsurerRepository = require('../dossier-insurer-srv/dossier-insurer-repository');
const { parse, unparse } = require('../../utils/productive-period-helper');
const { uuidToBinary } = require('../../utils/uuid-to-binary');
const Practice = require('./practice');

class PracticeService {
  constructor(mongodb, s3Client = null) {
    this.mongodb = mongodb;
    this.networkService = new NetworkService(this.mongodb);
    this.s3Client = s3Client;
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

    const startPeriod = parse(
      productivePeriodRange.fromProductivePeriodYear,
      productivePeriodRange.fromProductivePeriodMonth,
    );
    const endPeriod = parse(
      productivePeriodRange.toProductivePeriodYear,
      productivePeriodRange.toProductivePeriodMonth,
    );

    if (type !== 'direct') {
      for (let i = startPeriod; i <= endPeriod; i += 1) {
        const { productivePeriodYear, productivePeriodMonth } = unparse(i);

        // eslint-disable-next-line no-await-in-loop
        const nextNetworkIds = await this.networkService.getNetworkListIdByPromoterAndPeriod(
          networkId,
          promoterId,
          type === 'indirect',
          productivePeriodYear,
          i,
        );

        promoterFilterAnd.push({
          productivePeriodYear,
          productivePeriodMonth,
          networkNodeId: { $in: [...nextNetworkIds] },
        });
      }

      // eslint-disable-next-line no-await-in-loop
      dossierAndPromoterIds = await dossierInsurerRepository.getIdsAndPromoterByPromoterFilter(this.mongodb, {
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
   * @param {string} id
   * @returns {Promise<Practice>}
   */
  getPracticeById(id) {
    return practiceRepository.getById(this.mongodb, id);
  }

  /**
   * @param {string} id
   * @returns {Promise<Practice>}
   */
  getPracticeByUuid(id) {
    return practiceRepository.getByUuid(this.mongodb, id);
  }

  /**
   * @param {string} id
   * @param {number} iv
   */
  updateIVById(id, iv) {
    return practiceRepository.updateIVById(this.mongodb, id, iv);
  }

  /**
   * @param {string} id
   * @returns {Promise<Practice>}
   */
  getPracticeSubscriptionById(id) {
    return practiceRepository.getSubscriptionById(this.mongodb, id);
  }

  /**
   * @param {string} id
   * @returns {Promise<Practice>}
   */
  getPracticeSubscriptionByIdLegacy(id) {
    return practiceRepository.getSubscriptionByIdLegacy(this.mongodb, id);
  }

  /**
   * @param {string} id
   * @returns {Promise<Practice>}
   */
  getOneByDossierId(id) {
    return practiceRepository.getOneByDossierId(this.mongodb, id);
  }

  /**
   * @param {string} contractId
   * @returns {Promise<Practice>}
   */
  getSinglePracticeByContractId(contractId) {
    return practiceRepository.getSingleByContractId(this.mongodb, contractId);
  }

  /**
   * @param {string} id
   */
  getPracticeByIdOldStyle(id) {
    return practiceRepository.getByIdOldStyle(this.mongodb, id);
  }

  /**
   * @param {string} id
   */
  getPracticeByBinaryOldStyle(id) {
    return practiceRepository.getByBinaryIdOldStyle(this.mongodb, id);
  }

  /**
   * @param {string} contractId
   * @returns {Promise<Array<Practice>>}
   */
  getPracticesByContractId(contractId) {
    return practiceRepository.getByContractId(this.mongodb, contractId);
  }

  /**
   * @param {string} contractSearch
   * @returns {Promise<Array<Practice>>}
   */
  searchByContract(contractSearch) {
    return practiceRepository.searchByContract(this.mongodb, contractSearch);
  }

  /**
   * @param {string} customerId
   * @returns {Promise<Array<Practice>>}
   */
  getPracticesByCustomerId(customerId) {
    return practiceRepository.getByCustomerId(this.mongodb, customerId);
  }

  /**
   * @param {string} promoterId
   * @param {object} productivePeriodRange
   * @param {string} group
   * @returns {Promise<Array<Practice>>}
   */
  async getByPromoterIdAndProductiveRange(promoterId, productivePeriodRange, group = 'all') {
    const firstNode = await this.networkService.getFirstNodePeriod(
      productivePeriodRange.currentProductivePeriodYear,
      productivePeriodRange.currentProductivePeriodMonth,
    );

    if (!firstNode) throw new Error(`Node not found for ${promoterId}`);

    const dossierAndPromoterIds = await this.prepareNetworkFilterIds(
      firstNode.model._id,
      promoterId,
      productivePeriodRange,
      group,
    );

    const dossierIds = new Set(dossierAndPromoterIds.map((el) => el.dossierId));
    const filter = {
      'DatiBase.NumeroProposta': { $in: [...dossierIds] },
    };

    return practiceRepository.getByPromoterIdAndProductiveRange(
      this.mongodb,
      filter,
      promoterId,
      productivePeriodRange,
    );
  }

  /**
   * @param {string} dossierFilter
   * @param {object} productivePeriodRange
   * @returns {any}
   */
  countByDossierFilterAndProductiveRange(dossierFilter, productivePeriodRange) {
    return practiceRepository.countByDossierFilterAndProductiveRange(
      this.mongodb,
      dossierFilter,
      productivePeriodRange,
    );
  }

  /**
   * @param {object} dossierFilter
   * @returns {Promise<object>}
   */
  countCustomerIdContractsByDossierFilterAndProductiveRange(dossierFilter) {
    return practiceRepository.countCustomerIdContractsByDossierFilterAndProductiveRange(this.mongodb, dossierFilter);
  }

  /**
   * @param {object} dossierFilter
   * @returns {Promise<object>}
   */
  countCustomerIdProductionByDossierFilterAndProductiveRange(dossierFilter) {
    return practiceRepository.countCustomerIdProductionByDossierFilterAndProductiveRange(this.mongodb, dossierFilter);
  }

  /**
   * @param {object} dossierFilter
   * @returns {Promise<object>}
   */
  countCustomerIdProposalsByDossierFilterAndProductiveRange(dossierFilter) {
    return practiceRepository.countCustomerIdProposalsByDossierFilterAndProductiveRange(this.mongodb, dossierFilter);
  }

  /**
   * @param {object} dossierFilter
   * @returns {Promise<object>}
   */
  countCustomerIdPackageByDossierFilterAndProductiveRange(dossierFilter) {
    return practiceRepository.countCustomerIdPackageByDossierFilterAndProductiveRange(this.mongodb, dossierFilter);
  }

  /**
   * @param {object} dossierFilter
   * @returns {Promise<object>}
   */
  countCustomerIdNegativeByDossierFilterAndProductiveRange(dossierFilter) {
    return practiceRepository.countCustomerIdNegativeByDossierFilterAndProductiveRange(this.mongodb, dossierFilter);
  }

  /**
   * @param {object} dossierFilter
   * @returns {Promise<object>}
   */
  sumContractsByDossierFilterAndProductiveRange(dossierFilter) {
    return practiceRepository.sumContractsByDossierFilterAndProductiveRange(this.mongodb, dossierFilter);
  }

  /**
   * @param {object} dossierFilter
   * @returns {Promise<object>}
   */
  sumProductionByDossierFilterAndProductiveRange(dossierFilter) {
    return practiceRepository.sumProductionByDossierFilterAndProductiveRange(this.mongodb, dossierFilter);
  }

  /**
   * @param {object} dossierFilter
   * @returns {Promise<object>}
   */
  sumPackageByDossierFilterAndProductiveRange(dossierFilter) {
    return practiceRepository.sumPackageByDossierFilterAndProductiveRange(this.mongodb, dossierFilter);
  }

  /**
   * @param {object} dossierFilter
   * @returns {Promise<object>}
   */
  sumOverdueByDossierFilterAndProductiveRange(dossierFilter) {
    return practiceRepository.sumOverdueByDossierFilterAndProductiveRange(this.mongodb, dossierFilter);
  }

  /**
   * @param {object} dossierFilter
   * @returns {Promise<object>}
   */
  sumNegativeByDossierFilterAndProductiveRange(dossierFilter) {
    return practiceRepository.sumNegativeByDossierFilterAndProductiveRange(this.mongodb, dossierFilter);
  }

  /**
   * @param {object} dossierFilter
   * @returns {Promise<object>}
   */
  sumProposalsByDossierFilterAndProductiveRange(dossierFilter) {
    return practiceRepository.sumProposalsByDossierFilterAndProductiveRange(this.mongodb, dossierFilter);
  }

  /**
   * @param {object} dossierFilter
   * @param {number} skip
   * @param {number} count
   * @returns {Promise<object>}
   */
  listContractsByDossierFilterAndProductiveRange(dossierFilter, skip, count) {
    return practiceRepository.listContractsByDossierFilterAndProductiveRange(this.mongodb, dossierFilter, skip, count);
  }

  /**
   * @param {object} dossierFilter
   * @param {number} skip
   * @param {number} count
   * @returns {Promise<object>}
   */
  listProductionByDossierFilterAndProductiveRange(dossierFilter, skip, count) {
    return practiceRepository.listProductionByDossierFilterAndProductiveRange(this.mongodb, dossierFilter, skip, count);
  }

  /**
   * @param {object} dossierFilter
   * @param {number} skip
   * @param {number} count
   * @returns {Promise<object>}
   */
  listProductionExportByDossierFilterAndProductiveRange(dossierFilter, skip, count) {
    return practiceRepository.listProductionExportByDossierFilterAndProductiveRange(
      this.mongodb,
      dossierFilter,
      skip,
      count,
    );
  }

  /**
   * @param {object} dossierFilter
   * @param {number} skip
   * @param {number} count
   * @returns {Promise<object>}
   */
  listProsposalsByDossierFilterAndProductiveRange(dossierFilter, skip, count) {
    return practiceRepository.listProposalsByDossierFilterAndProductiveRange(this.mongodb, dossierFilter, skip, count);
  }

  /**
   * @param {object} dossierFilter
   * @param {number} skip
   * @param {number} count
   * @returns {Promise<object>}
   */
  listPackageByDossierFilterAndProductiveRange(dossierFilter, skip, count) {
    return practiceRepository.listPackageByDossierFilterAndProductiveRange(this.mongodb, dossierFilter, skip, count);
  }

  /**
   * @param {object} dossierFilter
   * @param {number} skip
   * @param {number} count
   * @returns {Promise<object>}
   */
  listOverdueByDossierFilterAndProductiveRange(dossierFilter, skip, count) {
    return practiceRepository.listOverdueByDossierFilterAndProductiveRange(this.mongodb, dossierFilter, skip, count);
  }

  /**
   * @param {object} dossierFilter
   * @param {number} skip
   * @param {number} count
   * @returns {Promise<object>}
   */
  listNegativeByDossierFilterAndProductiveRange(dossierFilter, skip, count) {
    return practiceRepository.listNegativeByDossierFilterAndProductiveRange(this.mongodb, dossierFilter, skip, count);
  }

  /**
   * @param {string} promoterId
   * @param {object} productivePeriod
   * @param {string} group
   * @returns {Promise<Array<Practice>>}
   */
  async getByPromoterIdAndProductivePeriod(promoterId, productivePeriod, group = 'all') {
    const firstNode = await this.networkService.getFirstNodePeriod(
      productivePeriod.currentProductivePeriodYear,
      productivePeriod.currentProductivePeriodMonth,
    );

    const currentPeriod = {
      fromProductivePeriodYear: productivePeriod.currentProductivePeriodYear,
      fromProductivePeriodMonth: productivePeriod.currentProductivePeriodMonth,
      toProductivePeriodYear: productivePeriod.currentProductivePeriodYear,
      toProductivePeriodMonth: productivePeriod.currentProductivePeriodMonth,
      currentProductivePeriodYear: productivePeriod.currentProductivePeriodYear,
      currentProductivePeriodMonth: productivePeriod.currentProductivePeriodMonth,
    };

    if (!firstNode) throw new Error(`Node not found for ${promoterId}`);

    const dossierAndPromoterIds = await this.prepareNetworkFilterIds(
      firstNode.model._id,
      promoterId,
      currentPeriod,
      group,
    );

    const dossierIds = new Set(dossierAndPromoterIds.map((el) => el.dossierId));
    const filter = {
      'DatiBase.NumeroProposta': { $in: [...dossierIds] },
    };

    return practiceRepository.getByPromoterIdAndProductivePeriod(this.mongodb, filter, promoterId, currentPeriod);
  }

  /**
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   */
  getPracticesByProductivePeriod(productivePeriodYear, productivePeriodMonth) {
    return practiceRepository.getByProductivePeriod(this.mongodb, productivePeriodYear, productivePeriodMonth);
  }

  /**
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @returns {Promise<object>}
   */
  getAllPracticesByProductivePeriod(productivePeriodYear, productivePeriodMonth) {
    return practiceRepository.getAllByProductivePeriod(this.mongodb, productivePeriodYear, productivePeriodMonth);
  }

  /**
   * @returns {Promise<object>}
   */
  getAllPractices() {
    return practiceRepository.getAll(this.mongodb);
  }

  getAllPracticesCursor() {
    return practiceRepository.getAllCursor(this.mongodb);
  }

  getCustomerIDPracticesCursor(customerId) {
    return practiceRepository.getCustomerCursor(this.mongodb, customerId);
  }

  /**
   * @param {object} body
   */
  createPractice(body) {
    return practiceRepository.create(this.mongodb, body);
  }

  /**
   * @param {object} body
   */
  createPracticeAdditionalIncome(body) {
    return practiceRepository.createAdditionaIncome(this.mongodb, body);
  }

  createMandatoCliente({
    insured,
    promoterId,
    attachmentCodiceFiscale,
    attachmentIdentity,
    attachmentMandato,
    identity,
  }) {
    return this.mongodb
      .collection('MandatoCliente')
      .insertOne({
        _id: uuidToBinary(uuid()),
        CreatedOn: new Date(),
        ModifiedOn: new Date(),
        Enabled: true,
        DisabledOn: null,
        CreatedByIdentifier: null,
        StatoPubblicazione: {
          value: 'Pubblicato',
          key: Int64.fromInt(2),
        },
        ExpiresOn: new Date('0001-01-01T00:49:56.000+00:45'),
        IsSync: false,
        StatoApprovazione: {
          value: 'Approvato',
          key: Int64.fromInt(2),
        },
        DataApprovazione: new Date(),
        ApprovazioneIdentifier: uuidToBinary(promoterId),
        RuoloApprovazione: {
          value: 'Direzione',
          key: Int64.fromInt(7),
        },
        NomeApprovatore: 'D0027 GIAMPAOLO VALVO',
        CustomerIdentifier: uuidToBinary(insured.uuid),
        ProduttoreIdentifier: uuidToBinary(promoterId),
        NomeProduttore: 'Nome Produttore',
        NumeroMandato: '000000',
        DataFirma: new Date(),
        Allegati: [
          {
            AttachmentIdentifier: attachmentIdentity._id,
            Tipo: 'Documento identità',
            Descrizione: 'carta-identita.pdf',
            DataScadenza: identity.expiryDate,
            ModifiedOn: null,
            CheckDirezione: null,
            NomeFile: 'carta-identita.pdf',
            DataEmissioneDocumento: identity.issueDate,
            NumeroDocumento: 'ax8224196',
            TipoDocumento: {
              value: 'Carta d’identità',
              key: Int64.fromInt(1),
            },
            ClienteIdentifier: null,
            Aggiornato: false,
          },
          {
            AttachmentIdentifier: attachmentCodiceFiscale._id,
            Tipo: 'Codice Fiscale',
            Descrizione: 'Codice-fiscale.pdf',
            DataScadenza: null,
            ModifiedOn: null,
            CheckDirezione: null,
            NomeFile: 'Codice-fiscale.pdf',
            DataEmissioneDocumento: null,
            NumeroDocumento: null,
            TipoDocumento: null,
            ClienteIdentifier: null,
            Aggiornato: false,
          },
          {
            AttachmentIdentifier: attachmentMandato._id,
            Tipo: 'Mandato',
            Descrizione: 'Mandato.pdf',
            DataScadenza: null,
            ModifiedOn: null,
            CheckDirezione: null,
            NomeFile: 'Mandato.pdf',
            DataEmissioneDocumento: null,
            NumeroDocumento: null,
            TipoDocumento: null,
            ClienteIdentifier: null,
            Aggiornato: false,
          },
        ],
        VisionatoTm: false,
        Motivazioni: null,
        AssegnatoAIdentifier: null,
        ApprovazioneIntermedia: {
          ApprovazioneIdentifier: uuidToBinary(promoterId),
          StatoApprovazione: {
            value: 'Da approvare',
            key: Int64.fromInt(1),
          },
          DataCreazione: new Date(),
          DataApprovazione: null,
          NomeApprovatore: null,
          RuoloApprovazione: {
            value: 'Branch Manager',
            key: Int64.fromInt(5),
          },
        },
        Nome: 'massimo',
        Cognome: 'merli',
        CodiceFiscale: 'mrlmsm74m13f205p',
        PartitaIva: null,
        IsPersonaFisica: true,
        DataRevoca: null,
        CustomerReferences: [],
        NomeCliente: 'massimo merli',
      })
      .then((result) => {
        if (!result.result.ok) return Promise.reject(new Error('Impossibile inserire MandatoCliente'));
        return Promise.resolve(result.ops[0]);
      });
  }

  createPrivacyCliente({ insured, promoterId, attachmentPrivacy }) {
    return this.mongodb
      .collection('PrivacyCliente')
      .insertOne({
        _id: uuidToBinary(uuid()),
        CreatedOn: new Date(),
        ModifiedOn: new Date(),
        Enabled: true,
        DisabledOn: null,
        CreatedByIdentifier: null,
        StatoPubblicazione: {
          value: 'Pubblicato',
          key: Int64.fromInt(2),
        },
        ExpiresOn: new Date('0001-01-01T00:49:56.000+00:45'),
        IsSync: false,
        StatoApprovazione: {
          value: 'Approvato',
          key: Int64.fromInt(2),
        },
        DataApprovazione: new Date(),
        ApprovazioneIdentifier: uuidToBinary(promoterId),
        RuoloApprovazione: {
          value: 'Direzione',
          key: Int64.fromInt(7),
        },
        NomeApprovatore: 'D0027 GIAMPAOLO VALVO',
        CustomerIdentifier: uuidToBinary(insured.uuid),
        ProduttoreIdentifier: uuidToBinary(promoterId),
        NomeProduttore: 'Nome Produttore',
        DataFirma: new Date(),
        Allegati: [
          {
            AttachmentIdentifier: attachmentPrivacy._id,
            Tipo: 'Privacy',
            Descrizione: 'privacy.pdf',
            DataScadenza: null,
            ModifiedOn: null,
            CheckDirezione: null,
            NomeFile: 'privacy.pdf',
            DataEmissioneDocumento: null,
            NumeroDocumento: null,
            ClienteIdentifier: null,
          },
        ],
        VisionatoTm: false,
        Motivazioni: null,
        AssegnatoAIdentifier: null,
        ApprovazioneIntermedia: {
          ApprovazioneIdentifier: uuidToBinary(promoterId),
          StatoApprovazione: {
            value: 'Da approvare',
            key: Int64.fromInt(1),
          },
          DataCreazione: new Date(),
          DataApprovazione: null,
          NomeApprovatore: null,
          RuoloApprovazione: {
            value: 'Branch Manager',
            key: Int64.fromInt(5),
          },
        },
        Nome: 'massimo',
        Cognome: 'merli',
        CodiceFiscale: 'mrlmsm74m13f205p',
        PartitaIva: null,
        IsPersonaFisica: true,
        DataRevoca: null,
        CustomerReferences: [],
        NomeCliente: 'massimo merli',
      })
      .then((result) => {
        if (!result.result.ok) return Promise.reject(new Error('Impossibile inserire MandatoCliente'));
        return Promise.resolve(result.ops[0]);
      });
  }

  async createAttachment({ promoterId, bucket, path, fileName }) {
    const id = uuid();
    const _id = uuidToBinary(uuid());

    return this.mongodb
      .collection('Attachment')
      .insertOne({
        _id,
        CreatedOn: new Date(),
        ModifiedOn: new Date(),
        Enabled: true,
        DisabledOn: null,
        CreatedByIdentifier: uuidToBinary(promoterId),
        StatoPubblicazione: {
          value: 'Bozza',
          key: Int64.fromInt(0),
        },
        ExpiresOn: new Date('0001-01-01T00:49:56.000+00:45'),
        IsSync: false,
        Name: fileName,
        Bytes: null,
        MimeType: 'application/pdf',
        Url: `https://s3.eu-west-1.amazonaws.com/${bucket}/${path}`,
        LocalPath: '',
        UseAWSS3: true,
      })
      .then(async (result) => {
        if (!result.result.ok) return Promise.reject(new Error('Impossibile inserire Attachment'));

        let docCopyPromise = Promise.resolve();
        if (!this.s3Client) return Promise.reject(new Error('S3 Client undefined'));
        const thisID = uuidunparse(result.ops[0]._id.buffer);
        const msId = thisID.split('-');
        const msId1 = msId[0].slice(6, 8) + msId[0].slice(4, 6) + msId[0].slice(2, 4) + msId[0].slice(0, 2);
        const msId2 = msId[1].slice(2, 4) + msId[1].slice(0, 2);
        const msId3 = msId[2].slice(2, 4) + msId[2].slice(0, 2);
        const Key = `${msId1}-${msId2}-${msId3}-${msId[3]}-${msId[4]}`;
        // @ts-ignore
        docCopyPromise = this.s3Client
          .copyObject({
            CopySource: `/${bucket}/${path}`,
            Bucket: process.env.AWS_S3_LEGACY_BUCKET_NAME_DOCUMENTS,
            Key,
          })
          .promise();
        // eslint-disable-next-line promise/no-nesting
        await docCopyPromise
          // eslint-disable-next-line promise/always-return
          .then(() => {
            // eslint-disable-next-line no-console
            console.log('ok copyObject createAttachment S3');
            // eslint-disable-next-line no-console
            console.log(id);
            // eslint-disable-next-line no-console
            console.log(Key);
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log('errore createAttachment S3');
            // eslint-disable-next-line no-console
            console.log(id);
            // eslint-disable-next-line no-console
            console.log(Key);
            // eslint-disable-next-line no-console
            console.log(error);
          });

        return Promise.resolve(result.ops[0]);
      });
  }

  createIndexes() {
    return practiceRepository.createIndexes(this.mongodb);
  }
}

module.exports = PracticeService;
