const Mongo = require('mongodb');
const Int64 = require('mongodb').Long;
const { unparse } = require('uuid-parse');
const { v4: uuid } = require('uuid');
const { uuidToBinary } = require('../../utils/uuid-to-binary');
const Practice = require('./practice');
const productivePeriodHelper = require('../../utils/productive-period-helper');
const { types: practiceTypes } = require('./practice-types');
const { status: practiceStatus } = require('./practice-status');
const { filterTypes } = require('./filter-types');

const COLLECTION_NAME = 'BasePraticaApprovable';
const PROJECTION = {
  _t: true,
  CreatedOn: true,
  ModifiedOn: true,
  DatiBase: true,
  'DettaglioPratica.CodiceProdotto': true,
  'DettaglioPratica.CodiceSocieta': true,
  'DettaglioPratica.PremioLordo': true,
  'DettaglioPratica.PremioNetto': true,
  'DettaglioPratica.PremioUnico': true,
  'DettaglioPratica.PremioRicorrente': true,
  'DettaglioPratica.ImportoIncassato': true,
  'DettaglioPratica.GaranziaPrincipale.DurataDaInputAnni': true,
  'DettaglioPratica.GaranziaPrincipale.DurataPagamentoPremi': true,
  'DettaglioPratica.GaranziaPrincipale.PremioUnico': true,
  'DettaglioPratica.GaranziaPrincipale.PremioRicorrente': true,
  'DettaglioPratica.GaranziaPrincipale.PremioNettoUnico': true,
  'DettaglioPratica.GaranziaPrincipale.PremioNettoRicorrente': true,
  'DettaglioPratica.GaranziaPrincipale.ImportoVersato': true,
  'DettaglioPratica.GaranziaPrincipale.OpzioneLiquidity': true,
  'DettaglioPratica.GaranziaPrincipale.OpzioneContrattualeMultinvest': true,
  'DettaglioPratica.ModalitaPagamento': true,
  'DettaglioPratica.Contraenti': true,
  'DettaglioPratica.IsPayable': true,
  'DettaglioPratica.IsSolaLettura': true,
  'DettaglioPratica.IsInviabile': true,
  DatiProdotto: true,
  DatePratica: true,
  StatoCorrente: true,
  StatoAdeguatezza: true,
  StatoPostVigore: true,
  TipoPratica: true,
};

function mapInstallmentsPerYear(x) {
  if (!x) return 1;
  switch (x.key) {
    case 1:
      return 12;
    case 2:
      return 6;
    case 3:
      return 4;
    case 4:
      return 3;
    case 5:
      return 2;
    case 6:
    default:
      return 1;
  }
}

function getViewCustomerLegacy(id) {
  const msId = id.split('-');
  const msId1 = msId[0].slice(6, 8) + msId[0].slice(4, 6) + msId[0].slice(2, 4) + msId[0].slice(0, 2);
  const msId2 = msId[1].slice(2, 4) + msId[1].slice(0, 2);
  const msId3 = msId[2].slice(2, 4) + msId[2].slice(0, 2);
  return `${msId1}-${msId2}-${msId3}-${msId[3]}-${msId[4]}`;
}

function mapType(x) {
  switch (x) {
    case 'PraticaSottoscrizione':
      return practiceTypes.SUBSCRIPTION;
    case 'PraticaVersamentoAggiuntivo':
      return practiceTypes.ADDITIONAL_INCOME;
    case 'PraticaFuoriSacco':
      return practiceTypes.SPECIAL;
    case 'PraticaRiscattoParziale':
      return practiceTypes.PARTIAL_RANSOM;
    case 'PraticaRiscattoTotale':
      return practiceTypes.TOTAL_RANSOM;
    case 'PraticaIncasso':
      return practiceTypes.CASH_IN;
    default:
      return practiceTypes.NONE;
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function mapSubscriptionCommissioningOption(x) {
  const productId = unparse(x.DatiProdotto.ProdottoIdentifier.buffer);

  /**
   * If is additional income, return ADDITIONAL-INCOME as option.
   * Exception: Multinvest Extra uses the subscription config for additional income.
   */
  if (mapType(x._t) === practiceTypes.ADDITIONAL_INCOME && productId !== '86bfb5a8-fb72-d44a-a509-a63300ed10a8') {
    return 'ADDITIONAL-INCOME';
  }

  const Y =
    x.DettaglioPratica && x.DettaglioPratica.GaranziaPrincipale
      ? x.DettaglioPratica.GaranziaPrincipale.DurataDaInputAnni
      : 1;
  const durationYears = !Y ? 1 : Y;
  /* eslint no-fallthrough: 0 */
  switch (productId) {
    // CF Proteggi Reddito Platinum
    case '686265c8-f050-f245-a197-a9a700e9fc93':
    // CF Prospettiva Valore
    case '0213c3d2-67a9-5c41-8ff5-a9a9012b549c':
    // CF CPI Mutui Protetti 2016
    case '301cb22e-5d7e-7c4d-987b-a9a900d1ee42':
    // CF Wellfare
    case '2875c557-825f-524d-8006-a82700d57b8c':
    // Equilibrio Unico Gold 2017
    case 'f3d84519-606b-9e44-8f1a-a8e600c1169e':
    // Prenditi Cura LTC
    case 'e35495de-c565-2841-bbf1-a90d00c788ac':
    // Siamo in Due
    case '94e39df5-d6f5-0241-b50b-a827010234c7':
    // Insieme al Volante
    case 'ff7d25b9-82de-2343-b637-a8c800ae829e':
    // Proteggi Reddito Smart
    case 'c7ca79a5-34de-ba41-8b46-a8f000e46508':
    // Cose & Casa
    case '2ed884b0-1b9b-8e40-b44c-a90f00d94a8f':
    // Prospettiva Domani 2018
    case 'f1f845e9-c6f3-e747-8918-a8a40095cdf3':
    // Sei coperto Easy
    case 'b6150df9-6cf5-b64a-92bf-a9490093ce23':
    // Prospettiva Investimento 2017
    case 'b8937bc5-7f16-534e-87de-a92a00a827e5':
    // Domani Sicuro Plus ULPIP & IUPIP
    case 'e89de2ef-921e-2a42-84df-198b7a4705df':
    // CF Incendio Mutuo GB10
    case '510066fb-b964-b64f-a328-a90f00e0d9e2':
    // CF Proteggi Reddito FA
    case '768f387b-aa4c-1b4d-a8e2-a8b300dda977':
    // Zurich Target Solution - Premio Unico
    case '45211e22-e984-9841-88b1-a9c700fb72a9':
      return 'DEFAULT';

    // Pensiamoci Insieme
    case 'bbe284b1-4c25-5246-bb0f-a92900cb9466':
    // ZIntegra Unico
    case 'd57e5303-931f-b948-9f0e-a5af011ff7d9':
      return durationYears < 10 ? `${durationYears}-YEARS` : '10-PLUS-YEARS';

    // Young Doppio Bonus
    case 'af64bd17-184a-4044-a16d-fc204fa7829f':
      return durationYears < 20 ? `${durationYears}-YEARS` : '20-PLUS-YEARS';

    // ZIntegra Annuo
    case '714fac83-2971-1440-99d3-a5af011af6a5': {
      const installments = mapInstallmentsPerYear(x.DatiBase.RateizzazionePremio);
      return durationYears < 20 ? `${durationYears}-YEARS-${installments}-IpY` : `20-PLUS-YEARS-${installments}-IpY`;
    }

    // Risparmio & Investimento
    case 'ed347f25-de2c-874f-896a-a72000dcb789':
    // CF Prospettiva Valore 2019
    case '0aba3fc5-2887-084d-a7e7-aa330086e46c':
    // CF Impresa Accumulo
    case '68dfa58c-ebb8-4e3a-ad8c-93318bdc424c':
    // italiana Feelgood
    case '8590169c-343d-4903-8899-4d605156bd6c':
    // opportunity plan
    case '18774834-8e2c-4dd5-8ba5-768550100c4e':
      return durationYears < 24 ? `${durationYears}-YEARS` : '24-PLUS-YEARS';

    // Progetto
    case '209ab66a-e62f-6f4c-835c-a63400b70b8f': {
      const years = durationYears < 19 ? `${durationYears}-YEARS` : '19-PLUS-YEARS';
      const sacrifice = Math.trunc(Number.parseFloat(x.DatiBase.CommissionSacrifice));
      if (sacrifice === 1) return `COMMISSION-SACRIFICE-1-${years}`;
      if (sacrifice === 2) return `COMMISSION-SACRIFICE-2-${years}`;
      return `FULL-PRICING-${years}`;
    }

    // MultiInvest Extra
    case '86bfb5a8-fb72-d44a-a509-a63300ed10a8': {
      const opt =
        x.DettaglioPratica &&
        x.DettaglioPratica.GaranziaPrincipale &&
        x.DettaglioPratica.GaranziaPrincipale.OpzioneContrattualeMultinvest
          ? x.DettaglioPratica.GaranziaPrincipale.OpzioneContrattualeMultinvest
          : 'A';
      return `OPTION-${opt}`;
    }

    // Contopolizza Hybrid
    case 'f62916a1-a87c-3744-a9e8-a84a00b6b37d':
      return x.DettaglioPratica.GaranziaPrincipale.OpzioneLiquidity === true ? 'LIQUIDITY' : 'DEFAULT';

    default:
      return 'DEFAULT';
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function mapPractice(x) {
  const type = mapType(x._t);
  let years = 1;
  let premiumNet = 0;
  let premiumGross = 0;
  let recurringPremium = 0;
  let uniquePremium = 0;
  let amountPaid = 0;

  // eslint-disable-next-line unicorn/prefer-switch
  if (type === practiceTypes.SUBSCRIPTION) {
    years = x.DettaglioPratica.GaranziaPrincipale.DurataPagamentoPremi || 1;
    premiumNet = Math.trunc(
      (Number.parseFloat(x.DettaglioPratica.GaranziaPrincipale.PremioNettoUnico || 0) +
        Number.parseFloat(x.DettaglioPratica.GaranziaPrincipale.PremioNettoRicorrente || 0)) *
        100,
    );
    premiumGross = Math.trunc(
      (Number.parseFloat(x.DettaglioPratica.GaranziaPrincipale.PremioRicorrente || 0) +
        Number.parseFloat(x.DettaglioPratica.GaranziaPrincipale.PremioUnico || 0)) *
        100,
    );
    recurringPremium =
      Math.trunc(Number.parseFloat(x.DettaglioPratica.GaranziaPrincipale.PremioRicorrente || 0) * 100) ||
      Number.parseFloat(x.DatiBase.PremioRicorrente);
    uniquePremium =
      Math.trunc(Number.parseFloat(x.DettaglioPratica.GaranziaPrincipale.PremioUnico || 0) * 100) ||
      Number.parseFloat(x.DatiBase.PremioUnico);
    amountPaid =
      Math.trunc(Number.parseFloat(x.DettaglioPratica.GaranziaPrincipale.ImportoVersato || 0) * 100) ||
      Number.parseFloat(x.DatiBase.ImportoIncassato);
  } else if (
    type === practiceTypes.ADDITIONAL_INCOME ||
    type === practiceTypes.CASH_IN ||
    type === practiceTypes.PARTIAL_RANSOM ||
    type === practiceTypes.TOTAL_RANSOM
  ) {
    premiumNet = Math.trunc(Number.parseFloat(x.DettaglioPratica.PremioNetto || 0) * 100);
    premiumGross = Math.trunc(Number.parseFloat(x.DettaglioPratica.PremioLordo || 0) * 100);
    recurringPremium = Math.round(Number.parseFloat(x.DatiBase.PremioRicorrente || 0) / 100);
    uniquePremium = Math.round(Number.parseFloat(x.DatiBase.PremioUnico || 0) / 100);
    amountPaid = Math.round(Number.parseFloat(x.DatiBase.ImportoIncassato || 0) / 100);
  } else if (type === practiceTypes.SPECIAL) {
    years = x.DettaglioPratica.DurataPagamentoPremi || 1;
    premiumNet = Math.trunc(
      Math.round(Number.parseFloat(x.DatiBase.PremioRicorrente || 0) / 100) +
        Math.round(Number.parseFloat(x.DatiBase.PremioUnico || 0) / 100),
    );
    premiumGross = Math.trunc(
      Math.round(Number.parseFloat(x.DatiBase.PremioRicorrente || 0) / 100) +
        Math.round(Number.parseFloat(x.DatiBase.PremioUnico || 0) / 100),
    );
    recurringPremium = Math.round(Number.parseFloat(x.DatiBase.PremioRicorrente || 0) / 100);
    uniquePremium =
      Math.trunc(Number.parseFloat(x.DettaglioPratica.PremioUnico || 0) * 100) ||
      Math.round(Number.parseFloat(x.DatiBase.PremioUnico || 0) / 100);
    amountPaid =
      Math.trunc(Number.parseFloat(x.DettaglioPratica.ImportoVersato || 0) * 100) ||
      Math.round(Number.parseFloat(x.DatiBase.ImportoIncassato || 0) / 100);
  }

  const termDate = new Date(x.DatePratica.Decorrenza);
  termDate.setUTCFullYear(termDate.getFullYear() + years);
  const termProductivePeriod = productivePeriodHelper.addMonths(
    productivePeriodHelper.parse(x.StatoCorrente.PeriodoProduttivo.Anno, x.StatoCorrente.PeriodoProduttivo.Mese),
    years * 12,
  );

  let paymentMode = '';
  if (x.DettaglioPratica.ModalitaPagamento) {
    paymentMode = x.DettaglioPratica.ModalitaPagamento;
    if (x.DettaglioPratica.ModalitaPagamento.ModalitaPagamento) {
      paymentMode = x.DettaglioPratica.ModalitaPagamento.ModalitaPagamento;
    }
  }

  let iban = '';
  if (x.DettaglioPratica.ModalitaPagamento && x.DettaglioPratica.ModalitaPagamento.DatiBancari) {
    iban = x.DettaglioPratica.ModalitaPagamento.DatiBancari.Iban;
  }

  const productId = unparse(x.DatiProdotto.ProdottoIdentifier.buffer);
  return new Practice({
    dossierId: x.DatiBase.NumeroProposta,
    practiceId: x.DatiBase.NumeroPratica,
    contractId: x.DatiBase.NumeroContratto,
    type,
    productId,
    productName: x.DatiProdotto.NomeProdotto,
    companyId: unparse(x.DatiProdotto.CompagniaIdentifier.buffer),
    companyName: x.DatiProdotto.NomeCompagnia,
    insuredName: x.DatiBase.NomeContraente,
    effectDate: x.DatePratica.Decorrenza,
    approvalDate: x.DatePratica.Approvazione,
    lastModifiedDate: x.ModifiedOn,
    createdDate: x.CreatedOn,
    emitDate: x.DatePratica.DataPrimoInvio,
    effectProductivePeriodYear: x.StatoCorrente.PeriodoProduttivo.Anno,
    effectProductivePeriodMonth: x.StatoCorrente.PeriodoProduttivo.Mese,
    status: x.StatoCorrente.Stato.key,
    statusName: x.StatoCorrente.Stato.value,
    adequacy: x.StatoAdeguatezza ? x.StatoAdeguatezza.key : 0,
    praticeType: x.TipoPratica ? x.TipoPratica.value : '',
    postForce: x.StatoPostVigore && x.StatoPostVigore.Stato ? x.StatoPostVigore.Stato.key : 0,
    termProductivePeriodYear: productivePeriodHelper.unparse(termProductivePeriod).productivePeriodYear,
    termProductivePeriodMonth: productivePeriodHelper.unparse(termProductivePeriod).productivePeriodMonth,
    termDate,
    premiumNet,
    premiumGross,
    optionId: mapSubscriptionCommissioningOption(x),
    // Always set commission sacrifice = 0 for Zurich Progetto
    commissionSacrifice:
      productId === '209ab66a-e62f-6f4c-835c-a63400b70b8f'
        ? 0
        : Math.trunc(Number.parseFloat(x.DatiBase.CommissionSacrifice || 0) * 100),
    installmentsPerYear: mapInstallmentsPerYear(x.DatiBase.RateizzazionePremio || 1),
    iv: Math.round(x.DatiBase.IndicatoreDiValore / 100),
    _id: unparse(x._id.buffer),
    legacyViewId: getViewCustomerLegacy(unparse(x._id.buffer)),
    customerId: unparse(x.DatiBase.ClienteIdentifier.buffer),
    unique: !!(x.DatiBase.TipoPremio && x.DatiBase.TipoPremio.key === 1),
    paymentMode,
    iban,
    loading: x.DatiBase.Caricamento,
    recurringPremium,
    uniquePremium,
    amountPaid,
    years,
    isPayable: x.DettaglioPratica.IsPayable,
    isReadonly: x.DettaglioPratica.IsSolaLettura,
    isSendable: x.DettaglioPratica.IsInviabile,
    customer: x.DettaglioPratica.Contraenti,
  });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} id
 * @returns {Promise<Practice>}
 */
function getById(mongodb, id) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ 'DatiBase.NumeroPratica': id }, { projection: PROJECTION })
    .then((x) => {
      if (!x) return Promise.reject(new Error('La pratica non esiste'));
      const result = mapPractice(x);
      return Promise.resolve(result);
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} id
 * @returns {Promise<Practice>}
 */
function getByUuid(mongodb, id) {
  return (
    mongodb
      .collection(COLLECTION_NAME)
      .findOne({ _id: uuidToBinary(id) }, { projection: PROJECTION })
      // eslint-disable-next-line sonarjs/no-identical-functions
      .then((x) => {
        if (!x) return Promise.reject(new Error('La pratica non esiste'));
        const result = mapPractice(x);
        return Promise.resolve(result);
      })
  );
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} id
 * @param {number} iv
 */
function updateIVById(mongodb, id, iv) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne({ 'DatiBase.NumeroPratica': id }, { $set: { 'DatiBase.IndicatoreDiValore': Int64.fromInt(iv) } })
    .then((result) => {
      if (!result.result.ok) return Promise.reject(new Error('Failed updating records'));
      return Promise.resolve();
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} id
 * @returns {Promise<Practice>}
 */
function getSubscriptionById(mongodb, id) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne(
      { 'DatiBase.NumeroProposta': id, _t: { $in: ['PraticaSottoscrizione', 'PraticaFuoriSacco'] } },
      { projection: PROJECTION },
    )
    .then((x) => {
      if (!x) return Promise.reject(new Error('La pratica non esiste'));
      return Promise.resolve(mapPractice(x));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} id
 * @returns {Promise<Practice>}
 */
function getSubscriptionByIdLegacy(mongodb, id) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ 'DatiBase.NumeroProposta': id, _t: { $in: ['PraticaSottoscrizione', 'PraticaFuoriSacco'] } })
    .then((x) => {
      if (!x) return Promise.reject(new Error('La pratica non esiste'));
      return Promise.resolve(x);
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} id
 * @returns {Promise<Practice>}
 */
function getOneByDossierId(mongodb, id) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne({ 'DatiBase.NumeroProposta': id }, { projection: PROJECTION })
    .then((x) => {
      if (!x) return Promise.reject(new Error('La pratica non esiste'));
      return Promise.resolve(mapPractice(x));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} contractId
 * @returns {Promise<Practice>}
 */
function getSingleByContractId(mongodb, contractId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne(
      { 'DatiBase.NumeroContratto': contractId, _t: { $in: ['PraticaSottoscrizione', 'PraticaFuoriSacco'] } },
      { projection: PROJECTION },
    )
    .then((x) => {
      if (!x) return Promise.reject(new Error('La pratica non esiste'));
      return Promise.resolve(mapPractice(x));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} contractSearch
 * @returns {Promise<Array<Practice>>}
 */
function searchByContract(mongodb, contractSearch) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ 'DatiBase.NumeroContratto': { $regex: contractSearch, $options: 'i' } }, { projection: PROJECTION })
    .toArray()
    .then((practices) => practices.map((practice) => mapPractice(practice)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} id
 */
function getByIdOldStyle(mongodb, id) {
  return mongodb
    .collection('BasePraticaApprovable')
    .findOne(
      { 'DatiBase.NumeroPratica': id },
      {
        projection: {
          _id: true,
          _t: true,
          DatiBase: true,
          'CommissioniAttive.Standard': true,
          'DatePratica.Decorrenza': true,
          'StatoCorrente.PeriodoProduttivo.Data': true,
        },
      },
    )
    .then((x) => {
      if (!x) return Promise.reject(new Error('La pratica non esiste'));
      return x;
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} id
 */
function getByBinaryIdOldStyle(mongodb, id) {
  return mongodb
    .collection('BasePraticaApprovable')
    .findOne(
      { _id: id },
      {
        projection: {
          _id: true,
          _t: true,
          DatiBase: true,
          DatePratica: true,
          DatiProdotto: true,
          'CommissioniAttive.Standard': true,
          'StatoCorrente.PeriodoProduttivo.Data': true,
        },
      },
    )
    .then((x) => {
      if (!x) return Promise.reject(new Error('La pratica non esiste'));
      return x;
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} contractId
 * @returns {Promise<Array<Practice>>}
 */
function getByContractId(mongodb, contractId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(
      {
        'DatiBase.NumeroContratto': contractId,
      },
      { projection: PROJECTION },
    )
    .toArray()
    .then((practices) => practices.map((practice) => mapPractice(practice)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} customerId
 * @returns {Promise<Array<Practice>>}
 */
function getByCustomerId(mongodb, customerId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(
      {
        'DatiBase.ClienteIdentifier': uuidToBinary(customerId),
      },
      { projection: PROJECTION },
    )
    .toArray()
    .then((practices) => practices.map((practice) => mapPractice(practice)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} filter
 * @param {string} promoterId
 * @param {object} productivePeriodRange
 * @returns {Promise<Array<Practice>>}
 */
function getByPromoterIdAndProductiveRange(mongodb, filter, promoterId, productivePeriodRange) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(
      {
        ...filter,
        _t: { $in: ['PraticaSottoscrizione', 'PraticaVersamentoAggiuntivo', 'PraticaFuoriSacco'] },
        'StatoCorrente.Stato.key': practiceStatus.IN_VIGORE,
        $and: [
          { 'StatoCorrente.PeriodoProduttivo.Anno': { $gte: productivePeriodRange.fromProductivePeriodYear } },
          { 'StatoCorrente.PeriodoProduttivo.Anno': { $lte: productivePeriodRange.toProductivePeriodYear } },
          {
            $or: [
              { 'StatoCorrente.PeriodoProduttivo.Mese': { $gte: productivePeriodRange.fromProductivePeriodMonth } },
              { 'StatoCorrente.PeriodoProduttivo.Anno': { $gt: productivePeriodRange.fromProductivePeriodYear } },
            ],
          },
          {
            $or: [
              { 'StatoCorrente.PeriodoProduttivo.Mese': { $lte: productivePeriodRange.toProductivePeriodMonth } },
              { 'StatoCorrente.PeriodoProduttivo.Anno': { $lt: productivePeriodRange.toProductivePeriodYear } },
            ],
          },
        ],
      },
      { projection: PROJECTION },
    )
    .toArray()
    .then((practices) => practices.map((practice) => mapPractice(practice)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} dossierFilter
 * @param {object} productivePeriodRange
 * @returns {any}
 */
function countByDossierFilterAndProductiveRange(mongodb, dossierFilter, productivePeriodRange) {
  return mongodb.collection(COLLECTION_NAME).countDocuments({
    ...dossierFilter,
    _t: { $in: ['PraticaSottoscrizione', 'PraticaVersamentoAggiuntivo', 'PraticaFuoriSacco'] },
    'StatoCorrente.Stato.key': practiceStatus.IN_VIGORE,
    'StatoCorrente.PeriodoProduttivo.Anno': productivePeriodRange.fromProductivePeriodYear,
    'StatoCorrente.PeriodoProduttivo.Mese': productivePeriodRange.fromProductivePeriodMonth,
  });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} dossierFilter
 * @returns {Promise<object>}
 */
function countCustomerIdContractsByDossierFilterAndProductiveRange(mongodb, dossierFilter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .aggregate([
      {
        $match: {
          ...filterTypes.contracts,
          ...dossierFilter,
        },
      },
      {
        $group: {
          _id: '$DatiBase.ClienteIdentifier',
          count: { $sum: 1 },
        },
      },
    ])
    .toArray()
    .then((result) => result.length);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} dossierFilter
 * @returns {Promise<object>}
 */
function countCustomerIdProductionByDossierFilterAndProductiveRange(mongodb, dossierFilter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .aggregate([
      {
        $match: {
          ...filterTypes.production,
          ...dossierFilter,
        },
      },
      {
        $group: {
          _id: '$DatiBase.ClienteIdentifier',
          count: { $sum: 1 },
        },
      },
    ])
    .toArray()
    .then((result) => result.length);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} dossierFilter
 * @returns {Promise<object>}
 */
function countCustomerIdProposalsByDossierFilterAndProductiveRange(mongodb, dossierFilter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .aggregate([
      {
        $match: {
          ...filterTypes.proposals,
          ...dossierFilter,
        },
      },
      {
        $group: {
          _id: '$DatiBase.ClienteIdentifier',
          count: { $sum: 1 },
        },
      },
    ])
    .toArray()
    .then((result) => result.length);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} dossierFilter
 * @returns {Promise<object>}
 */
function countCustomerIdPackageByDossierFilterAndProductiveRange(mongodb, dossierFilter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .aggregate([
      {
        $match: {
          ...filterTypes.package,
          ...dossierFilter,
        },
      },
      {
        $group: {
          _id: '$DatiBase.ClienteIdentifier',
          count: { $sum: 1 },
        },
      },
    ])
    .toArray()
    .then((result) => result.length);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} dossierFilter
 * @returns {Promise<object>}
 */
function countCustomerIdNegativeByDossierFilterAndProductiveRange(mongodb, dossierFilter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .aggregate([
      {
        $match: {
          ...filterTypes.negative,
          ...dossierFilter,
        },
      },
      {
        $group: {
          _id: '$DatiBase.ClienteIdentifier',
          count: { $sum: 1 },
        },
      },
    ])
    .toArray()
    .then((result) => result.length);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} dossierFilter
 * @returns {Promise<object>}
 */
function sumContractsByDossierFilterAndProductiveRange(mongodb, dossierFilter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .aggregate([
      {
        $match: {
          ...filterTypes.contracts,
          ...dossierFilter,
        },
      },
      {
        $group: {
          _id: null,
          premiumGross: { $sum: '$DatiBase.ImportoIncassato' },
          iv: { $sum: '$DatiBase.IndicatoreDiValore' },
          count: { $sum: 1 },
        },
      },
    ])
    .next();
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} dossierFilter
 * @returns {Promise<object>}
 */
function sumProductionByDossierFilterAndProductiveRange(mongodb, dossierFilter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .aggregate([
      {
        $match: {
          ...filterTypes.production,
          ...dossierFilter,
        },
      },
      {
        $group: {
          _id: null,
          premiumGross: { $sum: '$DatiBase.ImportoIncassato' },
          iv: { $sum: '$DatiBase.IndicatoreDiValore' },
          count: { $sum: 1 },
        },
      },
    ])
    .next();
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} dossierFilter
 * @returns {Promise<object>}
 */
function sumProposalsByDossierFilterAndProductiveRange(mongodb, dossierFilter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .aggregate([
      {
        $match: {
          ...filterTypes.proposals,
          ...dossierFilter,
        },
      },
      {
        $group: {
          _id: null,
          premiumGross: { $sum: '$DatiBase.ImportoIncassato' },
          iv: { $sum: '$DatiBase.IndicatoreDiValore' },
          count: { $sum: 1 },
        },
      },
    ])
    .next();
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} dossierFilter
 * @returns {Promise<object>}
 */
function sumPackageByDossierFilterAndProductiveRange(mongodb, dossierFilter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .aggregate([
      {
        $match: {
          ...filterTypes.package,
          ...dossierFilter,
        },
      },
      {
        $group: {
          _id: null,
          premiumGross: { $sum: '$DatiBase.ImportoIncassato' },
          iv: { $sum: '$DatiBase.IndicatoreDiValore' },
          count: { $sum: 1 },
        },
      },
    ])
    .next();
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} dossierFilter
 * @returns {Promise<object>}
 */
function sumOverdueByDossierFilterAndProductiveRange(mongodb, dossierFilter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .aggregate([
      {
        $match: {
          ...filterTypes.overdue,
          ...dossierFilter,
          'StatoPostVigore.PeriodoProduttivo.Anno': dossierFilter['StatoCorrente.PeriodoProduttivo.Anno'],
          $and: [
            {
              'StatoPostVigore.PeriodoProduttivo.Mese': {
                $gte: dossierFilter.$and[0]['StatoCorrente.PeriodoProduttivo.Mese'].$gte,
              },
            },
            {
              'StatoPostVigore.PeriodoProduttivo.Mese': {
                $lte: dossierFilter.$and[1]['StatoCorrente.PeriodoProduttivo.Mese'].$lte,
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          premiumGross: { $sum: '$DatiBase.ImportoIncassato' },
          iv: { $sum: '$DatiBase.IndicatoreDiValore' },
          count: { $sum: 1 },
        },
      },
    ])
    .next();
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} dossierFilter
 * @returns {Promise<object>}
 */
function sumNegativeByDossierFilterAndProductiveRange(mongodb, dossierFilter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .aggregate([
      {
        $match: {
          ...filterTypes.negative,
          ...dossierFilter,
        },
      },
      {
        $group: {
          _id: null,
          premiumGross: { $sum: '$DatiBase.ImportoIncassato' },
          iv: { $sum: '$DatiBase.IndicatoreDiValore' },
          count: { $sum: 1 },
        },
      },
    ])
    .next();
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} dossierFilter
 * @param {number} skip
 * @param {number} count
 * @returns {Promise<object>}
 */
function listContractsByDossierFilterAndProductiveRange(mongodb, dossierFilter, skip, count) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(
      {
        ...filterTypes.contracts,
        ...dossierFilter,
      },
      { projection: PROJECTION },
    )
    .skip(skip)
    .limit(count)
    .toArray()
    .then((practices) => practices.map((practice) => mapPractice(practice)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} dossierFilter
 * @param {number} skip
 * @param {number} count
 * @returns {Promise<object>}
 */
function listProductionByDossierFilterAndProductiveRange(mongodb, dossierFilter, skip, count) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(
      {
        ...filterTypes.production,
        ...dossierFilter,
      },
      { projection: PROJECTION },
    )
    .skip(skip)
    .limit(count)
    .toArray()
    .then((practices) => practices.map((practice) => mapPractice(practice)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} dossierFilter
 * @param {number} skip
 * @param {number} count
 * @returns {Promise<object>}
 */
function listProductionExportByDossierFilterAndProductiveRange(mongodb, dossierFilter, skip, count) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(
      {
        ...dossierFilter,
        'StatoCorrente.Stato.key': {
          $in: [practiceStatus.IN_VIGORE, practiceStatus.APPROVATA, practiceStatus.IN_ELABORAZIONE],
        },
      },
      { projection: PROJECTION },
    )
    .skip(skip)
    .limit(count)
    .toArray()
    .then((practices) => practices.map((practice) => mapPractice(practice)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} dossierFilter
 * @param {number} skip
 * @param {number} count
 * @returns {Promise<object>}
 */
function listProposalsByDossierFilterAndProductiveRange(mongodb, dossierFilter, skip, count) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(
      {
        ...filterTypes.proposals,
        ...dossierFilter,
      },
      { projection: PROJECTION },
    )
    .skip(skip)
    .limit(count)
    .toArray()
    .then((practices) => practices.map((practice) => mapPractice(practice)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} dossierFilter
 * @param {number} skip
 * @param {number} count
 * @returns {Promise<object>}
 */
function listPackageByDossierFilterAndProductiveRange(mongodb, dossierFilter, skip, count) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(
      {
        ...filterTypes.package,
        ...dossierFilter,
      },
      { projection: PROJECTION },
    )
    .skip(skip)
    .limit(count)
    .toArray()
    .then((practices) => practices.map((practice) => mapPractice(practice)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} dossierFilter
 * @param {number} skip
 * @param {number} count
 * @returns {Promise<object>}
 */
function listOverdueByDossierFilterAndProductiveRange(mongodb, dossierFilter, skip, count) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(
      {
        ...filterTypes.overdue,
        ...dossierFilter,
        'StatoPostVigore.PeriodoProduttivo.Anno': dossierFilter['StatoCorrente.PeriodoProduttivo.Anno'],
        $and: [
          {
            'StatoPostVigore.PeriodoProduttivo.Mese': {
              $gte: dossierFilter.$and[0]['StatoCorrente.PeriodoProduttivo.Mese'].$gte,
            },
          },
          {
            'StatoPostVigore.PeriodoProduttivo.Mese': {
              $lte: dossierFilter.$and[1]['StatoCorrente.PeriodoProduttivo.Mese'].$lte,
            },
          },
        ],
      },
      { projection: PROJECTION },
    )
    .skip(skip)
    .limit(count)
    .toArray()
    .then((practices) => practices.map((practice) => mapPractice(practice)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} dossierFilter
 * @param {number} skip
 * @param {number} count
 * @returns {Promise<object>}
 */
function listNegativeByDossierFilterAndProductiveRange(mongodb, dossierFilter, skip, count) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(
      {
        ...filterTypes.negative,
        ...dossierFilter,
      },
      { projection: PROJECTION },
    )
    .skip(skip)
    .limit(count)
    .toArray()
    .then((practices) => practices.map((practice) => mapPractice(practice)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} filter
 * @param {string} promoterId
 * @param {object} productivePeriod
 * @returns {Promise<Array<Practice>>}
 */
function getByPromoterIdAndProductivePeriod(mongodb, filter, promoterId, productivePeriod) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(
      {
        _t: { $in: ['PraticaSottoscrizione', 'PraticaVersamentoAggiuntivo', 'PraticaFuoriSacco'] },
        'StatoCorrente.Stato.key': practiceStatus.IN_VIGORE,
        'StatoCorrente.PeriodoProduttivo.Anno': productivePeriod.currentProductivePeriodYear,
        'StatoCorrente.PeriodoProduttivo.Mese': productivePeriod.currentProductivePeriodMonth,
        ...filter,
      },
      { projection: PROJECTION },
    )
    .toArray()
    .then((practices) => practices.map((practice) => mapPractice(practice)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 * @returns {Promise<Array<Practice>>}
 */
function getByProductivePeriod(mongodb, productivePeriodYear, productivePeriodMonth) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(
      {
        _t: { $in: ['PraticaSottoscrizione', 'PraticaVersamentoAggiuntivo', 'PraticaFuoriSacco'] },
        'StatoCorrente.Stato.key': practiceStatus.IN_VIGORE,
        'StatoCorrente.PeriodoProduttivo.Anno': productivePeriodYear,
        'StatoCorrente.PeriodoProduttivo.Mese': productivePeriodMonth,
      },
      { projection: PROJECTION },
    )
    .toArray()
    .then((practices) => practices.map((practice) => mapPractice(practice)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 * @returns {Promise<Array<Practice>>}
 */
function getAllByProductivePeriod(mongodb, productivePeriodYear, productivePeriodMonth) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(
      {
        'StatoCorrente.PeriodoProduttivo.Anno': productivePeriodYear,
        'StatoCorrente.PeriodoProduttivo.Mese': productivePeriodMonth,
      },
      { projection: PROJECTION },
    )
    .toArray()
    .then((practices) => practices.map((practice) => mapPractice(practice)));
}

/**
 * @param {Mongo.Db} mongodb
 * @returns {Promise<Array<Practice>>}
 */
function getAll(mongodb) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({}, { projection: PROJECTION })
    .toArray()
    .then((practices) => practices.map((practice) => mapPractice(practice)));
}

/**
 * @param {Mongo.Db} mongodb
 */
function getAllCursor(mongodb) {
  return mongodb.collection(COLLECTION_NAME).find({}, { projection: PROJECTION });
}

function getCustomerCursor(mongodb, customerId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ 'DatiBase.ClienteIdentifier': uuidToBinary(customerId) }, { projection: PROJECTION });
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function mapPracticeToInsert(x) {
  const _id = uuidToBinary(uuid());
  return {
    _id,
    _t: x._t,
    Enabled: true,
    CreatedOn: new Date(),
    ModifiedOn: new Date(),
    Disabled: false,
    DisabledOn: null,
    CreatedByIdentifier: null,
    ExpiresOn: new Date('0001-01-01T00:49:56.000+00:45'),
    IsSync: false,
    NodeHistory: null,
    DatiBase: {
      TipoPremio: null,
      RateizzazionePremio: null,
      NumeroPratica: x.practiceId,
      NumeroContratto: null,
      NumeroProposta: x.dossierId,
      NomeContraente: x.customerName,
      ClienteIdentifier: uuidToBinary(x.customerId),
      ApplicaIvPromotore: true,
      NomeCliente: x.customerName,
      ImportoIncassato: Int64.fromInt(0),
      PremioUnico: Int64.fromInt(0),
      PremioRicorrente: Int64.fromInt(0),
      IndicatoreDiValore: Int64.fromInt(0),
      Caricamento: '0',
      NumeroMandato: '00000',
      MandatoIdentifier: x.mandato._id,
    },
    DatiProdotto: {
      ProdottoIdentifier: uuidToBinary(x.productId),
      NomeProdotto: x.productName,
      CompagniaIdentifier: uuidToBinary(x.companyId),
      NomeCompagnia: x.companyName,
    },
    DatePratica: {
      DataPrimoInvio: null,
      Approvazione: null,
      Decorrenza: null,
      Firma: new Date('0001-01-01T00:49:56.000+00:45'),
      DisposizioneBonifico: null,
      UltimoMesePagato: null,
      Emissione: null,
    },
    CommissioniPassiveRete: {
      PeriodoPagamento: null,
      CommissionePromotore: {
        CommissionBase: '0',
        CommissionFascia: '0',
        CommissionTarget: '0',
      },
      CommissioneTM: {
        CommissionBase: '0',
        CommissionFascia: '0',
        CommissionTarget: '0',
      },
      CommissioneBM: {
        CommissionBase: '0',
        CommissionFascia: '0',
        CommissionTarget: '0',
      },
      CommissioneDM: {
        CommissionBase: '0',
        CommissionFascia: '0',
        CommissionTarget: '0',
      },
    },
    StatoHistory: [
      {
        Stato: {
          value: 'Bozza',
          key: 1,
        },
        PeriodoProduttivo: {
          Data: new Date(),
          Anno: x.productivePeriodYear,
          Mese: x.productivePeriodMonth,
        },
      },
    ],
    StatoAdeguatezza: {
      value: 'Adeguata',
      key: 3,
    },
    StatoPostVigore: null,
    Allegati: x.attachments,
    CommissioniAttive: {
      PeriodoProduttivo: {
        Data: null,
        Anno: 0,
        Mese: 0,
      },
      Standard: '0',
      ManagementFees: [],
    },
    StatoCorrente: {
      Stato: {
        value: 'Bozza',
        key: 1,
      },
      PeriodoProduttivo: {
        Data: new Date(),
        Anno: x.productivePeriodYear,
        Mese: x.productivePeriodMonth,
      },
    },
    TipoPratica: {
      value: x._t === 'PraticaSottoscrizione' ? 'Sottoscrizione' : 'Versamento aggiuntivo',
      key: 5,
    },
    DettaglioApprovazione: {
      ApprovazioneIntermediaHistory: [],
      ApprovazioneHistory: [],
      VisionatoTm: false,
      DataVisioneTm: null,
      ApprovazioneCorrente: null,
      ApprovazioneIntermediaCorrente: null,
    },
    IdentificativoFileTrasmissione: null,
    NoteAggiuntive: null,
    StoricoNote: null,
    PropostaIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
    ContrattoIdentifier: null,
    DettaglioPratica: {
      PropostaIdentifier: _id,
      CodiceProdotto: '',
      CodiceSocieta: '',
      CompanyConfigurationIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
      NumeroProposta: x.practiceId,
      ProductIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
      Quote: '0',
      TitoloProdotto: '',
      StatoPubblicazione: null,
      BeneAssicuratoEuropeAssistance: null,
      ContraenteEuropeAssistance: {
        Identifier: uuidToBinary(x.insured.uuid),
        CodiceFiscale: x.insured.fiscalCode,
        Nome: x.insured.name,
        Cognome: x.insured.surname,
        DataNascita: x.insured.birthDate,
        IsPersonaFisica: !x.insured.isCompany,
        Cittadinanza: '',
        NazioneNascita: '',
        ProvinciaNascita: '',
        LuogoNascita: '',
        RagioneSociale: '',
        PartitaIva: '',
        EAAddress: {
          Toponimo: '',
          NomeIndirizzo: '',
          NumeroCivico: '',
          Nazione: '',
          Provincia: '',
          Comune: '',
          Cap: '',
        },
        DataConsensoPrivacy: new Date('0001-01-01T00:49:56.000+00:45'),
        PrivacyContrattuale: false,
        PrivacyCommerciale: false,
        PrivacyCustomerSatisfaction: false,
        PrivacyIcCs: false,
        PrivacyComunicazione: false,
        PrivacyProfilazione: false,
      },
      AssicuratiEuropeAssistance: [],
      Contraenti: [
        {
          Identifier: uuidToBinary(x.insured.uuid),
          CodiceFiscale: x.insured.fiscalCode,
          Nome: x.insured.name,
          Cognome: x.insured.surname,
          DataNascita: x.insured.birthDate,
          IsPersonaFisica: !x.insured.isCompany,
          IsMaschio: x.insured.sex === 'M',
          LuogoNascita: {
            ComuneDiNascita: x.insured.birthCity,
            ProvinciaDiNascita: x.insured.birthRegion,
            StatoDiNascita: x.insured.birthState,
          },
          Nazionalita: x.insured.nationality,
          Documento: {
            DataEmissioneDocumento: x.identity.issueDate,
            EnteEmissioneDocumento: x.identity.issueAuthority ? x.identity.issueAuthority.value : undefined,
            NumeroDocumento: x.identity.documentNumber,
            NazioneEmissione: x.identity.issueCountry,
            ProvinciaEmissione: x.identity.issueRegion,
            ComuneEmissione: x.identity.issueCity,
            DataScadenza: x.identity.expiryDate,
            TipoDocumento: {
              value: x.identity.documentType.value,
              key: x.identity.documentType.key,
            },
          },
          IndirizzoResidenza: {
            TypedAddress: x.insured.displayLegalAddress,
            StreetNumber: x.insured.legalAddress.streetNumber,
            Route: x.insured.legalAddress.route,
            Locality: x.insured.legalAddress.city,
            Province: x.insured.legalAddress.province,
            Region: '',
            Country: x.insured.legalAddress.country,
            PostalCode: x.insured.legalAddress.postalCode,
            Latitude: '45.4548529',
            Longitude: '9.215201799999999',
          },
          IndirizzoDomicilio: {
            TypedAddress: x.insured.displayAddress,
            StreetNumber: x.insured.address.streetNumber,
            Route: x.insured.address.route,
            Locality: x.insured.address.city,
            Province: x.insured.address.province,
            Region: '',
            Country: x.insured.address.country,
            PostalCode: x.insured.address.postalCode,
            Latitude: '45.4548529',
            Longitude: '9.215201799999999',
          },
          PartitaIva: x.insured.fiscalCode,
          RagioneSociale: x.insured.companyName,
          FormaGiuridica: !x.insured.isCompany
            ? null
            : { value: x.insured.companyType.value, key: x.insured.companyType.key },
          GradoParentelaAssicurato: null,
          IsSocietaQuotata: false,
          DatiMedico: {
            PartitaIva: '',
            IscrittoAlboDi: '',
            AnnoIscrizioneAlbo: 0,
            AnnoInizioAttivita: 0,
            AttivitaSvolta: '',
            RegimeAttivita: [],
          },
          TitoloDiStudio: null,
          Professione: '',
          TipologiaFumatore: null,
          IPSIDarta: '',
          IndirizzoCorrispondenza: {
            TypedAddress: '',
            StreetNumber: '',
            Route: '',
            Locality: '',
            Province: '',
            Region: '',
            Country: '',
            PostalCode: '',
            Latitude: '0',
            Longitude: '0',
          },
          TipologiaBeneficiario: null,
          DatiAggiuntivi: {
            IsPoliticamenteEsposta: false,
            OrigineDeiFondi: '',
            ContraenteSoggettoFatca: false,
            USTin: '',
            Professione: null,
            SettoreAttivitaEconomica: null,
            Ateco: null,
            DisponibilitaFinanziaria: null,
            USEIn: '',
            RientraFlussiFinanziari: false,
            CIG: '',
            CUP: '',
          },
          DatiAggiuntiviPip: {
            TipologiaAderente: null,
            TipologiaAderenteItaliana: null,
            CcnlRiferimento: '',
            TipologiaAderenteItalianaAltro: '',
            PrevidenzaObbligatoria: null,
            PeriodoIscrizionePrevidenzaComplementare: null,
            AnnoAccessoPrestazionePensionistica: 0,
          },
        },
      ],
      LegaleRappresentante: {
        Identifier: x.legalPerson
          ? uuidToBinary(x.legalPerson.uuid)
          : uuidToBinary('00000000-0000-0000-0000-000000000000'),
        CodiceFiscale: x.legalPerson ? x.legalPerson.fiscalCode : '',
        Nome: x.legalPerson ? x.legalPerson.name : '',
        Cognome: x.legalPerson ? x.legalPerson.surname : '',
        DataNascita: x.legalPerson ? x.legalPerson.birthDate : new Date('1970-01-01T00:49:56.000+00:45'),
        IsPersonaFisica: true,
        IsMaschio: x.legalPerson ? x.legalPerson.sex === 'M' : false,
        LuogoNascita: {
          ComuneDiNascita: x.legalPerson ? x.legalPerson.birthCity : '',
          ProvinciaDiNascita: x.legalPerson ? x.legalPerson.birthRegion : '',
          StatoDiNascita: x.legalPerson ? x.legalPerson.birthState : '',
        },
        Nazionalita: x.legalPerson ? x.legalPerson.nationality : '',
        Documento: {
          DataEmissioneDocumento: x.identity.issueDate,
          NumeroDocumento: x.identity.documentNumber,
          EnteEmissioneDocumento: x.identity.issueAuthority ? x.identity.issueAuthority.value : undefined,
          NazioneEmissione: x.identity.issueCountry,
          ProvinciaEmissione: x.identity.issueRegion,
          ComuneEmissione: x.identity.issueCity,
          DataScadenza: x.identity.expiryDate,
          TipoDocumento: {
            value: x.identity.documentType.value,
            key: x.identity.documentType.key,
          },
        },
        IndirizzoResidenza: {
          TypedAddress: x.legalPerson ? x.legalPerson.displayLegalAddress : '',
          StreetNumber: x.legalPerson ? x.legalPerson.legalAddress.streetNumber : '',
          Route: x.legalPerson ? x.legalPerson.legalAddress.route : '',
          Locality: x.legalPerson ? x.legalPerson.legalAddress.city : '',
          Province: x.legalPerson ? x.legalPerson.legalAddress.province : '',
          Region: '',
          Country: x.legalPerson ? x.legalPerson.legalAddress.country : '',
          PostalCode: x.legalPerson ? x.legalPerson.legalAddress.postalCode : '',
          Latitude: '45.4548529',
          Longitude: '9.215201799999999',
        },
        IndirizzoDomicilio: {
          TypedAddress: x.legalPerson ? x.legalPerson.displayAddress : '',
          StreetNumber: x.legalPerson ? x.legalPerson.address.streetNumber : '',
          Route: x.legalPerson ? x.legalPerson.address.route : '',
          Locality: x.legalPerson ? x.legalPerson.address.city : '',
          Province: x.legalPerson ? x.legalPerson.address.province : '',
          Region: '',
          Country: x.legalPerson ? x.legalPerson.address.country : '',
          PostalCode: x.legalPerson ? x.legalPerson.address.postalCode : '',
          Latitude: '45.4548529',
          Longitude: '9.215201799999999',
        },
        PartitaIva: x.legalPerson ? x.legalPerson.fiscalCode : '',
        RagioneSociale: x.legalPerson ? x.legalPerson.companyName : '',
        FormaGiuridica: null,
        GradoParentelaAssicurato: null,
        IsSocietaQuotata: false,
        DatiMedico: {
          PartitaIva: '',
          IscrittoAlboDi: '',
          AnnoIscrizioneAlbo: 0,
          AnnoInizioAttivita: 0,
          AttivitaSvolta: '',
          RegimeAttivita: [],
        },
        TitoloDiStudio: null,
        Professione: '',
        TipologiaFumatore: null,
        IPSIDarta: '',
        IndirizzoCorrispondenza: {
          TypedAddress: '',
          StreetNumber: '',
          Route: '',
          Locality: '',
          Province: '',
          Region: '',
          Country: '',
          PostalCode: '',
          Latitude: '0',
          Longitude: '0',
        },
        TipologiaBeneficiario: null,
        DatiAggiuntivi: {
          IsPoliticamenteEsposta: false,
          OrigineDeiFondi: '',
          ContraenteSoggettoFatca: false,
          USTin: '',
          Professione: null,
          SettoreAttivitaEconomica: null,
          Ateco: null,
          DisponibilitaFinanziaria: null,
          USEIn: '',
          RientraFlussiFinanziari: false,
          CIG: '',
          CUP: '',
        },
        DatiAggiuntiviPip: {
          TipologiaAderente: null,
          TipologiaAderenteItaliana: null,
          CcnlRiferimento: '',
          TipologiaAderenteItalianaAltro: '',
          PrevidenzaObbligatoria: null,
          PeriodoIscrizionePrevidenzaComplementare: null,
          AnnoAccessoPrestazionePensionistica: 0,
        },
        LegameDelegatoContraente: null,
        LegameDelegatoAltro: '',
        IndirizzoCorrispondenzaLegale: {
          TypedAddress: '',
          StreetNumber: '',
          Route: '',
          Locality: '',
          Province: '',
          Region: '',
          Country: '',
          PostalCode: '',
          Latitude: '0',
          Longitude: '0',
        },
      },
      TitolareEffettivo: {
        Identifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
        CodiceFiscale: '',
        Nome: '',
        Cognome: '',
        DataNascita: new Date('0001-01-01T00:49:56.000+00:45'),
        IsPersonaFisica: true,
        IsMaschio: false,
        LuogoNascita: {
          ComuneDiNascita: '',
          ProvinciaDiNascita: '',
          StatoDiNascita: '',
        },
        Nazionalita: '',
        Documento: {
          DataEmissioneDocumento: new Date('0001-01-01T00:49:56.000+00:45'),
          EnteEmissioneDocumento: '',
          NumeroDocumento: '',
          NazioneEmissione: '',
          ProvinciaEmissione: '',
          ComuneEmissione: '',
          DataScadenza: new Date('0001-01-01T00:49:56.000+00:45'),
          TipoDocumento: null,
        },
        IndirizzoResidenza: {
          TypedAddress: '',
          StreetNumber: '',
          Route: '',
          Locality: '',
          Province: '',
          Region: '',
          Country: '',
          PostalCode: '',
          Latitude: '0',
          Longitude: '0',
        },
        IndirizzoDomicilio: {
          TypedAddress: '',
          StreetNumber: '',
          Route: '',
          Locality: '',
          Province: '',
          Region: '',
          Country: '',
          PostalCode: '',
          Latitude: '0',
          Longitude: '0',
        },
        PartitaIva: '',
        RagioneSociale: '',
        FormaGiuridica: null,
        GradoParentelaAssicurato: null,
        IsSocietaQuotata: false,
        DatiMedico: {
          PartitaIva: '',
          IscrittoAlboDi: '',
          AnnoIscrizioneAlbo: 0,
          AnnoInizioAttivita: 0,
          AttivitaSvolta: '',
          RegimeAttivita: [],
        },
        TitoloDiStudio: null,
        Professione: '',
        TipologiaFumatore: null,
        IPSIDarta: '',
        IndirizzoCorrispondenza: {
          TypedAddress: '',
          StreetNumber: '',
          Route: '',
          Locality: '',
          Province: '',
          Region: '',
          Country: '',
          PostalCode: '',
          Latitude: '0',
          Longitude: '0',
        },
        TipologiaBeneficiario: null,
        DatiAggiuntivi: {
          IsPoliticamenteEsposta: false,
          OrigineDeiFondi: '',
          ContraenteSoggettoFatca: false,
          USTin: '',
          Professione: null,
          SettoreAttivitaEconomica: null,
          Ateco: null,
          DisponibilitaFinanziaria: null,
          USEIn: '',
          RientraFlussiFinanziari: false,
          CIG: '',
          CUP: '',
        },
        DatiAggiuntiviPip: {
          TipologiaAderente: null,
          TipologiaAderenteItaliana: null,
          CcnlRiferimento: '',
          TipologiaAderenteItalianaAltro: '',
          PrevidenzaObbligatoria: null,
          PeriodoIscrizionePrevidenzaComplementare: null,
          AnnoAccessoPrestazionePensionistica: 0,
        },
      },
      Procuratori: [],
      Assicurati: [],
      TerzoPagatore:
        x.sepa && x.sepa.linkedCustomerId && x.sepa.isThirdPayer
          ? {
              Identifier: uuidToBinary(x.sepa.linkedCustomerId),
              CodiceFiscale: x.sepa.customer.fiscalCode,
              Nome: x.sepa.customer.name,
              Cognome: x.sepa.customer.surname,
              DataNascita: x.sepa.customer.birthDate,
              IsPersonaFisica: !x.sepa.customer.isCompany,
              IsMaschio: x.sepa.customer.sex === 'M',
              LuogoNascita: {
                ComuneDiNascita: x.sepa.customer.birthCity,
                ProvinciaDiNascita: x.sepa.customer.birthRegion,
                StatoDiNascita: x.sepa.customer.birthState,
              },
              Nazionalita: x.sepa.customer.nationality,
              Documento: {
                NumeroDocumento: x.sepa.document.documentNumber,
                DataEmissioneDocumento: new Date(
                  `${x.sepa.document.issueDate.slice(6, 4)}-${x.sepa.document.issueDate.slice(
                    3,
                    2,
                  )}${x.sepa.document.issueDate.slice(0, 2)}T00:49:56.000+00:45`,
                ),
                EnteEmissioneDocumento: x.sepa.document.issueAuthority.label,
                NazioneEmissione: x.sepa.document.issueCountry,
                ProvinciaEmissione: x.sepa.document.issueRegion,
                ComuneEmissione: x.sepa.document.issueCity,
                DataScadenza: new Date(
                  `${x.sepa.document.expiryDate.slice(6, 4)}-${x.sepa.document.expiryDate.slice(
                    3,
                    2,
                  )}${x.sepa.document.expiryDate.slice(0, 2)}T00:49:56.000+00:45`,
                ),
                TipoDocumento: {
                  value: x.sepa.document.documentType.label,
                  key: x.sepa.document.documentType.value,
                },
              },
              IndirizzoResidenza: {
                TypedAddress: '',
                StreetNumber: x.sepa.customer.legalAddress.streetNumber,
                Route: x.sepa.customer.legalAddress.route,
                Locality: x.sepa.customer.legalAddress.city,
                Province: x.sepa.customer.legalAddress.province,
                Region: '',
                Country: x.sepa.customer.legalAddress.country,
                PostalCode: x.sepa.customer.legalAddress.postalCode,
                Latitude: '45.4548529',
                Longitude: '9.215201799999999',
              },
              IndirizzoDomicilio: {
                TypedAddress: x.sepa.address.displayAddress,
                StreetNumber: x.sepa.address.streetNumber,
                Route: x.sepa.address.route,
                Locality: x.sepa.address.city,
                Province: x.sepa.address.province,
                Region: '',
                Country: x.sepa.address.country,
                PostalCode: x.sepa.address.postalCode,
                Latitude: '45.4548529',
                Longitude: '9.215201799999999',
              },
              PartitaIva: x.sepa.customer.vat,
              RagioneSociale: x.sepa.customer.companyName,
              FormaGiuridica: !x.sepa.customer.isCompany
                ? null
                : { value: x.sepa.customer.companyType.value, key: x.sepa.customer.companyType.key },
              Iban: x.sepa.iban.iban,
            }
          : null,
      GaranziaPrincipale: {
        ConsensoDatiSensibili: false,
        ConsensoDatiPersonali: false,
        ConsensoComunicazioneTerzi: false,
        ConsensoComunicazioneViaMail: false,
        Caricamento: {
          k: null,
          v: '0',
        },
        NumeroProposta: '',
        DataFirmaProposta: new Date('0001-01-01T00:49:56.000+00:45'),
        LuogoFirmaProposta: '',
        Decorrenza: new Date('0001-01-01T00:49:56.000+00:45'),
        IdentificativoSegnalatore: uuidToBinary('00000000-0000-0000-0000-000000000000'),
        DurataAlternativaAnni: null,
        DurataDaInputAnni: 0,
        DurataFissaAnni: 0,
        Caricamenti: '0',
        TipoPremio: null,
        RateizzazionePremio: null,
        PremioLordo: '0',
        PremioUnico: '0',
        PremioRicorrente: '0',
        CapitaleAssicurato: '0',
        TipoCapitale: null,
        Decrescenza: null,
        DurataPagamentoPremi: 0,
        ForzaDurataPagamentoPremi: false,
        ForzaDurataPagamentoPremiValore: 0,
        RenditaAssicurataAnnuaIniziale: '0',
        TipologiaDiRendita: null,
        FrazionamentoRendita: null,
        PercentualeReversibilita: 0,
        AnniRenditaCerta: 0,
        ImportoVersato: '0',
        DatiAggiuntiviPip: {
          ModalitaVersamentoContributi: [],
          ContributoAnnualeAderente: '0',
          ContributoPercentualeRedditoAderente: '0',
          ContributoAggiuntivoAdesione: '0',
          ContributoDatoreDiLavoro: '0',
          ContributoPercentualeDatoreDiLavoro: '0',
          ConferimentoTFRPercentuale: '0',
          RagioneSociale: '',
          PIva: '',
          SedeLegale: {
            TypedAddress: '',
            StreetNumber: '',
            Route: '',
            Locality: '',
            Province: '',
            Region: '',
            Country: '',
            PostalCode: '',
            Latitude: '0',
            Longitude: '0',
          },
          SettoreAttivitaEconomica: null,
          Riferimento: '',
          Telefono: '',
          IndirizzoEmail: '',
          IsTrasferimentoPensione: false,
          DenominazioFormaPensionistica: '',
          EstremiPosizioneIndividuale: '',
          AnzianitaContributivaComplementare: '',
          NumeroIscrizioneCovip: '',
        },
        DatiMetLife: {
          DatiAggiuntiviProtezioneJunior: null,
          EliminareCarenza: false,
          IsCapitaleDecrescente: false,
          IsPoliticamenteEsposta: false,
          HasGaranziaAccessoriaInvalidita: false,
          GaranzieSomme: [],
          CapitaleAssicuratoCasoInvalidita: '0',
          CapitaleAssicuratoCasoMorte: '0',
          PremioGaranziaMorte: '0',
          PremioGaranziaInvalidita: '0',
          PremioTotale: '0',
        },
        DatiItaliana: {
          PolizzaLPS: false,
          NazioneLPS: '',
          RischioGiaAssicuratoItaliana: false,
          PresenzaSezioneTrasporti: false,
          CodiceIdentificativoGara: '',
          EventualiDichiarazioni: null,
          ClausoleATestoLibero: null,
          DatiArtigiano: {
            Mur: '',
            AbitazioneCollegata: false,
            DepositoAccessorio: false,
            UbicazioneDelRischio: '',
            Attivita: '',
          },
          DatiCommerciante: {
            TipoBene: null,
            MultiUbicazione: '',
            Mur: '',
            EsisteAbitazioneCollegata: null,
            FranchigiaFrontale: null,
            UbicazioneDelRischio: '',
            Attivita: '',
            PolizzaConnessa: false,
          },
          DatiStudioEAttivita: {
            MultiUbicazione: '',
            Piano: '',
            Mur: '',
            EsisteAbitazioneCollegata: null,
            FranchigiaFrontale: null,
            UbicazioneDelRischio: '',
            Attivita: '',
          },
          DatiFirstProtection: {
            FasciaSommaAssicurata: null,
            PianoAbitazioneAssicurata: null,
            InteraCostruzione: false,
            InCondominio: false,
            Indirizzo: '',
            GaranziaRct: false,
            MassimalePerSinistro: '0',
          },
        },
        DatiMedico: {
          IsColpaGrave: false,
          Massimale: '0',
          RetroAttivita: null,
          AnniRetroAttivita: 0,
        },
        DatiEuropeAssistance: {
          TipoBene: null,
          FlagBeneIndirizzo: null,
          FlagBeneSoggetto: null,
        },
        OpzioneContrattualeMultinvest: '',
        SpecializzazioneMedica: '',
        TipologiaResponsabilitaCivile: null,
      },
      BeneficiariGaranziaPrincipale: {
        TipologiaBeneficiario: null,
        Beneficiari: [],
        TipologiaBeneficiarioCasoMorte: null,
        TestoLiberoCasoMorte: null,
        TipologiaBeneficiarioCasoVita: null,
        TestoLiberoCasoVita: null,
      },
      BeneficiariGaranzieComplementari: [],
      GaranzieComplementari: [],
      GaranzieAssicurate: {
        Artigiano: {
          NumeroAutomezzi: 0,
          TargheAutomezzi: [],
          Incendio: {
            Fabbricato: '0',
            Contenuto: '0',
            RischioLocativo: '0',
            RicorsoTerzi: '0',
            CoseParticolari: '0',
            DanniElettrici: '0',
            MerciRefrigerazione: '0',
            AumentoTemporaneoMerciMassimaCoperturaGiorni: '0',
          },
          Furto: {
            Contenuto: '0',
            Valori: '0',
            TrasportoValori: '0',
            BeniAllAperto: '0',
          },
          Elettronica: {
            ApparecchiatureElettroniche: '0',
            ProgrammiApplicativi: '0',
            SupportiDati: '0',
            AppImpiegoMobile: '0',
            MaggioriCostiGiornalieri: '0',
            OpzioneMensile: null,
          },
          Cristalli: {
            MassimaleAnnuo: '0',
            IndennizzoLastra: null,
          },
          ResponsabilitaCivile: {
            MassimaleRctRco: null,
            MassimaleLibero: '0',
            NumeroAddetti: 0,
          },
          TutelaLegale: {
            GaranziaBase: null,
            NumeroAddetti: 0,
            MassimalePerSinistro: '0',
          },
          HasScontoPersonalizzazione: false,
          ScontoPersonalizzazionePercentuale: '0',
          SovrappremioPercentuale: '0',
          PremioLordoDiRataMaggiorato: '0',
          ScontoExtraPercentuale: '0',
          PremioLordoDiRataScontato: '0',
        },
        Commerciante: {
          Incendio: {
            Fabbricato: '0',
            Contenuto: '0',
            RischioLocativo: '0',
            RicorsoTerzi: '0',
            CoseParticolari: '0',
            DanniElettrici: '0',
            MerciRefrigerazione: '0',
            AumentoTemporaneoMerciMassimaCoperturaGiorni: '0',
            Nota: '',
            AumentoTemporaneoMerci: {
              Periodo1Dal: null,
              Periodo1Al: null,
              SommaAssicurata1: '0',
              Periodo2Dal: null,
              Periodo2Al: null,
              SommaAssicurata2: '0',
              Periodo3Dal: null,
              Periodo3Al: null,
              SommaAssicurata3: '0',
              CoseTrasportate: null,
              Nota: null,
            },
          },
          Furto: {
            Contenuto: '0',
            Valori: '0',
            TrasportoValori: '0',
            BeniAllAperto: '0',
            ContenutoAbitazione: '0',
            AumentoTemporaneoMerci: {
              Periodo1Dal: null,
              Periodo1Al: null,
              SommaAssicurata1: '0',
              Periodo2Dal: null,
              Periodo2Al: null,
              SommaAssicurata2: '0',
              Periodo3Dal: null,
              Periodo3Al: null,
              SommaAssicurata3: '0',
              CoseTrasportate: null,
              Nota: null,
            },
          },
          Elettronica: {
            ApparecchiatureElettroniche: '0',
            ProgrammiApplicativi: '0',
            SupportiDati: '0',
            AppImpiegoMobile: '0',
            MaggioriCostiGiornalieri: '0',
            OpzioneMensile: null,
          },
          Cristalli: {
            MassimaleAnnuo: '0',
            IndennizzoLastra: null,
          },
          ResponsabilitaCivile: {
            MassimaleRctRco: null,
            MassimaleLibero: '0',
            NumeroAddetti: 0,
          },
          ResponsabilitaCivileRctRco: {
            MassimaleRctRco: null,
            MassimaleLibero: '0',
            NumeroAddetti: 0,
          },
          TutelaLegale: {
            NumeroAddetti: 0,
            MassimalePerSinistro: '0',
            LimiteCasiAssicurati: null,
          },
          HasScontoPersonalizzazione: false,
          ScontoPersonalizzazionePercentuale: '0',
          SovrappremioPercentuale: '0',
          PremioLordoDiRataMaggiorato: '0',
          ScontoExtraPercentuale: '0',
          PremioLordoDiRataScontato: '0',
        },
        StudioEAttivita: {
          Incendio: {
            Fabbricato: '0',
            Contenuto: '0',
            RischioLocativo: '0',
            RicorsoTerzi: '0',
            CoseParticolari: '0',
            DanniElettrici: '0',
            MerciRefrigerazione: '0',
            AumentoTemporaneoMerciMassimaCoperturaGiorni: '0',
            ArchiviEDocumenti: '0',
          },
          Furto: {
            Contenuto: '0',
            Valori: '0',
            TrasportoValori: '0',
            BeniAllAperto: '0',
            ContenutoAbitazione: '0',
            AumentoTemporaneoMerci: {
              Periodo1Dal: null,
              Periodo1Al: null,
              SommaAssicurata1: '0',
              Periodo2Dal: null,
              Periodo2Al: null,
              SommaAssicurata2: '0',
              Periodo3Dal: null,
              Periodo3Al: null,
              SommaAssicurata3: '0',
              CoseTrasportate: null,
              Nota: null,
            },
          },
          Elettronica: {
            ApparecchiatureElettroniche: '0',
            ProgrammiApplicativi: '0',
            SupportiDati: '0',
            AppImpiegoMobile: '0',
            MaggioriCostiGiornalieri: '0',
            OpzioneMensile: null,
          },
          Cristalli: {
            MassimaleAnnuo: '0',
            IndennizzoLastra: null,
          },
          ResponsabilitaCivile: {
            NumeroAddettiRct: 0,
            MassimaleRct: null,
            MassimaleLiberoRct: '0',
            NumeroAddettiRctRco: 0,
            MassimaleRctRco: null,
            MassimaleLiberoRctRco: '0',
            RcSolaProprieta: null,
            MassimaleLiberoSolaProprieta: '0',
          },
          TutelaLegale: {
            NumeroAddettiBase: 0,
            MassimalePerSinistroAnnoBase: '0',
            NumeroAddettiControversie: 0,
            MassimalePerSinistroAnnoControversie: '0',
          },
          HasScontoPersonalizzazione: false,
          ScontoPersonalizzazionePercentuale: '0',
          SovrappremioPercentuale: '0',
          PremioLordoDiRataMaggiorato: '0',
          ScontoExtraPercentuale: '0',
          PremioLordoDiRataScontato: '0',
          ImportoDiritti: '0',
        },
        FirstProtection: {
          FasciaSommaAssicurata: null,
          PianoAbitazioneAssicurata: '',
          InteraCostruzione: false,
          InCondominio: false,
          Indirizzo: '',
          GaranziaRct: false,
          MassimalePerSinistro: '',
        },
      },
      BeneficiariMetLife: {
        TipologiaBeneficiariPrincipale: null,
        TipologiaBeneficiariInvalidita: null,
        BeneficiariPrincipale: {
          PersoneFisiche: [],
          PersoneGiuridiche: [],
        },
        BeneficiariInvalidita: {
          PersoneFisiche: [],
          PersoneGiuridiche: [],
        },
      },
      PianoInvestimento: {
        PercentualeGestioneSeparata: 0,
        IsSwitchAutomaticoDarta: false,
        PercentualiInvestimentoFondiInterni: [],
        PercentualiInvestimentoFondiInterniRicorrente: [],
        PercentualiInvestimentoFondiInterniAlternativi: [],
        PercentualiInvestimentoFondiInterniRicorrenteAlternativi: [],
        DenominazioneStrategia: {
          DenominazioneStrategia: '',
          CodiceStrategia: '',
        },
        ProfiloDiRischio: null,
        DatiAggiuntiviPip: {
          CompartiPresceltoTFR: [],
          CompartoPresceltoAltreTipologieContributo: [],
        },
      },
      QuestionarioSanitario: {
        IsQuestionarioAffermativo: null,
      },
      CopertureSanitarie: null,
      QuestionarioSanitarioMetLife: {
        Altezza: '0',
        Peso: '0',
        RapportoAltezzaPeso: '0',
        HasInterrottoAttivitaLavorativa: null,
        HasRicoveri: null,
        HasMalattieTerapiaMedica: null,
        HasTumore: null,
        HasEpatite: null,
        HasCardiopatia: null,
        HasIctus: null,
        HasDiabete: null,
        HasHiv: null,
        HasPensioneInabilita: null,
        ConfermaPrecedentiRisposte: null,
        ProscioglieSegretoProfessionale: null,
      },
      Corrispondenza: {
        Nome: '',
        Cognome: '',
        RagioneSociale: '',
        Indirizzo: {
          TypedAddress: '',
          StreetNumber: '',
          Route: '',
          Locality: '',
          Province: '',
          Region: '',
          Country: '',
          PostalCode: '',
          Latitude: '0',
          Longitude: '0',
        },
        NumeroTelefono: '',
        Email: x.email,
        Fax: '',
        Pec: '',
      },
      ModalitaPagamento: {
        ModalitaPagamento: x.sepa ? { value: 'Addebito diretto su conto corrente', key: 2 } : null,
        DatiBancari: {
          IntestatarioCC: x.sepa ? x.sepa.customer.name : '',
          Filiale: '',
          Banca: '',
          SwiftBic: x.sepa ? x.sepa.iban.swift : '',
          Iban: x.sepa ? x.sepa.iban.iban : '',
          DatiEuropeAssistance: {
            CodiceFiscaleIntestatarioCC: null,
            UsoImposta: 0,
          },
        },
      },
      Adeguatezza: null,
      RisultatoQuestionario: {
        StatoPubblicazione: {
          value: 'Bozza',
          key: 1,
        },
        Punteggio: 0,
        Motivazioni: [],
        RisposteQuestionario: [],
        IsAdeguato: false,
      },
      IsInviabile: false,
      IsSolaLettura: false,
    },
    DettaglioInvestimenti: [],
  };
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function mapAdditionalIncomeToInsert(x) {
  const _id = uuidToBinary(uuid());
  return {
    _id,
    _t: x._t,
    Enabled: true,
    CreatedOn: new Date(),
    ModifiedOn: new Date(),
    Disabled: false,
    DisabledOn: null,
    CreatedByIdentifier: null,
    ExpiresOn: new Date('0001-01-01T00:49:56.000+00:45'),
    IsSync: false,
    NodeHistory: null,
    DatiBase: {
      TipoPremio: x.originalSubPractice.DatiBase.TipoPremio,
      RateizzazionePremio: x.originalSubPractice.DatiBase.RateizzazionePremio,
      NumeroPratica: x.practiceId,
      NumeroContratto: x.contractId,
      NumeroProposta: x.dossierId,
      NomeContraente: x.customerName,
      ClienteIdentifier: uuidToBinary(x.customerId),
      ApplicaIvPromotore: true,
      NomeCliente: x.customerName,
      ImportoIncassato: Int64.fromInt(0),
      PremioUnico: Int64.fromInt(0),
      PremioRicorrente: Int64.fromInt(0),
      IndicatoreDiValore: Int64.fromInt(0),
      Caricamento: '0',
      NumeroMandato: '00000',
      MandatoIdentifier: x.mandato._id,
    },
    DatiProdotto: {
      ProdottoIdentifier: uuidToBinary(x.productId),
      NomeProdotto: x.productName,
      CompagniaIdentifier: uuidToBinary(x.companyId),
      NomeCompagnia: x.companyName,
    },
    DatePratica: {
      DataPrimoInvio: null,
      Approvazione: x.originalSubPractice.DatePratica.Approvazione,
      Decorrenza: x.originalSubPractice.DatePratica.Decorrenza,
      Firma: x.originalSubPractice.DatePratica.Firma,
      DisposizioneBonifico: null,
      UltimoMesePagato: null,
      Emissione: x.originalSubPractice.DatePratica.Emissione,
    },
    CommissioniPassiveRete: {
      PeriodoPagamento: null,
      CommissionePromotore: {
        CommissionBase: '0',
        CommissionFascia: '0',
        CommissionTarget: '0',
      },
      CommissioneTM: {
        CommissionBase: '0',
        CommissionFascia: '0',
        CommissionTarget: '0',
      },
      CommissioneBM: {
        CommissionBase: '0',
        CommissionFascia: '0',
        CommissionTarget: '0',
      },
      CommissioneDM: {
        CommissionBase: '0',
        CommissionFascia: '0',
        CommissionTarget: '0',
      },
    },
    StatoHistory: [
      {
        Stato: {
          value: 'Bozza',
          key: 1,
        },
        PeriodoProduttivo: {
          Data: new Date(),
          Anno: x.productivePeriodYear,
          Mese: x.productivePeriodMonth,
        },
      },
    ],
    StatoAdeguatezza: {
      value: 'Non Adeguata',
      key: 1,
    },
    StatoPostVigore: {
      Stato: null,
      PeriodoProduttivo: null,
    },
    Allegati: x.attachments,
    CommissioniAttive: {
      PeriodoProduttivo: {
        Data: null,
        Anno: 0,
        Mese: 0,
      },
      Standard: '0',
      ManagementFees: [],
    },
    StatoCorrente: {
      Stato: {
        value: 'Bozza',
        key: 1,
      },
      PeriodoProduttivo: {
        Data: new Date(),
        Anno: x.productivePeriodYear,
        Mese: x.productivePeriodMonth,
      },
    },
    TipoPratica: {
      value: 'Versamento aggiuntivo',
      key: 2,
    },
    DettaglioApprovazione: {
      ApprovazioneIntermediaHistory: [],
      ApprovazioneHistory: [],
      VisionatoTm: false,
      DataVisioneTm: null,
      ApprovazioneCorrente: null,
      ApprovazioneIntermediaCorrente: null,
    },
    IdentificativoFileTrasmissione: null,
    NoteAggiuntive: null,
    StoricoNote: null,
    PropostaIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
    ContrattoIdentifier: null,
    DettaglioPratica: {
      Contraenti: [
        {
          Identifier: uuidToBinary(x.insured.uuid),
          CodiceFiscale: x.insured.fiscalCode,
          Nome: x.insured.name,
          Cognome: x.insured.surname,
          DataNascita: x.insured.birthDate,
          IsPersonaFisica: !x.insured.isCompany,
          IsMaschio: x.insured.sex === 'M',
          LuogoNascita: {
            ComuneDiNascita: x.insured.birthCity,
            ProvinciaDiNascita: x.insured.birthRegion,
            StatoDiNascita: x.insured.birthState,
          },
          Nazionalita: x.insured.nationality,
          Documento: {
            DataEmissioneDocumento: x.identity.issueDate,
            NumeroDocumento: x.identity.documentNumber,
            EnteEmissioneDocumento: x.identity.issueAuthority.value,
            NazioneEmissione: x.identity.issueCountry,
            ProvinciaEmissione: x.identity.issueRegion,
            ComuneEmissione: x.identity.issueCity,
            DataScadenza: x.identity.expiryDate,
            TipoDocumento: {
              value: x.identity.documentType.value,
              key: x.identity.documentType.key,
            },
          },
          IndirizzoResidenza: {
            TypedAddress: x.insured.displayLegalAddress,
            StreetNumber: x.insured.legalAddress.streetNumber,
            Route: x.insured.legalAddress.route,
            Locality: x.insured.legalAddress.city,
            Province: x.insured.legalAddress.province,
            Region: '',
            Country: x.insured.legalAddress.country,
            PostalCode: x.insured.legalAddress.postalCode,
            Latitude: '45.4548529',
            Longitude: '9.215201799999999',
          },
          IndirizzoDomicilio: {
            TypedAddress: x.insured.displayAddress,
            StreetNumber: x.insured.address.streetNumber,
            Route: x.insured.address.route,
            Locality: x.insured.address.city,
            Province: x.insured.address.province,
            Region: '',
            Country: x.insured.address.country,
            PostalCode: x.insured.address.postalCode,
            Latitude: '45.4548529',
            Longitude: '9.215201799999999',
          },
          PartitaIva: x.insured.fiscalCode,
          RagioneSociale: x.insured.companyName,
          FormaGiuridica: !x.insured.isCompany
            ? null
            : { value: x.insured.companyType.value, key: x.insured.companyType.key },
          GradoParentelaAssicurato: null,
          IsSocietaQuotata: false,
          DatiMedico: {
            PartitaIva: '',
            IscrittoAlboDi: '',
            AnnoIscrizioneAlbo: 0,
            AnnoInizioAttivita: 0,
            AttivitaSvolta: '',
            RegimeAttivita: [],
          },
          TitoloDiStudio: null,
          Professione: '',
          TipologiaFumatore: null,
          IPSIDarta: '',
          IndirizzoCorrispondenza: {
            TypedAddress: '',
            StreetNumber: '',
            Route: '',
            Locality: '',
            Province: '',
            Region: '',
            Country: '',
            PostalCode: '',
            Latitude: '0',
            Longitude: '0',
          },
          TipologiaBeneficiario: null,
          DatiAggiuntivi: {
            IsPoliticamenteEsposta: false,
            OrigineDeiFondi: '',
            ContraenteSoggettoFatca: false,
            USTin: '',
            Professione: null,
            SettoreAttivitaEconomica: null,
            Ateco: null,
            DisponibilitaFinanziaria: null,
            USEIn: '',
            RientraFlussiFinanziari: false,
            CIG: '',
            CUP: '',
          },
          DatiAggiuntiviPip: {
            TipologiaAderente: null,
            TipologiaAderenteItaliana: null,
            CcnlRiferimento: '',
            TipologiaAderenteItalianaAltro: '',
            PrevidenzaObbligatoria: null,
            PeriodoIscrizionePrevidenzaComplementare: null,
            AnnoAccessoPrestazionePensionistica: 0,
          },
        },
      ],
      ModalitaPagamento: x.originalSubPractice.DettaglioPratica.ModalitaPagamento.ModalitaPagamento,
      DatiBancari: { _t: 'DatiBancari', ...x.originalSubPractice.DettaglioPratica.ModalitaPagamento.DatiBancari },
      Adeguatezza: {
        NumeroProposta: '',
        CodiceConsulente: '',
        ContraenteIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
        Nome: '',
        Cognome: '',
        StatoDiNascita: '',
        ProvinciaDiNascita: '',
        ComuneDiNascita: '',
        DataDiNascita: new Date('0001-01-01T00:49:56.000+00:45'),
        EtaAnniContraente: 0,
        IsMaschio: false,
        CodiceFiscale: '',
        StatoCivile: {
          value: '',
          key: 0,
        },
        NumeroDiFigliNonRisponde: false,
        AltrePersoneACaricoNonRisponde: false,
        AltrePersoneACaricoDaTutelareNonRisponde: false,
        NumeroDiFigli: {
          value: '',
          key: 0,
        },
        NumeroDiPersoneACarico: {
          value: '',
          key: 0,
        },
        DiCuiDaTutelare: {
          value: '',
          key: 0,
        },
        ScoreMotivazioneSoggettiDaTutelare: {
          Score: 0,
          MotivazioneInadeguato: null,
        },
        TipologiaProdotto: {
          value: '',
          key: 0,
        },
        StatoOccupazionale: {
          value: '',
          key: 0,
        },
        PersoneCheLavoranoNucleoFamiliare: 0,
        ScoreMotivazioneStatoOccupazionale: {
          Score: 0,
          MotivazioneInadeguato: null,
        },
        IsAdeguato: false,
        PunteggioAdeguatezza: 0,
        MotivazioniInadeguato: null,
        AltriProdottiVita: {
          value: '',
          key: 0,
        },
        AltriProdottiVitaNew: [],
        AltriProdottiVitaV3: [],
        ScoreMotivazioneProdottiVita: {
          Score: 0,
          MotivazioneInadeguato: null,
        },
        ScoreMotivazioneProdottiVitaNew: {
          Score: 0,
          MotivazioneInadeguato: null,
        },
        ScoreMotivazioneProdottiVitaV3: null,
        NonRispondeAmmontareAnnuoImpegniAssunti: false,
        PremioAnnuoImpegniAssunti: '',
        PremioUnicoImpegniAssunti: '',
        RisposteFinanziarie: [],
        PropostaIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
        StatoPubblicazione: {
          value: 'Bozza',
          key: 1,
        },
      },
      RisultatoQuestionario: {
        StatoPubblicazione: {
          value: 'Bozza',
          key: 1,
        },
        Punteggio: 0,
        Motivazioni: [],
        RisposteQuestionario: [],
        IsAdeguato: false,
      },
      PremioLordo: '0',
      IndicatoreDiValore: '0',
      DataDisposizioneBonifico: new Date('0001-01-01T00:49:56.000+00:45'),
      DataDecorrenza: new Date(),
      DataFirma: new Date('0001-01-01T00:49:56.000+00:45'),
      PercentualiInvestimentoFondiInterni: [],
    },
  };
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} body
 */
function create(mongodb, body) {
  return mongodb
    .collection(COLLECTION_NAME)
    .insertOne(mapPracticeToInsert(body))
    .then((result) => {
      if (!result.result.ok) return Promise.reject(new Error('Impossibile inserire la pratica'));
      return Promise.resolve(mapPractice(result.ops[0]));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} body
 */
function createAdditionaIncome(mongodb, body) {
  return mongodb
    .collection(COLLECTION_NAME)
    .insertOne(mapAdditionalIncomeToInsert(body))
    .then((result) => {
      if (!result.result.ok) return Promise.reject(new Error('Impossibile inserire la pratica'));
      return Promise.resolve(mapPractice(result.ops[0]));
    });
}

/**
 * @param {Mongo.Db} mongodb
 */
function createIndexes(mongodb) {
  return mongodb.collection(COLLECTION_NAME).createIndex({ _id: 1 });
}

module.exports = {
  create,
  createAdditionaIncome,
  getById,
  getByUuid,
  updateIVById,
  getSubscriptionById,
  getByCustomerId,
  getByProductivePeriod,
  getAll,
  getAllCursor,
  getCustomerCursor,
  getAllByProductivePeriod,
  getByPromoterIdAndProductiveRange,
  getByPromoterIdAndProductivePeriod,
  countByDossierFilterAndProductiveRange,
  countCustomerIdContractsByDossierFilterAndProductiveRange,
  countCustomerIdProductionByDossierFilterAndProductiveRange,
  countCustomerIdProposalsByDossierFilterAndProductiveRange,
  countCustomerIdPackageByDossierFilterAndProductiveRange,
  countCustomerIdNegativeByDossierFilterAndProductiveRange,
  sumContractsByDossierFilterAndProductiveRange,
  sumProductionByDossierFilterAndProductiveRange,
  sumProposalsByDossierFilterAndProductiveRange,
  sumPackageByDossierFilterAndProductiveRange,
  sumOverdueByDossierFilterAndProductiveRange,
  sumNegativeByDossierFilterAndProductiveRange,
  listContractsByDossierFilterAndProductiveRange,
  listProductionByDossierFilterAndProductiveRange,
  listProductionExportByDossierFilterAndProductiveRange,
  listProposalsByDossierFilterAndProductiveRange,
  listPackageByDossierFilterAndProductiveRange,
  listOverdueByDossierFilterAndProductiveRange,
  listNegativeByDossierFilterAndProductiveRange,
  getOneByDossierId,
  getByContractId,
  searchByContract,
  getSingleByContractId,
  getByIdOldStyle,
  getSubscriptionByIdLegacy,
  getByBinaryIdOldStyle,
  mapSubscriptionCommissioningOption,
  mapType,
  mapPractice,
  createIndexes,
};
