const Mongo = require('mongodb');
const { unparse } = require('uuid-parse');
const Promoter = require('./promoter');
const { uuidToBinary } = require('../../utils/uuid-to-binary');
const { mapFiscalRegimeType } = require('./filscal-regime-types');
const { capitalizeFirstLetter } = require('../../utils/text-helper');

const COLLECTION_NAME = 'UtenteInterno';
const PROJECTION = {
  Nome: true,
  Cognome: true,
  UserName: true,
  TipoDocumento: true,
  NumeroDocumento: true,
  RilasciatoDa: true,
  DataRilascio: true,
  DataScadenza: true,
  Matricola: true,
  Ruolo: true,
  Ivass: true,
  CodiceFiscale: true,
  Indirizzo: true,
  RegimeFiscale: true,
  IsAssunto: true,
  Iban: true,
  PartitaIva: true,
  GerarchiaResponsabili: true,
  StatoApprovazione: true,
  Enabled: true,
  ExpiresOn: true,
  CreatedOn: true,
  Telefono: true,
  Cellulare: true,
  DataDiNascita: true,
  ComuneDiNascita: true,
  IsPersonaFisica: true,
  IsMaschio: true,
  EmailAziendale: true,
  EmailPersonale: true,
  ProvinciaDiNascita: true,
  StatoDiNascita: true,
  DataAffidamento: true,
  DataFineAffidamento: true,
  FatturazioneElettronica: true,
  CodiceSoggetto: true,
  CodiceTributo: true,
  CompanyData: true,
  TitoloDiStudio: true,
};

function mapAddress(Indirizzo) {
  let address = {};
  if (Indirizzo) {
    const route = Indirizzo.Route ? capitalizeFirstLetter(`${Indirizzo.Route}`.trim()) : '';
    const streetNumber = Indirizzo.StreetNumber ? `${Indirizzo.StreetNumber}`.trim() : '';
    const postalCode = Indirizzo.PostalCode ? `${Indirizzo.PostalCode}`.trim() : '';
    const city = Indirizzo.Locality ? capitalizeFirstLetter(`${Indirizzo.Locality}`.trim()) : '';
    const province = Indirizzo.Province ? `${Indirizzo.Province}`.trim().toUpperCase() : '';
    const country = capitalizeFirstLetter(`${Indirizzo.Country}`);
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

/**
 * @param {string} field
 * @returns {string}
 */
function translateField(field) {
  switch (field) {
    case 'name':
      return 'Nome';
    case 'surname':
      return 'Cognome';
    case 'username':
      return 'UserName';
    case 'roleId':
      return 'Ruolo.key';
    case 'approved':
      return 'StatoApprovazione';
    case 'lastLoginDate':
      return 'CreatedOn';
    default:
      return field;
  }
}

function mapPromoter(x) {
  return new Promoter({
    _id: unparse(x._id.buffer),
    name: capitalizeFirstLetter(x.Nome),
    surname: capitalizeFirstLetter(x.Cognome),
    username: x.UserName,
    role: x.Ruolo,
    tipoDocumento: x.TipoDocumento,
    numeroDocumento: x.NumeroDocumento,
    documentoRilasciatoDa: x.RilasciatoDa,
    documentoDataRilascio: x.DataRilascio,
    documentoDataScadenza: x.DataScadenza,
    serialNumber: x.Matricola,
    ivass: x.Ivass,
    fiscalCode: `${x.CodiceFiscale}`.toUpperCase(),
    address: mapAddress(x.Indirizzo),
    gerarchiaResponsabili: x.GerarchiaResponsabili,
    tax: {
      iban: x.Iban,
      vat: x.PartitaIva,
      fiscalRegimeType: mapFiscalRegimeType(x.RegimeFiscale ? x.RegimeFiscale.key : 1, x.IsAssunto),
    },
    approved: x.StatoApprovazione != null ? x.StatoApprovazione.value === 'Approvato' : false,
    enabled: x.Enabled,
    networkEnterDate: x.CreatedOn,
    networkExitDate: x.DataFineAffidamento,
    fixedPhone: x.Telefono,
    mobilePhone: x.Cellulare,
    birthDate: x.DataDiNascita,
    birthCity: x.ComuneDiNascita,
    degree: x.TitoloDiStudio,
    physicalPerson: x.IsPersonaFisica,
    sex: x.IsMaschio === true ? 'M' : 'F',
    corporateEmail: x.EmailAziendale,
    personalEmail: x.EmailPersonale,
    birthRegion: x.ProvinciaDiNascita,
    birthState: x.StatoDiNascita,
    trustDate: x.DataAffidamento,
    endTrustDate: x.DataFineAffidamento,
    taxCode: x.CodiceTributo ? x.CodiceTributo : '',
    subjectCode: x.CodiceSoggetto ? x.CodiceSoggetto : '',
    eInvoice: x.FatturazioneElettronica ? x.FatturazioneElettronica : false,
    companyData: x.CompanyData,
  });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} promoterId
 * @param {import('../promoter-job-srv/role-ids').AuthRole} role
 * @returns {Promise<void>}
 */
function saveUserRole(mongodb, promoterId, role) {
  return mongodb
    .collection(COLLECTION_NAME)
    .updateOne({ _id: uuidToBinary(promoterId) }, { $set: { Ruolo: role } })
    .then((x) => {
      if (!x.result.ok) return Promise.reject(new Error('Error updateding promoter role'));
      return Promise.resolve();
    });
}

function mapMobilePhoneUpdate(x) {
  return {
    Cellulare: x.mobilePhone,
  };
}

/**
 * @param {Mongo.Db} mongodb
 * @param {object} promoter
 */
function updateMobilePhone(mongodb, promoter) {
  return (
    mongodb
      .collection(COLLECTION_NAME)
      // eslint-disable-next-line max-len
      .updateOne({ _id: uuidToBinary(promoter.id) }, { $set: mapMobilePhoneUpdate(promoter) }, { upsert: false })
      .then(() => promoter)
      .catch(() => promoter)
  );
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} promoterId
 */
function getById(mongodb, promoterId) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne(
      { _id: uuidToBinary(promoterId) },
      {
        projection: PROJECTION,
      },
    )
    .then((x) => {
      if (!x) {
        return Promise.reject(new Error(`Cannot find promoter: ${promoterId}`));
      }
      return Promise.resolve(mapPromoter(x));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {string} serialNumber
 */
function getBySerialNumber(mongodb, serialNumber) {
  return mongodb
    .collection(COLLECTION_NAME)
    .findOne(
      { Matricola: serialNumber },
      {
        projection: PROJECTION,
      },
    )
    .then((x) => {
      if (!x) {
        return Promise.reject(new Error(`Cannot find promoter with serial Number: ${serialNumber}`));
      }
      return Promise.resolve(mapPromoter(x));
    });
}

/**
 * @param {Mongo.Db} mongodb
 * @param {number} skip
 * @param {number} limit
 * @param {object} filter
 * @param {string} sortBy
 * @param {number} sortDirection
 * @returns {Promise<Array<Promoter>>}
 */
function getAll(mongodb, skip = 0, limit = 0, filter = {}, sortBy = 'name', sortDirection = 1) {
  let query = mongodb
    .collection(COLLECTION_NAME)
    .find(filter, {
      projection: PROJECTION,
    })
    .sort({ [translateField(sortBy)]: sortDirection });

  query = skip ? query.skip(skip) : query;
  query = limit ? query.limit(limit) : query;

  return query.toArray().then((promoters) => promoters.map((promoter) => mapPromoter(promoter)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<string>} promoterIds
 * @returns {Promise<Array<Promoter>>}
 */
function getByIds(mongodb, promoterIds) {
  return mongodb
    .collection(COLLECTION_NAME)
    .find(
      { _id: { $in: promoterIds.map((promoterId) => uuidToBinary(promoterId)) } },
      {
        projection: PROJECTION,
      },
    )
    .toArray()
    .then((promoters) => promoters.map((promoter) => mapPromoter(promoter)));
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<Promoter>} seed
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
  return mongodb.collection(COLLECTION_NAME).createIndex({ _id: 1 });
}

module.exports = {
  saveUserRole,
  getById,
  getAll,
  getByIds,
  insertSeed,
  createIndexes,
  updateMobilePhone,
  getBySerialNumber,
};
