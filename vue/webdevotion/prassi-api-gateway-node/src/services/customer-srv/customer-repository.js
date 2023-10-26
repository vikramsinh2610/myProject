const Mongo = require('mongodb');
const { unparse } = require('uuid-parse');
const { v4: uuid } = require('uuid');
const Customer = require('./customer');
const CustomerSync = require('./customer-sync');
const IdentityCard = require('./identity-card');
const IdentityCardSync = require('./identity-card-sync');
const { uuidToBinary } = require('../../utils/uuid-to-binary');
const { capitalizeFirstLetter } = require('../../utils/text-helper');

const COLLECTION_NAME = 'Customer';
const PROJECTION = {
  Nome: true,
  Cognome: true,
  CodiceFiscale: true,
  Address: true,
  Telefono: true,
  Cellulare: true,
  DataDiNascita: true,
  CittaDiNascita: true,
  ProvinciaDiNascita: true,
  PartitaIva: true,
  PaeseDiNascita: true,
  IsPersonaFisica: true,
  Sesso: true,
  Email: true,
  SedeLegale: true,
  SedeDomicilio: true,
  CreatedOn: true,
  ModifiedOn: true,
  Status: true,
  Tipo: true,
  Priority: true,
  LinkedIn: true,
  Facebook: true,
  Twitter: true,
  AnnoFondazione: true,
  FormaGiuridica: true,
  Documento: true,
};

const PROJECTION_SYNC = {
  Nome: true,
  Cognome: true,
  CodiceFiscale: true,
  Address: true,
  Telefono: true,
  Cellulare: true,
  DataDiNascita: true,
  CittaDiNascita: true,
  ProvinciaDiNascita: true,
  PartitaIva: true,
  PaeseDiNascita: true,
  IsPersonaFisica: true,
  Sesso: true,
  Email: true,
  SedeLegale: true,
  SedeDomicilio: true,
  CreatedOn: true,
  ModifiedOn: true,
  Status: true,
  Tipo: true,
  Priority: true,
  LinkedIn: true,
  Facebook: true,
  Twitter: true,
  AnnoFondazione: true,
  Nazionalita: true,
  FormaGiuridica: true,
  References: true,
  TitolariEffettivi: true,
  LegaleRappresentante: true,
  Commercialista: true,
  ReferentiAziendali: true,
  PersoneCollegate: true,
};

function mapAddress(Indirizzo) {
  let address = {};
  if (Indirizzo) {
    const route = Indirizzo.Route ? capitalizeFirstLetter(`${Indirizzo.Route}`.trim()) : '';
    const streetNumber = Indirizzo.StreetNumber ? `${Indirizzo.StreetNumber}`.trim() : '';
    const postalCode = Indirizzo.PostalCode ? `${Indirizzo.PostalCode}`.trim() : '';
    const city = Indirizzo.Locality ? capitalizeFirstLetter(`${Indirizzo.Locality}`.trim()) : '';
    const province = Indirizzo.Province ? `${Indirizzo.Province}`.trim().toUpperCase() : '';
    const country = Indirizzo.Country ? capitalizeFirstLetter(`${Indirizzo.Country}`) : '';
    address = {
      route,
      streetNumber,
      city,
      postalCode,
      province,
      country,
    };
  }
  return address;
}

function translateCustomerType(type) {
  switch (type) {
    case 1:
      return 'Contatto';
    case 2:
      return 'Cliente';
    default:
      return 'Contatto';
  }
}

function translateFormaGiuridica(forma) {
  switch (forma) {
    case 'srl':
      return {
        value: 'Srl',
        key: 1,
      };
    case 'srls':
      return {
        value: 'Srls',
        key: 2,
      };
    case 'snc':
      return {
        value: 'Snc',
        key: 3,
      };
    case 'sas':
      return {
        value: 'Sas',
        key: 4,
      };
    case 'spa':
      return {
        value: 'Spa',
        key: 5,
      };
    case 'sapa':
      return {
        value: 'Sapa',
        key: 6,
      };
    case 'scarl':
      return {
        value: 'Scarl',
        key: 7,
      };
    case 'onlus':
      return {
        value: 'Onlus',
        key: 8,
      };
    case 'other':
      return {
        value: 'Altro',
        key: 9,
      };
    default:
      return null;
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function mapCustomer(x) {
  return new Customer({
    _id: unparse(x._id.buffer),
    name: x.Nome ? capitalizeFirstLetter(x.Nome) : '',
    surname: x.Cognome ? capitalizeFirstLetter(x.Cognome) : '',
    fiscalCode: x.CodiceFiscale ? `${x.CodiceFiscale}`.toUpperCase() : '',
    vat: x.PartitaIva,
    address: mapAddress(x.Address && x.Address.Route ? x.Address : x.SedeDomicilio),
    fixedPhone: x.Telefono,
    mobilePhone: x.Cellulare,
    birthDate: x.DataDiNascita,
    birthCity: x.CittaDiNascita,
    physicalPerson: x.IsPersonaFisica,
    sex: x.Sesso === 'Maschio' ? 'M' : 'F',
    email: x.Email,
    birthRegion: x.ProvinciaDiNascita,
    birthState: x.StatoDiNascita,
    legalAddress: mapAddress(x.SedeLegale),
    created: x.CreatedOn,
    modified: x.ModifiedOn,
    statusDisplayValue: x.Status ? x.Status.value : '',
    statusKey: x.Status ? x.Status.key : null,
    typeDisplayValue: x.Tipo ? x.Tipo.value : '',
    typeKey: x.Tipo ? x.Tipo.key : null,
    priorityDisplayValue: x.Priority ? x.Priority.value : '',
    linkedIn: x.LinkedIn,
    facebook: x.Facebook,
    twitter: x.Twitter,
    nationality: x.Nazionalita,
    foundationDate: x.AnnoFondazione,
    companyType: x.FormaGiuridica,
    document: x.Documento,
  });
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function mapCustomerForSync(x) {
  return new CustomerSync({
    _id: unparse(x._id.buffer),
    name: x.Nome ? capitalizeFirstLetter(x.Nome) : '',
    surname: x.Cognome ? capitalizeFirstLetter(x.Cognome) : '',
    fiscalCode: x.CodiceFiscale ? `${x.CodiceFiscale}`.toUpperCase() : '',
    vat: x.PartitaIva,
    address: mapAddress(x.Address && x.Address.Route ? x.Address : x.SedeDomicilio),
    fixedPhone: x.Telefono,
    mobilePhone: x.Cellulare,
    birthDate: x.DataDiNascita,
    birthCity: x.CittaDiNascita,
    physicalPerson: x.IsPersonaFisica,
    sex: x.Sesso === 'Maschio' ? 'M' : 'F',
    email: x.Email,
    birthRegion: x.ProvinciaDiNascita,
    birthState: x.StatoDiNascita,
    legalAddress: mapAddress(x.SedeLegale),
    created: x.CreatedOn,
    modified: x.ModifiedOn,
    statusDisplayValue: x.Status ? x.Status.value : '',
    statusKey: x.Status ? x.Status.key : null,
    typeDisplayValue: x.Tipo ? x.Tipo.value : '',
    typeKey: x.Tipo ? x.Tipo.key : null,
    priorityDisplayValue: x.Priority ? x.Priority.value : '',
    linkedIn: x.LinkedIn,
    facebook: x.Facebook,
    twitter: x.Twitter,
    nationality: x.Nazionalita,
    foundationDate: x.AnnoFondazione,
    companyType: x.FormaGiuridica,
    references: x.References,
    effectives: x.TitolariEffettivi,
    acquiring: x.AcquisitoDa,
    legal: x.LegaleRappresentante,
    taxLawyer: x.Commercialista,
    companyReference: x.ReferentiAziendali,
    referral: x.PersoneCollegate,
  });
}

function mapCustomerToInsert(x) {
  return {
    _id: uuidToBinary(uuid()),
    CreatedOn: new Date(),
    ModifiedOn: new Date(),
    Nome: x.type === '1' ? x.name : x.companyName,
    Cognome: x.surname,
    Telefono: x.phone,
    Cellulare: x.mobilePhone,
    TelefonoLavoro: x.phone,
    IsPersonaFisica: x.type === '1',
    Email: x.email,
    Enabled: true,
    DisabledOn: null,
    CreatedByIdentifier: null,
    StatoPubblicazione: {
      value: 'Bozza',
      key: 1,
    },
    ExpiresOn: new Date('0001-01-01T00:49:56.000+00:45'),
    IsSync: false,
    StoricoGerarchieIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
    FormaGiuridica: x.type === '1' ? null : translateFormaGiuridica(x.companyType),
    PartitaIva: x.type === '1' ? null : x.fiscalCode,
    AnnoFondazione: null,
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
    SedeDomicilio: {
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
    LegaleRappresentante: null,
    TitolariEffettivi: null,
    Commercialista: null,
    ReferentiAziendali: null,
    ProvenienzaContatto: null,
    PersoneCollegate: null,
    NormalizationDate: null,
    OMDIdentifier: 0,
    Target: null,
    AcquisitoDa: null,
    PotenzialiSegnalati: null,
    Sesso: '',
    DataDiNascita: new Date('1970-01-01T00:49:56.000+00:45'),
    PaeseDiNascita: null,
    ProvinciaDiNascita: null,
    CittaDiNascita: null,
    StatoCivile: null,
    NumeroDiFigli: null,
    NumeroDiPersoneACarico: null,
    DiCuiDaTutelare: null,
    Address: null,
    Nazionalita: null,
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
    TelefonoCasa: null,
    LinkedIn: null,
    Facebook: null,
    Twitter: null,
    GooglePlus: null,
    CodiceFiscale: x.type === '1' ? x.fiscalCode : null,
    Immobili: null,
    Automobili: 0,
    Moto: 0,
    Barche: 0,
    DestinazioneTFR: null,
    RedditoFamiliareNetto: null,
    StatoOccupazionale: null,
    RuoloStatoOccupazionale: null,
    DataDiAssunzione: new Date('0001-01-01T00:49:56.000+00:45'),
    AnzianitaLavorativa: 0,
    LuogoDiLavoro: null,
    GradoEducazione: null,
    IsEducazionePrivata: false,
    PossiedeImmobili: null,
    EsisteMutuo: false,
    RataMensile: 0,
    DebitoResiduo: 0,
    AssociataTCM: null,
    InvestimentiTotali: null,
    DiCuiLiquidita: null,
    DiCuiTitoliDiStato: null,
    DiCuiObbligazioni: null,
    DiCuiAzioni: null,
    DiCuiFondiComuni: null,
    DiCuiPolizzeAssicurative: null,
    Famigliari: null,
    Status: {
      value: 'Prospect',
      key: 2,
    },
    Priority: {
      value: 'Bassa',
      key: 1,
    },
    Lifestyles: null,
    Mood: null,
    ConsigliVendita: null,
    RedditoNettoAnnuo: null,
    RisparmioMedioAnnuo: null,
    AspettativeCapacitaDiRisparmio: null,
    PensioneObbligatoriaSufficiente: false,
    SottoscrittoFormeDiPrevidenzaComplementare: null,
    PensatoAltreFormeDiIntegrazioneDellaPensione: null,
    CoperturaMalattiaLungoTermine: null,
    CoperturaMorte: null,
    CoperturaAltre: null,
    GerarchiaInterna: {
      GerarchiaResponsabiliCorrente: {
        DMIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
        NomeDM: '',
        BMIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
        NomeBM: '',
        TMIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
        NomeTM: '',
        UtenteInternoIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
        NomeUtenteInterno: '',
        FullTextSearch: '',
        FullTextIdentifierSearch: '',
        Ruolo: {
          value: 'Branch Manager',
          key: 5,
        },
      },
      GerarchiaReteCorrente: {
        AreaIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
        NomeArea: '',
        FilialeIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
        NomeFiliale: '',
        SettoreIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
        NomeSettore: null,
        ZonaIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
        NomeZona: null,
        ElementoReteIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
        NomeElementoRete: '',
        TipoElementoRete: {
          value: 'Filiale',
          key: 3,
        },
        ElementoReteCompleto: '',
        FullTextIdentifierSearch: '',
        FullTextSearch: '',
      },
      GerarchiaResponsabiliHistory: [
        {
          GerarchiaResponsabili: {
            DMIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
            NomeDM: '',
            BMIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
            NomeBM: '',
            TMIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
            NomeTM: '',
            UtenteInternoIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
            NomeUtenteInterno: '',
            FullTextSearch: '',
            FullTextIdentifierSearch: '',
            Ruolo: {
              value: 'Branch Manager',
              key: 5,
            },
          },
          MeseProduttivo: new Date().getMonth() + 1,
          AnnoProduttivo: new Date().getFullYear(),
          LastModifiedOn: new Date(),
        },
      ],
      GerarchiaReteHistory: [
        {
          GerarchiaRete: {
            AreaIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
            NomeArea: '',
            FilialeIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
            NomeFiliale: '',
            SettoreIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
            NomeSettore: null,
            ZonaIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
            NomeZona: null,
            ElementoReteIdentifier: uuidToBinary('00000000-0000-0000-0000-000000000000'),
            NomeElementoRete: '',
            TipoElementoRete: {
              value: 'Filiale',
              key: 3,
            },
            ElementoReteCompleto: '',
            FullTextIdentifierSearch: '',
            FullTextSearch: '',
          },
          MeseProduttivo: new Date().getMonth() + 1,
          AnnoProduttivo: new Date().getFullYear(),
          LastModifiedOn: new Date(),
        },
      ],
    },
    Note: null,
    Tipo: {
      value: 'Contatto',
      key: 1,
    },
    References: [],
    NomeCompleto: x.type === '1' ? `${x.name} ${x.surname}` : x.companyName,
  };
}

function mapLegalCustomerToUpdate(x) {
  return {
    Identifier: uuidToBinary(x.uuid),
    Nome: !x.isCompany ? x.name : x.companyName,
    Cognome: x.surname,
    Telefono: x.fixedPhone ? x.fixedPhone : '',
    Cellulare: x.mobilePhone ? x.mobilePhone : '',
    IsPersonaFisica: !x.isCompany,
    Email: x.email,
    FormaGiuridica: x.companyType,
    SedeLegale: {
      TypedAddress: '',
      StreetNumber: x.legalAddress.streetNumber,
      Route: x.legalAddress.route,
      Locality: x.legalAddress.city,
      Province: x.legalAddress.province,
      Region: '',
      Country: x.legalAddress.country,
      PostalCode: x.legalAddress.postalCode,
      Latitude: '0',
      Longitude: '0',
    },
    SedeDomicilio: {
      TypedAddress: '',
      StreetNumber: x.address ? x.address.streetNumber : '',
      Route: x.address ? x.address.route : '',
      Locality: x.address ? x.address.city : '',
      Province: x.address ? x.address.province : '',
      Region: '',
      Country: x.address ? x.address.country : '',
      PostalCode: x.address ? x.address.postalCode : '',
      Latitude: '0',
      Longitude: '0',
    },
    Tipo: {
      value: translateCustomerType(x.customerType),
      key: x.customerType ? x.customerType : 1,
    },
    DataDiNascita: x.birthDate,
    PaeseDiNascita: x.birthState,
    ProvinciaDiNascita: x.birthRegion,
    CittaDiNascita: x.birthCity,
    PartitaIva: x.isCompany ? x.fiscalCode : null,
    CodiceFiscale: x.isCompany ? null : x.fiscalCode,
    NomeCompleto: !x.isCompany ? `${x.name} ${x.surname}` : x.companyName,
    LegaleRappresentante: x.legalPerson,
  };
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function mapCustomerToUpdate(x) {
  return {
    ModifiedOn: new Date(),
    Nome: !x.isCompany ? x.name : x.companyName,
    Cognome: x.surname,
    Telefono: x.fixedPhone ? x.fixedPhone : '',
    Cellulare: x.mobilePhone ? x.mobilePhone : '',
    TelefonoLavoro: x.workPhone ? x.workPhone : '',
    IsPersonaFisica: !x.isCompany,
    Email: x.email,
    FormaGiuridica: x.companyType,
    // eslint-disable-next-line no-nested-ternary
    AnnoFondazione: x.foundationDate
      ? x.foundationDate instanceof Date
        ? x.foundationDate.toISOString().slice(0, 4)
        : x.foundationDate.slice(0, 4)
      : null,
    SedeLegale: {
      TypedAddress: '',
      StreetNumber: x.legalAddress.streetNumber,
      Route: x.legalAddress.route,
      Locality: x.legalAddress.city,
      Province: x.legalAddress.province,
      Region: '',
      Country: x.legalAddress.country,
      PostalCode: x.legalAddress.postalCode,
      Latitude: '0',
      Longitude: '0',
    },
    SedeDomicilio: {
      TypedAddress: '',
      StreetNumber: x.address ? x.address.streetNumber : '',
      Route: x.address ? x.address.route : '',
      Locality: x.address ? x.address.city : '',
      Province: x.address ? x.address.province : '',
      Region: '',
      Country: x.address ? x.address.country : '',
      PostalCode: x.address ? x.address.postalCode : '',
      Latitude: '0',
      Longitude: '0',
    },
    Tipo: {
      value: translateCustomerType(x.customerType),
      key: x.customerType ? x.customerType : 1,
    },
    DataDiNascita: x.birthDate,
    PaeseDiNascita: x.birthState,
    ProvinciaDiNascita: x.birthRegion,
    CittaDiNascita: x.birthCity,
    PartitaIva: x.isCompany ? x.fiscalCode : null,
    CodiceFiscale: x.isCompany ? null : x.fiscalCode,
    NomeCompleto: !x.isCompany ? `${x.name} ${x.surname}` : x.companyName,
    LegaleRappresentante: x.legalPerson ? mapLegalCustomerToUpdate(x.legalPerson) : null,
  };
}

function mapIdentityCardUpdate(x) {
  return {
    Documento: {
      DataEmissioneDocumento: x.issueDate,
      EnteEmissioneDocumento: x.issueAuthority,
      NumeroDocumento: x.documentNumber,
      NazioneEmissione: x.issueCountry,
      ProvinciaEmissione: x.issueRegion,
      ComuneEmissione: x.issueCity,
      DataScadenza: x.expiryDate,
      TipoDocumento: x.documentType,
    },
  };
}

function mapLegalPersonUpdate(x) {
  return {
    LegaleRappresentante: {
      DataEmissioneDocumento: x.issueDate,
      EnteEmissioneDocumento: '',
      NumeroDocumento: x.documentNumber,
      NazioneEmissione: '',
      ProvinciaEmissione: '',
      ComuneEmissione: '',
      DataScadenza: x.expiryDate,
      TipoDocumento: x.documentType,
    },
  };
}

function mapIdentityCard(x) {
  return new IdentityCard({
    _id: unparse(x.CustomerIdentifier.buffer),
    name: x.Nome ? capitalizeFirstLetter(x.Nome) : '',
    surname: x.Cognome ? capitalizeFirstLetter(x.Cognome) : '',
    fiscalCode: x.CodiceFiscale ? `${x.CodiceFiscale}`.toUpperCase() : '',
    identityCardType: x.TipoDocumento ? x.TipoDocumento.value : '',
    identityCardNumber: x.NumeroDocumento,
    identityCardIssueDate: x.DataEmissioneDocumento,
    identityCardExpiryDate: x.DataScadenza,
  });
}

function mapIdentityCardSync(x) {
  return new IdentityCardSync({
    _id: unparse(x._id.buffer),
    customerId: unparse(x.customerId.buffer),
    identityCardType: x.TipoDocumento,
    identityCardNumber: x.NumeroDocumento,
    identityCardIssueDate: x.DataEmissioneDocumento,
    identityCardExpiryDate: x.DataScadenza,
    identityCardTextType: x.Tipo,
  });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} body
 */
function create(mongodb, body) {
  return mongodb
    .collection(COLLECTION_NAME)
    .insertOne(mapCustomerToInsert(body))
    .then((result) => {
      if (!result.result.ok) return Promise.reject(new Error('Impossibile inserire il cliente'));
      return Promise.resolve(mapCustomer(result.ops[0]));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} customer
 */
function update(mongodb, customer) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne({ _id: uuidToBinary(customer.uuid) }, { $set: mapCustomerToUpdate(customer) }, { upsert: false })
    .then(() => customer)
    .catch(() => customer);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} customer
 */
function updateDocument(mongodb, customer) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne({ _id: uuidToBinary(customer.uuid) }, { $set: mapIdentityCardUpdate(customer) }, { upsert: false })
    .then(() => customer)
    .catch(() => customer);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} customer
 */
function updateLegalPerson(mongodb, customer) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne({ _id: uuidToBinary(customer.uuid) }, { $set: mapLegalPersonUpdate(customer) }, { upsert: false })
    .then(() => customer)
    .catch(() => customer);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} customerId
 */
function getById(mongodb, customerId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne(
      { _id: uuidToBinary(customerId) },
      {
        projection: PROJECTION,
      },
    )
    .then((x) => {
      if (!x) return Promise.reject(new Error(`Cannot find customer: ${customerId}`));
      return Promise.resolve(mapCustomer(x));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} customerId
 */
async function deleteById(mongodb, customerId) {
  await mongodb
    .collection(process.env.EDITION === 'tcw' ? 'PrivacyCliente' : 'MandatoCliente')
    .deleteMany({ CustomerIdentifier: uuidToBinary(customerId) })
    .then((el) => el)
    .catch((error) => error);

  await mongodb
    .collection('customer-insurer')
    .deleteMany({ customerId })
    .then((el) => el)
    .catch((error) => error);

  return mongodb
    .collection(COLLECTION_NAME)
    .deleteOne({ _id: uuidToBinary(customerId) })
    .then((x) => Promise.resolve(x));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} skip
 * @param {number} limit
 * @param {object} filter
 * @returns {Promise<Array<Customer>>}
 */
function getAll(mongodb, skip = 0, limit = 0, filter = {}) {
  let query = mongodb
    .collection(COLLECTION_NAME)
    .find(filter, {
      projection: PROJECTION,
    })
    .sort({ Nome: 1, Cognome: 1 });

  query = skip ? query.skip(skip) : query;
  query = limit ? query.limit(limit) : query;

  return query.toArray().then((customers) => customers.map((customer) => mapCustomer(customer)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} skip
 * @param {number} limit
 * @param {object} filter
 * @returns {Promise<Array<CustomerSync>>}
 */
function getAllForSync(mongodb, skip = 0, limit = 0, filter = {}) {
  let query = mongodb
    .collection(COLLECTION_NAME)
    .find(filter, {
      projection: PROJECTION_SYNC,
    })
    .sort({ Nome: 1, Cognome: 1 });

  query = skip ? query.skip(skip) : query;
  query = limit ? query.limit(limit) : query;

  return query.toArray().then((customers) => customers.map((customer) => mapCustomerForSync(customer)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} skip
 * @param {number} limit
 * @param {object} filter
 * @param {object} filterIdCard
 * @param {boolean} nosort
 * @returns {Promise<Array<IdentityCard>>}
 */
function getAllIdentityCardsMandato(mongodb, skip = 0, limit = 0, filter = {}, filterIdCard = {}, nosort = false) {
  let query = mongodb.collection('MandatoCliente').aggregate([
    {
      $match: {
        ...filter,
        'StatoApprovazione.key': 2,
      },
    },
    { $sort: { DataApprovazione: -1 } },
    {
      $group: {
        _id: '$CustomerIdentifier',
        CustomerIdentifier: { $first: '$CustomerIdentifier' },
        Nome: { $first: '$Nome' },
        Cognome: { $first: '$Cognome' },
        fiscalCode: { $first: 'CodiceFiscale' },
        NomeCliente: { $first: '$NomeCliente' },
        Allegati: { $first: '$Allegati' },
      },
    },
    { $unwind: '$Allegati' },
    {
      $match: {
        $or: [{ 'Allegati.Tipo': 'Documento identità' }, { 'Allegati.Tipo': 'Codice Fiscale' }],
      },
    },
    { $sort: { 'Allegati.DataScadenza': -1 } },
    {
      $group: {
        _id: '$_id',
        CustomerIdentifier: { $first: '$CustomerIdentifier' },
        Nome: { $first: '$Nome' },
        Cognome: { $first: '$Cognome' },
        fiscalCode: { $first: '$fiscalCode' },
        NomeCliente: { $first: '$NomeCliente' },
        NumeroDocumento: { $first: '$Allegati.NumeroDocumento' },
        DataEmissioneDocumento: { $first: '$Allegati.DataEmissioneDocumento' },
        DataScadenza: { $first: '$Allegati.DataScadenza' },
        TipoDocumento: { $first: '$Allegati.TipoDocumento' },
      },
    },
    {
      $match: {
        ...filterIdCard,
      },
    },
  ]);

  query = nosort ? query : query.sort({ Nome: 1, Cognome: 1 });
  query = skip ? query.skip(skip) : query;
  query = limit ? query.limit(limit) : query;

  return query.toArray().then((customers) => customers.map((customer) => mapIdentityCard(customer)));
}

/**
 * @param {Mongo.Db} mongodb
 * @returns {Promise<Array<IdentityCardSync>>}
 */
function getAllIdentityCardsNoFilterMandato(mongodb) {
  const query = mongodb.collection('MandatoCliente').aggregate([
    {
      $match: {
        'StatoApprovazione.key': 2,
      },
    },
    { $sort: { DataApprovazione: -1 } },
    {
      $group: {
        _id: '$CustomerIdentifier',
        CustomerIdentifier: { $first: '$CustomerIdentifier' },
        Nome: { $first: '$Nome' },
        Cognome: { $first: '$Cognome' },
        fiscalCode: { $first: 'CodiceFiscale' },
        NomeCliente: { $first: '$NomeCliente' },
        Allegati: { $first: '$Allegati' },
      },
    },
    { $unwind: '$Allegati' },
    {
      $match: {
        $or: [{ 'Allegati.Tipo': 'Documento identità' }, { 'Allegati.Tipo': 'Codice Fiscale' }],
      },
    },
    { $sort: { 'Allegati.DataScadenza': -1 } },
    {
      $group: {
        _id: '$Allegati.AttachmentIdentifier',
        customerId: { $first: '$CustomerIdentifier' },
        Nome: { $first: '$Nome' },
        Cognome: { $first: '$Cognome' },
        fiscalCode: { $first: '$fiscalCode' },
        NomeCliente: { $first: '$NomeCliente' },
        NumeroDocumento: { $first: '$Allegati.NumeroDocumento' },
        DataEmissioneDocumento: { $first: '$Allegati.DataEmissioneDocumento' },
        DataScadenza: { $first: '$Allegati.DataScadenza' },
        TipoDocumento: { $first: '$Allegati.TipoDocumento' },
        Tipo: { $first: '$Allegati.Tipo' },
      },
    },
  ]);

  return query.toArray().then((customers) => customers.map((customer) => mapIdentityCardSync(customer)));
}

/**
 * @param {Mongo.Db} mongodb
 * @returns {Promise<Array<IdentityCardSync>>}
 */
function getAllIdentityCardsNoFilterPrivacy(mongodb) {
  const query = mongodb.collection('PrivacyCliente').aggregate([
    {
      $match: {
        'StatoApprovazione.key': 2,
      },
    },
    { $sort: { DataApprovazione: -1 } },
    {
      $group: {
        _id: '$CustomerIdentifier',
        CustomerIdentifier: { $first: '$CustomerIdentifier' },
        Nome: { $first: '$Nome' },
        Cognome: { $first: '$Cognome' },
        fiscalCode: { $first: 'CodiceFiscale' },
        NomeCliente: { $first: '$NomeCliente' },
        Allegati: { $first: '$Allegati' },
      },
    },
    { $unwind: '$Allegati' },
    {
      $match: {
        'Allegati.Tipo': 'Documento identità',
      },
    },
    { $sort: { 'Allegati.DataScadenza': -1 } },
    {
      $group: {
        _id: '$Allegati.AttachmentIdentifier',
        customerId: { $first: '$CustomerIdentifier' },
        Nome: { $first: '$Nome' },
        Cognome: { $first: '$Cognome' },
        fiscalCode: { $first: '$fiscalCode' },
        NomeCliente: { $first: '$NomeCliente' },
        NumeroDocumento: { $first: '$Allegati.NumeroDocumento' },
        DataEmissioneDocumento: { $first: '$Allegati.DataEmissioneDocumento' },
        DataScadenza: { $first: '$Allegati.DataScadenza' },
        TipoDocumento: { $first: '$Allegati.TipoDocumento' },
      },
    },
  ]);

  return query.toArray().then((customers) => customers.map((customer) => mapIdentityCardSync(customer)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} skip
 * @param {number} limit
 * @param {object} filter
 * @param {object} filterIdCard
 * @param {boolean} nosort
 * @returns {Promise<Array<IdentityCard>>}
 */
function getAllIdentityCardsPrivacy(mongodb, skip = 0, limit = 0, filter = {}, filterIdCard = {}, nosort = false) {
  let query = mongodb.collection('PrivacyCliente').aggregate([
    {
      $match: {
        ...filter,
        'StatoApprovazione.key': 2,
      },
    },
    { $sort: { DataApprovazione: -1 } },
    {
      $group: {
        _id: '$CustomerIdentifier',
        CustomerIdentifier: { $first: '$CustomerIdentifier' },
        Nome: { $first: '$Nome' },
        Cognome: { $first: '$Cognome' },
        fiscalCode: { $first: 'CodiceFiscale' },
        NomeCliente: { $first: '$NomeCliente' },
        Allegati: { $first: '$Allegati' },
      },
    },
    { $unwind: '$Allegati' },
    {
      $match: {
        'Allegati.Tipo': 'Documento identità',
      },
    },
    { $sort: { 'Allegati.DataScadenza': -1 } },
    {
      $group: {
        _id: '$_id',
        CustomerIdentifier: { $first: '$CustomerIdentifier' },
        Nome: { $first: '$Nome' },
        Cognome: { $first: '$Cognome' },
        fiscalCode: { $first: '$fiscalCode' },
        NomeCliente: { $first: '$NomeCliente' },
        NumeroDocumento: { $first: '$Allegati.NumeroDocumento' },
        DataEmissioneDocumento: { $first: '$Allegati.DataEmissioneDocumento' },
        DataScadenza: { $first: '$Allegati.DataScadenza' },
        TipoDocumento: { $first: '$Allegati.TipoDocumento' },
      },
    },
    {
      $match: {
        ...filterIdCard,
      },
    },
  ]);

  query = nosort ? query : query.sort({ Nome: 1, Cognome: 1 });
  query = skip ? query.skip(skip) : query;
  query = limit ? query.limit(limit) : query;

  return query.toArray().then((customers) => customers.map((customer) => mapIdentityCard(customer)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<string>} customerIds
 * @returns {Promise<Array<Customer>>}
 */
function getByIds(mongodb, customerIds) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(
      { _id: { $in: customerIds.map((customerId) => uuidToBinary(customerId)) } },
      {
        projection: PROJECTION,
      },
    )
    .toArray()
    .then((customers) => customers.map((customer) => mapCustomer(customer)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<Customer>} seed
 */
function insertSeed(mongodb, seed) {
  return Promise.all(
    seed.map((s) => mongodb.collection(COLLECTION_NAME).replaceOne({ _id: s._id }, s, { upsert: true })),
  );
}

/**
 * @param {Mongo.Db} mongodb
 */
function createIndexes(mongodb) {
  return Promise.all([
    mongodb.collection(COLLECTION_NAME).createIndex({ _id: 1 }),
    mongodb.collection(COLLECTION_NAME).createIndex({ Nome: 1, Cognome: 1 }),
  ]);
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} promoterFilter
 * @returns {Promise<object>}
 */
function getIdsAndPromoterByPromoterFilter(mongodb, promoterFilter) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find({ ...promoterFilter }, { projection: { customerId: true, promoterId: true } })
    .toArray()
    .then(async (result) => {
      if (!result) return Promise.resolve({});
      return result.map((el) => ({ customerId: el.customerId, promoterId: el.promoterId }));
    });
}

module.exports = {
  getById,
  getAll,
  getAllForSync,
  getAllIdentityCardsMandato,
  getAllIdentityCardsNoFilterMandato,
  getAllIdentityCardsPrivacy,
  getAllIdentityCardsNoFilterPrivacy,
  create,
  update,
  updateDocument,
  updateLegalPerson,
  deleteById,
  getByIds,
  insertSeed,
  createIndexes,
  getIdsAndPromoterByPromoterFilter,
};
