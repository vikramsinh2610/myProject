// eslint-disable-next-line max-classes-per-file
const { v4: uuid4 } = require('uuid');
const Knex = require('knex');
const Mongo = require('mongodb');
const moment = require('moment');
const { unparse } = require('uuid-parse');
const Person = require('./person');
const CustomerSync = require('../customer-srv/customer-sync');
const { capitalizeFirstLetter } = require('../../utils/text-helper');
const { parse } = require('../../utils/productive-period-helper');
require('../../utils/foreach');

function buildId(customerId, productivePeriodYear, productivePeriodMonth) {
  if (
    !Number.isInteger(Number.parseInt(productivePeriodYear, 10)) ||
    !Number.isInteger(Number.parseInt(productivePeriodMonth, 10))
  ) {
    throw new TypeError('not integer year / month');
  }
  return `${customerId}-${parse(productivePeriodYear, productivePeriodMonth)}`;
}

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

// eslint-disable-next-line sonarjs/cognitive-complexity
function mapCustomerForEmbedded(x) {
  return new CustomerSync({
    _id:
      x.Identifier || x.identifier
        ? unparse(x.Identifier ? x.Identifier.buffer : x.identifier.buffer)
        : '00000000-0000-0000-0000-000000000000',
    name: x.Nome ? capitalizeFirstLetter(x.Nome) : '',
    surname: x.Cognome ? capitalizeFirstLetter(x.Cognome) : '',
    fiscalCode: x.CodiceFiscale ? `${x.CodiceFiscale}`.toUpperCase() : '',
    vat: x.PartitaIva,
    address: mapAddress(x.Address && x.Address.Route ? x.Address : x.IndirizzoDomicilio),
    fixedPhone: x.Telefono,
    mobilePhone: x.Cellulare,
    birthDate: x.DataDiNascita,
    birthCity: x.CittaDiNascita,
    physicalPerson: x.IsPersonaFisica,
    sex: x.Sesso === 'Maschio' ? 'M' : 'F',
    email: x.Email,
    birthRegion: x.ProvinciaDiNascita,
    birthState: x.StatoDiNascita,
    legalAddress: mapAddress(x.IndirizzoResidenza),
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
    legal: x.LegaleRappresentante,
    taxLawyer: x.Commercialista,
    companyReference: x.ReferentiAziendali,
    referral: x.PersoneCollegate,
    document: x.Documento,
  });
}

/**
 * @param {Knex} sql
 * @param {Person} person
 */
async function insert(sql, person) {
  const thisPerson = await sql
    .select()
    .from('person')
    .where('uuid', person.uuid)
    .then((results) => results);

  // eslint-disable-next-line no-unused-vars
  const result =
    thisPerson && thisPerson.length > 0
      ? await sql('person')
          .update({
            name: person.name,
            surname: person.surname,
            fiscalCode: person.fiscalCode,
            fiscalCodeAttachmentObj: person.fiscalCodeAttachmentObj,
            companyName: person.companyName,
            isCompany: person.isCompany,
            birthDate: person.birthDate ? person.birthDate : null,
            birthCity: person.birthCity,
            birthRegion: person.birthRegion,
            birthState: person.birthState,
            creationDate: person.creationDate ? person.creationDate : null,
            status: person.status,
            customerType: person.customerType,
            address: person.address,
            legalAddress: person.legalAddress,
            displayAddress: person.displayAddress,
            displayLegalAddress: person.displayLegalAddress,
            fixedPhone: person.fixedPhone,
            mobilePhone: person.mobilePhone,
            email: person.email,
            linkedIn: person.linkedIn,
            facebook: person.facebook,
            twitter: person.twitter,
            nationality: person.nationality,
            sex: person.sex,
            foundationDate: person.foundationDate ? person.foundationDate : null,
            companyType: person.companyType,
          })
          .where('uuid', person.uuid)
      : await sql('person').insert({
          uuid: person.uuid,
          legacy: person,
          name: person.name,
          surname: person.surname,
          fiscalCode: person.fiscalCode,
          fiscalCodeAttachmentObj: person.fiscalCodeAttachmentObj,
          companyName: person.companyName,
          isCompany: person.isCompany,
          birthDate: person.birthDate ? person.birthDate : null,
          birthCity: person.birthCity,
          birthRegion: person.birthRegion,
          birthState: person.birthState,
          creationDate: person.creationDate ? person.creationDate : null,
          status: person.status,
          customerType: person.customerType,
          address: person.address,
          legalAddress: person.legalAddress,
          displayAddress: person.displayAddress,
          displayLegalAddress: person.displayLegalAddress,
          fixedPhone: person.fixedPhone,
          mobilePhone: person.mobilePhone,
          email: person.email,
          linkedIn: person.linkedIn,
          facebook: person.facebook,
          twitter: person.twitter,
          nationality: person.nationality,
          sex: person.sex,
          foundationDate: person.foundationDate ? person.foundationDate : null,
          companyType: person.companyType,
        });
}

/**
 * @param {Knex} sql
 * @param {Person} person
 * @param {string} originalId
 */
async function insertHistory(sql, person, originalId) {
  const thisPerson = await sql
    .select()
    .from('person_history')
    .where('originalId', originalId)
    .then((results) => results);

  // eslint-disable-next-line no-unused-vars
  const result =
    thisPerson && thisPerson.length > 0
      ? await sql('person_history')
          .update({
            name: person.name,
            surname: person.surname,
            fiscalCode: person.fiscalCode,
            companyName: person.companyName,
            isCompany: person.isCompany,
            birthDate: person.birthDate ? person.birthDate : null,
            birthCity: person.birthCity,
            birthRegion: person.birthRegion,
            birthState: person.birthState,
            creationDate: person.creationDate ? person.creationDate : null,
            status: person.status,
            customerType: person.customerType,
            address: person.address,
            legalAddress: person.legalAddress,
            displayAddress: person.displayAddress,
            displayLegalAddress: person.displayLegalAddress,
            fixedPhone: person.fixedPhone,
            mobilePhone: person.mobilePhone,
            email: person.email,
            linkedIn: person.linkedIn,
            facebook: person.facebook,
            twitter: person.twitter,
            nationality: person.nationality,
            sex: person.sex,
            foundationDate: person.foundationDate ? person.foundationDate : null,
            companyType: person.companyType,
          })
          .where('originalId', originalId)
      : await sql('person_history').insert({
          originalId,
          uuid: person.uuid,
          legacy: person,
          name: person.name,
          surname: person.surname,
          fiscalCode: person.fiscalCode,
          companyName: person.companyName,
          isCompany: person.isCompany,
          birthDate: person.birthDate ? person.birthDate : null,
          birthCity: person.birthCity,
          birthRegion: person.birthRegion,
          birthState: person.birthState,
          creationDate: person.creationDate ? person.creationDate : null,
          status: person.status,
          customerType: person.customerType,
          address: person.address,
          legalAddress: person.legalAddress,
          displayAddress: person.displayAddress,
          displayLegalAddress: person.displayLegalAddress,
          fixedPhone: person.fixedPhone,
          mobilePhone: person.mobilePhone,
          email: person.email,
          linkedIn: person.linkedIn,
          facebook: person.facebook,
          twitter: person.twitter,
          nationality: person.nationality,
          sex: person.sex,
          foundationDate: person.foundationDate ? person.foundationDate : null,
          companyType: person.companyType,
        });
}

/**
 * @param {Knex} sql
 * @param {string} personId
 */
async function insertPersonPrecontractual(sql, personId) {
  const thisPersonPre = await sql
    .select()
    .from('precontractual_person')
    .where('id', personId)
    .then((results) => results);

  const person = await sql
    .select()
    .from('person')
    .where('id', personId)
    .then((results) => results[0]);

  if (!person) return;

  await (thisPersonPre && thisPersonPre.length > 0
    ? sql('precontractual_person')
        .update({
          uuid: person.uuid,
          legacy: person,
          name: person.name,
          surname: person.surname,
          fiscalCode: person.fiscalCode,
          fiscalCodeAttachmentObj: person.fiscalCodeAttachmentObj,
          companyName: person.companyName,
          isCompany: person.isCompany,
          birthDate: person.birthDate ? person.birthDate : null,
          birthCity: person.birthCity,
          birthRegion: person.birthRegion,
          birthState: person.birthState,
          creationDate: person.creationDate ? person.creationDate : null,
          status: person.status,
          customerType: person.customerType,
          address: person.address,
          legalAddress: person.legalAddress,
          displayAddress: person.displayAddress,
          displayLegalAddress: person.displayLegalAddress,
          fixedPhone: person.fixedPhone,
          mobilePhone: person.mobilePhone,
          email: person.email,
          linkedIn: person.linkedIn,
          facebook: person.facebook,
          twitter: person.twitter,
          nationality: person.nationality,
          sex: person.sex,
          foundationDate: person.foundationDate ? person.foundationDate : null,
          companyType: person.companyType,
        })
        .where('id', personId)
    : sql('precontractual_person').insert({
        id: person.id,
        uuid: person.uuid,
        legacy: person,
        name: person.name,
        surname: person.surname,
        fiscalCode: person.fiscalCode,
        fiscalCodeAttachmentObj: person.fiscalCodeAttachmentObj,
        companyName: person.companyName,
        isCompany: person.isCompany,
        birthDate: person.birthDate ? person.birthDate : null,
        birthCity: person.birthCity,
        birthRegion: person.birthRegion,
        birthState: person.birthState,
        creationDate: person.creationDate ? person.creationDate : null,
        status: person.status,
        customerType: person.customerType,
        address: person.address,
        legalAddress: person.legalAddress,
        displayAddress: person.displayAddress,
        displayLegalAddress: person.displayLegalAddress,
        fixedPhone: person.fixedPhone,
        mobilePhone: person.mobilePhone,
        email: person.email,
        linkedIn: person.linkedIn,
        facebook: person.facebook,
        twitter: person.twitter,
        nationality: person.nationality,
        sex: person.sex,
        foundationDate: person.foundationDate ? person.foundationDate : null,
        companyType: person.companyType,
      }));
}

/**
 * @param {Knex} sql
 * @param {CustomerSync} personToEmbed
 * @param {object} originalPerson
 */
async function insertEmbeddedFromLegacy(sql, personToEmbed, originalPerson) {
  const fiscalCode = personToEmbed.fiscalCode
    ? personToEmbed.fiscalCode
    : `${originalPerson.fiscalCode}-${personToEmbed.name}-${personToEmbed.surname}`;

  const thisPerson = await sql
    .select()
    .from('person')
    .where('fiscalCode', fiscalCode)
    .then((results) => results);

  let thisPersonUuid;

  if (!(thisPerson && thisPerson.length > 0)) {
    const newPersonUuid = uuid4();
    thisPersonUuid = newPersonUuid;

    await sql('person').insert({
      uuid: newPersonUuid,
      legacy: personToEmbed,
      name: personToEmbed.name,
      surname: personToEmbed.surname,
      fiscalCode,
      companyName: personToEmbed.name,
      isCompany: false,
      birthDate: personToEmbed.birthDate,
      birthCity: personToEmbed.birthCity,
      birthRegion: personToEmbed.birthRegion,
      birthState: personToEmbed.birthState,
      creationDate: moment().toISOString(),
      status: 2,
      customerType: 2,
      address: personToEmbed.address,
      legalAddress: personToEmbed.legalAddress,
      displayAddress: personToEmbed.address.displayAddress,
      displayLegalAddress: personToEmbed.legalAddress.displayAddress,
      fixedPhone: personToEmbed.fixedPhone,
      mobilePhone: personToEmbed.mobilePhone,
      email: personToEmbed.email,
      linkedIn: personToEmbed.linkedIn,
      facebook: personToEmbed.facebook,
      twitter: personToEmbed.twitter,
      nationality: personToEmbed.nationality,
      sex: personToEmbed.sex,
      foundationDate: personToEmbed.foundationDate
        ? moment.utc(`01-01-${personToEmbed.foundationDate}`, 'DD-MM-YYYY').toISOString()
        : null,
      companyType: personToEmbed.companyType,
    });
  } else {
    thisPersonUuid = thisPerson[0].uuid;

    await sql('person')
      .update({
        legacy: personToEmbed,
        name: personToEmbed.name,
        surname: personToEmbed.surname,
        fiscalCode,
        companyName: personToEmbed.name,
        isCompany: false,
        birthDate: personToEmbed.birthDate,
        birthCity: personToEmbed.birthCity,
        birthRegion: personToEmbed.birthRegion,
        birthState: personToEmbed.birthState,
        creationDate: moment().toISOString(),
        status: 2,
        customerType: 2,
        address: personToEmbed.address,
        legalAddress: personToEmbed.legalAddress,
        displayAddress: personToEmbed.address.displayAddress,
        displayLegalAddress: personToEmbed.legalAddress.displayAddress,
        fixedPhone: personToEmbed.fixedPhone,
        mobilePhone: personToEmbed.mobilePhone,
        email: personToEmbed.email,
        linkedIn: personToEmbed.linkedIn,
        facebook: personToEmbed.facebook,
        twitter: personToEmbed.twitter,
        nationality: personToEmbed.nationality,
        sex: personToEmbed.sex,
        foundationDate: personToEmbed.foundationDate
          ? moment.utc(`01-01-${personToEmbed.foundationDate}`, 'DD-MM-YYYY').toISOString()
          : null,
        companyType: personToEmbed.companyType,
      })
      .where('uuid', thisPersonUuid);
  }

  const personOwners = await sql
    .select()
    .from('person_owner')
    .where('personId', originalPerson.uuid)
    .then((results) => results);

  // @ts-ignore
  await personOwners.forEachAsync(async (personOwner) => {
    try {
      const searchOwner = await sql
        .select()
        .from('person_owner')
        .where('personId', thisPersonUuid)
        .andWhere('productivePeriodMonth', personOwner.productivePeriodMonth)
        .andWhere('productivePeriodYear', personOwner.productivePeriodYear)
        .then((results) => results);

      if (!(searchOwner && searchOwner.length > 0)) {
        await sql('person_owner').insert({
          uuid: buildId(thisPersonUuid, personOwner.productivePeriodYear, personOwner.productivePeriodMonth),
          legacy: {},
          personId: thisPersonUuid,
          networkNodeId: personOwner.networkNodeId,
          ownerId: personOwner.ownerId,
          productivePeriodMonth: personOwner.productivePeriodMonth,
          productivePeriodYear: personOwner.productivePeriodYear,
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  });

  if (personToEmbed.document) {
    const thisNewPerson = await sql
      .select()
      .from('person')
      .where('uuid', thisPersonUuid)
      .then((results) => results);

    await sql('person_document').insert({
      personId: thisNewPerson[0].id,
      documentNumber: personToEmbed.document.NumeroDocumento,
      issueDate: personToEmbed.document.DataEmissioneDocumento,
      expiryDate: personToEmbed.document.DataScadenza,
      documentType: personToEmbed.document.TipoDocumento,
      uuid: uuid4(),
    });
  }

  return sql
    .select()
    .from('person')
    .where('fiscalCode', fiscalCode)
    .then((results) => results);
}

/**
 * @param {Knex} sql
 * @param {string} personUuid
 * @param {CustomerSync} personToLink
 * @param {object} personType
 */
async function insertLinkedPersonFromLegacy(sql, personUuid, personToLink, personType) {
  let thisPersonToLink;

  if (!personToLink.name && !personToLink.surname) {
    return;
  }

  const originalPerson = await sql
    .select()
    .from('person')
    .where('uuid', personUuid)
    .then((results) => results);

  if (!originalPerson || originalPerson.length <= 0) {
    return;
  }

  // eslint-disable-next-line prefer-const,max-len
  thisPersonToLink = await (personToLink._id === '00000000-0000-0000-0000-000000000000'
    ? insertEmbeddedFromLegacy(sql, personToLink, originalPerson[0])
    : sql
        .select()
        .from('person')
        .where('uuid', personToLink._id)
        .then((results) => results));

  if (!thisPersonToLink || thisPersonToLink.length <= 0) {
    return;
  }

  const thisPersonPerson = await sql
    .select()
    .from('person_person')
    .where('personId', originalPerson[0].id)
    .andWhere('linkedPersonId', thisPersonToLink[0].id)
    .andWhere('personTypeKey', personType.key)
    .then((results) => results);

  // eslint-disable-next-line no-unused-vars
  const result =
    thisPersonPerson && thisPersonPerson.length > 0
      ? await sql('person_person')
          .update({
            personId: originalPerson[0].id,
            personType,
            personTypeKey: personType.key,
            linkedPersonId: thisPersonToLink[0].id,
          })
          .where('id', thisPersonPerson[0].id)
      : await sql('person_person').insert({
          personId: originalPerson[0].id,
          personType,
          personTypeKey: personType.key,
          linkedPersonId: thisPersonToLink[0].id,
        });
}

/**
 * @param {Knex} sql
 * @param {string} personUuid
 * @param {number} practiceId
 * @param {CustomerSync} personToLink
 * @param {object} personType
 */
async function insertPracticePersonFromLegacy(sql, personUuid, practiceId, personToLink, personType) {
  let thisPersonToLink;

  if (!personToLink.name && !personToLink.surname) {
    return;
  }

  const originalPerson = await sql
    .select()
    .from('person')
    .where('uuid', personUuid)
    .then((results) => results);

  if (!originalPerson || originalPerson.length <= 0) {
    return;
  }

  // eslint-disable-next-line prefer-const,max-len
  thisPersonToLink = await (personToLink._id === '00000000-0000-0000-0000-000000000000'
    ? insertEmbeddedFromLegacy(sql, personToLink, originalPerson[0])
    : sql
        .select()
        .from('person')
        .where('uuid', personToLink._id)
        .then((results) => results));

  if (!thisPersonToLink || thisPersonToLink.length <= 0) {
    return;
  }

  const thisPersonPractice = await sql
    .select()
    .from('person_practice')
    .where('personId', thisPersonToLink[0].id)
    .andWhere('practiceId', practiceId)
    .andWhere('personTypeKey', personType.key)
    .then((results) => results);

  // eslint-disable-next-line no-unused-vars
  const result =
    thisPersonPractice && thisPersonPractice.length > 0
      ? await sql('person_practice')
          .update({
            personType,
            personTypeKey: personType.key,
            practiceId,
            personId: thisPersonToLink[0].id,
          })
          .where('id', thisPersonPractice[0].id)
      : await sql('person_practice').insert({
          personType,
          personTypeKey: personType.key,
          practiceId,
          personId: thisPersonToLink[0].id,
        });
}

/**
 * @param {Knex} sql
 * @param {string} id
 * @returns {Promise<object>}
 */
async function getDocumentByCustomerId(sql, id) {
  const documentQuery = sql
    .select(
      'pd.documentNumber',
      'pd.personId',
      'pd.issueDate',
      'pd.expiryDate',
      'pd.documentType',
      'pd.attachmentObj',
      'pd.issueAuthority',
      'pd.issueCountry',
      'pd.issueRegion',
      'pd.issueCity',
    )
    .from('person AS p')
    .leftJoin('person_document AS pd', 'pd.personId', 'p.id')
    .where('p.uuid', id)
    .orderBy('pd.expiryDate', 'desc');
  // eslint-disable-next-line no-return-await
  const document = await documentQuery.then((results) => results[0]);

  if (document && document.personId) {
    return document;
  }
  return {};
}

/**
 * @param {Knex} sql
 * @param {Mongo.Db} db
 * @param {CustomerSync} customer
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
async function insertFromLegacy(sql, db, customer) {
  const thisPerson = await sql
    .select()
    .from('person')
    .where('uuid', customer._id)
    .then((results) => results);

  // eslint-disable-next-line no-unused-vars
  const result =
    thisPerson && thisPerson.length > 0
      ? await sql('person')
          .update({
            name: customer.name,
            surname: customer.surname,
            fiscalCode: customer.physicalPerson ? customer.fiscalCode : customer.vat,
            companyName: customer.name,
            isCompany: !customer.physicalPerson,
            birthDate: customer.birthDate,
            birthCity: customer.birthCity,
            birthState: customer.birthState,
            birthRegion: customer.birthRegion,
            creationDate: customer.created,
            status: customer.statusKey,
            customerType: customer.typeKey,
            address: customer.address,
            legalAddress: customer.legalAddress,
            displayAddress: customer.address.displayAddress,
            displayLegalAddress: customer.legalAddress.displayAddress,
            fixedPhone: customer.fixedPhone,
            mobilePhone: customer.mobilePhone,
            email: customer.email,
            linkedIn: customer.linkedIn,
            facebook: customer.facebook,
            twitter: customer.twitter,
            nationality: customer.nationality,
            sex: customer.sex,
            foundationDate: customer.foundationDate
              ? moment.utc(`01-01-${customer.foundationDate}`, 'DD-MM-YYYY').toISOString()
              : null,
            companyType: customer.companyType,
          })
          .where('uuid', customer._id)
      : await sql('person').insert({
          uuid: customer._id,
          legacy: customer,
          name: customer.name,
          surname: customer.surname,
          fiscalCode: customer.physicalPerson ? customer.fiscalCode : customer.vat,
          companyName: customer.name,
          isCompany: !customer.physicalPerson,
          birthDate: customer.birthDate,
          birthCity: customer.birthCity,
          birthRegion: customer.birthRegion,
          birthState: customer.birthState,
          creationDate: customer.created,
          status: customer.statusKey,
          customerType: customer.typeKey,
          address: customer.address,
          legalAddress: customer.legalAddress,
          displayAddress: customer.address.displayAddress,
          displayLegalAddress: customer.legalAddress.displayAddress,
          fixedPhone: customer.fixedPhone,
          mobilePhone: customer.mobilePhone,
          email: customer.email,
          linkedIn: customer.linkedIn,
          facebook: customer.facebook,
          twitter: customer.twitter,
          nationality: customer.nationality,
          sex: customer.sex,
          foundationDate: customer.foundationDate
            ? moment.utc(`01-01-${customer.foundationDate}`, 'DD-MM-YYYY').toISOString()
            : null,
          companyType: customer.companyType,
        });

  if (customer.document) {
    const personForDocument = await sql
      .select()
      .from('person')
      .where('uuid', customer._id)
      .then((results) => results);

    const personDocument = await sql
      .select()
      .from('person_document')
      .where('personId', personForDocument[0].id)
      .andWhere('documentNumber', customer.document.NumeroDocumento)
      .then((results) => results);

    if (personDocument && personDocument.length <= 0) {
      await sql('person_document').insert({
        personId: personForDocument[0].id,
        documentNumber: customer.document.NumeroDocumento,
        issueDate: customer.document.DataEmissioneDocumento,
        expiryDate: customer.document.DataScadenza,
        documentType: customer.document.TipoDocumento,
        uuid: uuid4(),
      });
    }
  }

  if (customer.legal && customer.legal.Identifier) {
    await insertLinkedPersonFromLegacy(sql, customer._id, mapCustomerForEmbedded(customer.legal), {
      value: 'Legale rappresentante',
      key: 5,
    });
  }

  if (customer.taxLawyer && customer.taxLawyer.Identifier) {
    await insertLinkedPersonFromLegacy(sql, customer._id, mapCustomerForEmbedded(customer.taxLawyer), {
      value: 'Commercialista',
      key: 10,
    });
  }

  if (customer.referral && customer.referral.length > 0) {
    await customer.referral.forEachAsync(async (thisReferral) => {
      await insertLinkedPersonFromLegacy(sql, customer._id, mapCustomerForEmbedded(thisReferral), {
        value: 'Persona Collegata',
        key: 11,
      });
    });
  }

  if (customer.acquiring && customer.acquiring.length > 0) {
    await customer.acquiring.forEachAsync(async (thisReferral) => {
      await insertLinkedPersonFromLegacy(sql, customer._id, mapCustomerForEmbedded(thisReferral), {
        value: 'Referral',
        key: 12,
      });
    });
  }

  if (customer.companyReference && customer.companyReference.length > 0) {
    await customer.companyReference.forEachAsync(async (thisCompanyReference) => {
      await insertLinkedPersonFromLegacy(sql, customer._id, mapCustomerForEmbedded(thisCompanyReference), {
        value: 'Referente Aziendale',
        key: 12,
      });
    });
  }

  if (customer.effectives && customer.effectives.length > 0) {
    await customer.effectives.forEachAsync(async (reference) => {
      await insertLinkedPersonFromLegacy(sql, customer._id, mapCustomerForEmbedded(reference), {
        value: 'Titolare effettivo',
        key: 4,
      });
    });
  }

  if (customer.references && customer.references.length > 0) {
    await customer.references.forEachAsync(async (reference) => {
      const practice = await db
        .collection('BasePraticaApprovable')
        .findOne({ _id: reference.PraticaIdentifier })
        .then((x) => x);

      const thisPracticePG = await sql
        .select()
        .from('practice')
        // @ts-ignore
        .where('uuid', unparse(reference.PraticaIdentifier.buffer))
        .then((results) => results[0]);

      if (thisPracticePG && practice) {
        // @ts-ignore
        await practice.DettaglioPratica.Assicurati.forEachAsync(async (insured) => {
          // @ts-ignore
          await insertPracticePersonFromLegacy(sql, customer._id, thisPracticePG.id, mapCustomerForEmbedded(insured), {
            value: 'Assicurato',
            key: 1,
          });
        });
        if (
          practice.DettaglioPratica.BeneficiariGaranziaPrincipale &&
          practice.DettaglioPratica.BeneficiariGaranziaPrincipale.TipologiaBeneficiario &&
          practice.DettaglioPratica.BeneficiariGaranziaPrincipale.TipologiaBeneficiario.key === 10
        ) {
          // @ts-ignore
          await practice.DettaglioPratica.BeneficiariGaranziaPrincipale.Beneficiari.forEachAsync(async (insured) => {
            // @ts-ignore
            await insertPracticePersonFromLegacy(
              sql,
              customer._id,
              thisPracticePG.id,
              mapCustomerForEmbedded(insured),
              {
                value: 'Beneficiario',
                key: 3,
              },
            );
          });
        }
        if (practice.DettaglioPratica.TitolariEffettivo && practice.DettaglioPratica.TitolariEffettivo.CodiceFiscale) {
          // eslint-disable-next-line max-len
          await insertPracticePersonFromLegacy(
            sql,
            customer._id,
            thisPracticePG.id,
            mapCustomerForEmbedded(practice.DettaglioPratica.TitolariEffettivo),
            {
              value: 'Titolare effettivo',
              key: 4,
            },
          );
        }
        // eslint-disable-next-line max-len
        if (
          practice.DettaglioPratica.LegaleRappresentante &&
          practice.DettaglioPratica.LegaleRappresentante.CodiceFiscale
        ) {
          // eslint-disable-next-line max-len
          await insertPracticePersonFromLegacy(
            sql,
            customer._id,
            thisPracticePG.id,
            mapCustomerForEmbedded(practice.DettaglioPratica.LegaleRappresentante),
            {
              value: 'Legale rappresentante',
              key: 5,
            },
          );
        }
        // eslint-disable-next-line max-len
        if (practice.DettaglioPratica.TerzoPagatore && practice.DettaglioPratica.TerzoPagatore.CodiceFiscale) {
          // eslint-disable-next-line max-len
          await insertPracticePersonFromLegacy(
            sql,
            customer._id,
            thisPracticePG.id,
            mapCustomerForEmbedded(practice.DettaglioPratica.TerzoPagatore),
            {
              value: 'Terzo pagatore',
              key: 10,
            },
          );
        }
      }
    });
  }
}

/**
 * @param {Knex} sql
 * @param {string} id
 * @returns {Promise<object>}
 */
async function getbyUuid(sql, id) {
  const query = sql
    .select(
      'person.*',
      'nn.uuid as networkNodeId',
      'nn.roleId',
      'nn.inherited',
      'nn.displayHierarchy as networkHierarchy',
      'nn.validPromoterName as promoterName',
      sql.raw("CONCAT(person.name, ' ', person.surname) as displayName"),
    )
    .from('person')
    .join('person_owner AS po', 'person.uuid', 'po.personId')
    // eslint-disable-next-line func-names
    .join('network_node AS nn', function () {
      // @ts-ignore
      this.on('nn.uuid', '=', 'po.networkNodeId')
        .andOn('nn.productivePeriodMonth', '=', 'po.productivePeriodMonth')
        .andOn('nn.productivePeriodYear', '=', 'po.productivePeriodYear');
    })
    .where('person.uuid', id)
    .orderBy('nn.productivePeriodYear', 'desc')
    .orderBy('nn.productivePeriodMonth', 'desc');

  return query.then((results) => results[0]);
}

/**
 * @param {Knex} sql
 * @param {string} id
 * @returns {Promise<object>}
 */
async function getPersonPrecontractualbyPrecontractualId(sql, id) {
  const query = sql
    .select(
      'person.*',
      'nn.roleId',
      'nn.inherited',
      'nn.displayHierarchy as networkHierarchy',
      'nn.validPromoterName as promoterName',
      sql.raw("CONCAT(person.name, ' ', person.surname) as displayName"),
    )
    .from('precontractual_person as person')
    .leftJoin('precontractual AS pr', 'person.id', 'pr.personId')
    .join('person_owner AS po', 'person.uuid', 'po.personId')
    // eslint-disable-next-line func-names,sonarjs/no-identical-functions
    .join('network_node AS nn', function () {
      // @ts-ignore
      this.on('nn.uuid', '=', 'po.networkNodeId')
        .andOn('nn.productivePeriodMonth', '=', 'po.productivePeriodMonth')
        .andOn('nn.productivePeriodYear', '=', 'po.productivePeriodYear');
    })
    .where('pr.id', id)
    .orderBy('nn.productivePeriodYear', 'desc')
    .orderBy('nn.productivePeriodMonth', 'desc');

  return query.then((results) => results[0]);
}

/**
 * @param {Knex} sql
 * @param {string} id
 * @returns {Promise<object>}
 */
async function getPersonbyPrecontractualId(sql, id) {
  const query = sql
    .select(
      'person.*',
      'nn.roleId',
      'nn.inherited',
      'nn.displayHierarchy as networkHierarchy',
      'nn.validPromoterName as promoterName',
      sql.raw("CONCAT(person.name, ' ', person.surname) as displayName"),
    )
    .from('person as person')
    .leftJoin('precontractual AS pr', 'person.id', 'pr.personId')
    .join('person_owner AS po', 'person.uuid', 'po.personId')
    // eslint-disable-next-line func-names,sonarjs/no-identical-functions
    .join('network_node AS nn', function () {
      // @ts-ignore
      this.on('nn.uuid', '=', 'po.networkNodeId')
        .andOn('nn.productivePeriodMonth', '=', 'po.productivePeriodMonth')
        .andOn('nn.productivePeriodYear', '=', 'po.productivePeriodYear');
    })
    .where('pr.id', id)
    .orderBy('nn.productivePeriodYear', 'desc')
    .orderBy('nn.productivePeriodMonth', 'desc');

  return query.then((results) => results[0]);
}

/**
 * @param {Knex} sql
 * @param {string} fiscalCode
 * @returns {Promise<object>}
 */
async function getbyFiscalCode(sql, fiscalCode) {
  const query = sql
    .select(
      'person.*',
      'nn.uuid as networkNodeId',
      'nn.roleId',
      'nn.inherited',
      'nn.displayHierarchy as networkHierarchy',
      'nn.validPromoterName as promoterName',
      sql.raw("CONCAT(person.name, ' ', person.surname) as displayName"),
    )
    .from('person')
    .join('person_owner AS po', 'person.uuid', 'po.personId')
    // eslint-disable-next-line func-names,sonarjs/no-identical-functions
    .join('network_node AS nn', function () {
      // @ts-ignore
      this.on('nn.uuid', '=', 'po.networkNodeId')
        .andOn('nn.productivePeriodMonth', '=', 'po.productivePeriodMonth')
        .andOn('nn.productivePeriodYear', '=', 'po.productivePeriodYear');
    })
    .whereRaw('UPPER(person."fiscalCode") = ?', [fiscalCode])
    .orderBy('nn.productivePeriodYear', 'desc')
    .orderBy('nn.productivePeriodMonth', 'desc');

  return query.then((results) => results[0]);
}

/**
 * @param {Knex} sql
 * @param {string} personId
 * @returns {Promise<object>}
 */
async function getByPersonId(sql, personId) {
  const query = sql
    .select(
      'person.*',
      'nn.roleId',
      'nn.inherited',
      'nn.displayHierarchy as networkHierarchy',
      'nn.validPromoterName as promoterName',
      sql.raw("CONCAT(person.name, ' ', person.surname) as displayName"),
    )
    .from('person')
    .join('person_owner AS po', 'person.uuid', 'po.personId')
    // eslint-disable-next-line func-names,sonarjs/no-identical-functions
    .join('network_node AS nn', function () {
      // @ts-ignore
      this.on('nn.uuid', '=', 'po.networkNodeId')
        .andOn('nn.productivePeriodMonth', '=', 'po.productivePeriodMonth')
        .andOn('nn.productivePeriodYear', '=', 'po.productivePeriodYear');
    })
    .where('person.id', personId)
    .orderBy('nn.productivePeriodYear', 'desc')
    .orderBy('nn.productivePeriodMonth', 'desc');

  return query.then((results) => results[0]);
}

/**
 * @param {Knex} sql
 * @param {string} personId
 * @returns {Promise<object>}
 */
async function getPersonPrecontractualbyPersonId(sql, personId) {
  const query = sql
    .select(
      'person.*',
      'nn.roleId',
      'nn.inherited',
      'nn.displayHierarchy as networkHierarchy',
      'nn.validPromoterName as promoterName',
      sql.raw("CONCAT(person.name, ' ', person.surname) as displayName"),
    )
    .from('precontractual_person as person')
    .join('person_owner AS po', 'person.uuid', 'po.personId')
    // eslint-disable-next-line func-names,sonarjs/no-identical-functions
    .join('network_node AS nn', function () {
      // @ts-ignore
      this.on('nn.uuid', '=', 'po.networkNodeId')
        .andOn('nn.productivePeriodMonth', '=', 'po.productivePeriodMonth')
        .andOn('nn.productivePeriodYear', '=', 'po.productivePeriodYear');
    })
    .where('person.id', personId)
    .orderBy('nn.productivePeriodYear', 'desc')
    .orderBy('nn.productivePeriodMonth', 'desc');

  return query.then((results) => results[0]);
}

module.exports = {
  insert,
  insertHistory,
  getPersonbyPrecontractualId,
  getDocumentByCustomerId,
  getPersonPrecontractualbyPrecontractualId,
  getPersonPrecontractualbyPersonId,
  insertPersonPrecontractual,
  insertFromLegacy,
  getbyUuid,
  getByPersonId,
  getbyFiscalCode,
};
