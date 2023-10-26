// eslint-disable-next-line max-classes-per-file
const Knex = require('knex');
const moment = require('moment');
const Precontractual = require('./precontractual');
require('../../utils/foreach');

/**
 * @param {Knex} sql
 * @param {Precontractual} precontractual
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
async function insert(sql, precontractual) {
  const thisPrecontractual = await sql
    .select()
    .from('precontractual')
    .where('personId', precontractual.personId)
    .then((results) => results);

  const today = moment();

  // eslint-disable-next-line no-unused-vars
  const result =
    thisPrecontractual && thisPrecontractual.length > 0
      ? await sql('precontractual')
          .update({
            status: precontractual.status,
            lastModifiedDate: today,
            stepperStatus: precontractual.stepperStatus,
            minimalCheck: precontractual.minimalCheck ? 1 : 0,
            marketingCheck: precontractual.marketingCheck ? 1 : 0,
            profileCheck: precontractual.profileCheck ? 1 : 0,
            noPolicyLimits: precontractual.noPolicyLimits ? 1 : 0,
            fiscalCodeFile: precontractual.fiscalCodeFile,
            signatureMandate: precontractual.signatureMandate,
            signaturePrivacy: precontractual.signaturePrivacy,
            signPlacePrivacy: precontractual.signPlacePrivacy,
            signPlaceMandate: precontractual.signPlaceMandate,
            signatureDocuments: precontractual.signatureDocuments,
            policies: precontractual.policies,
            vatDocumentType: precontractual.vatDocumentType,
            vatIssueDate: precontractual.vatIssueDate ? precontractual.vatIssueDate : null,
            signedDate: precontractual.status === 1 ? today : null,
            linkedPersonId: precontractual.linkedPersonId ? precontractual.linkedPersonId : null,
          })
          .where('id', precontractual.id)
      : await sql('precontractual').insert({
          personId: precontractual.personId,
          status: precontractual.status,
          lastModifiedDate: precontractual.lastModifiedDate ? precontractual.lastModifiedDate : null,
          createdDate: today,
          stepperStatus: precontractual.stepperStatus,
          minimalCheck: precontractual.minimalCheck ? 1 : 0,
          marketingCheck: precontractual.marketingCheck ? 1 : 0,
          profileCheck: precontractual.profileCheck ? 1 : 0,
          noPolicyLimits: precontractual.noPolicyLimits ? 1 : 0,
          fiscalCodeFile: precontractual.fiscalCodeFile,
          signatureMandate: precontractual.signatureMandate,
          signaturePrivacy: precontractual.signaturePrivacy,
          signatureDocuments: precontractual.signatureDocuments,
          signPlacePrivacy: precontractual.signPlacePrivacy,
          signPlaceMandate: precontractual.signPlaceMandate,
          signPlaceOtp: precontractual.signPlaceOtp,
          policies: precontractual.policies,
        });
}

/**
 * @param {Knex} sql
 * @param {string} id
 * @returns {Promise<object>}
 */
async function getbyUuid(sql, id) {
  const query = sql
    .select(
      'pr.id',
      'pr.status',
      'pr.personId',
      'pr.stepperStatus',
      'pr.signedDate',
      'pr.createdDate',
      'pr.documentId',
      'pr.fiscalCodeFile',
      'pr.signatureMandate',
      'pr.signatureOtp',
      'pr.signaturePrivacy',
      'pr.signatureDocuments',
      'pr.minimalCheck',
      'pr.marketingCheck',
      'pr.profileCheck',
      'pr.signPlacePrivacy',
      'pr.signPlaceMandate',
      'pr.signPlaceOtp',
      'pr.noPolicyLimits',
      'pr.policies',
      'pr.vatDocumentType',
      'pr.vatIssueDate',
      'pr.linkedPersonId',
    )
    .from('precontractual AS pr')
    .leftJoin('person AS p', 'p.id', 'pr.personId')
    .where('p.uuid', id)
    .orderBy('pr.status', 'desc')
    .orderBy('pr.createdDate', 'desc');

  return query.then((results) => results[0]);
}

/**
 * @param {Knex} sql
 * @param {string} id
 * @returns {Promise<object>}
 */
async function getbyId(sql, id) {
  const query = sql
    .select(
      'pr.id',
      'pr.status',
      'pr.personId',
      'pr.stepperStatus',
      'pr.signedDate',
      'pr.createdDate',
      'pr.documentId',
      'pr.fiscalCodeFile',
      'pr.signatureMandate',
      'pr.signatureOtp',
      'pr.signaturePrivacy',
      'pr.signatureDocuments',
      'pr.minimalCheck',
      'pr.marketingCheck',
      'pr.profileCheck',
      'pr.signPlacePrivacy',
      'pr.signPlaceMandate',
      'pr.signPlaceOtp',
      'pr.noPolicyLimits',
      'pr.policies',
      'pr.vatDocumentType',
      'pr.vatIssueDate',
      'pr.linkedPersonId',
    )
    .from('precontractual AS pr')
    .where('pr.id', id);

  return query.then((results) => results[0]);
}

/**
 * @param {Knex} sql
 * @param {string} id
 * @returns {Promise<object>}
 */
async function getSummarybyUuid(sql, id) {
  const query = sql
    .select(
      'pr.id',
      'pr.status',
      'pr.personId',
      'pr.signedDate',
      'pr.createdDate',
      'pr.stepperStatus',
      'nn.roleId',
      'nn.inherited',
      'nn.displayHierarchy as displayHierarchy',
      'nn.validPromoterName as displayName',
    )
    .from('precontractual AS pr')
    .leftJoin('person AS p', 'p.id', 'pr.personId')
    .joinRaw(
      // eslint-disable-next-line max-len
      `inner join person_owner as po on po."id" = (select ppo.id from "person_owner" as ppo where ppo."personId" = p."uuid" order by ppo."productivePeriodYear", ppo."productivePeriodMonth" limit 1)`,
    )
    .joinRaw(
      // eslint-disable-next-line max-len
      `inner join network_node as nn on nn."id" = (select jpo.id from "network_node" as jpo where jpo."uuid" = po."networkNodeId" order by jpo."productivePeriodYear", jpo."productivePeriodMonth" limit 1)`,
    )
    .where('p.uuid', id)
    .orderBy('pr.createdDate', 'desc');

  return query.then((results) => results);
}

/**
 * @param {Knex} sql
 * @param {string} id
 * @returns {Promise<object>}
 */
async function getDocumentByPrecontractualId(sql, id) {
  const query = sql
    .select(
      'pd.documentNumber',
      'pd.issueDate',
      'pd.expiryDate',
      'pd.documentType',
      'pd.attachmentObj',
      'pd.id as documentId',
      'pd.issueAuthority',
      'pd.issueCountry',
      'pd.issueRegion',
      'pd.issueCity',
    )
    .from('precontractual AS pr')
    .leftJoin('person_document AS pd', 'pd.id', 'pr.documentId')
    .where('pr.id', id)
    .orderBy('pd.expiryDate', 'desc');

  const document = await query.then((results) => results[0]);

  if (document && document.documentId) {
    return document;
  }

  const queryPre = sql.select('pr.personId').from('precontractual AS pr').where('pr.id', id);
  const pre = await queryPre.then((results) => results[0]);

  const documentQuery = sql
    .select(
      'pd.documentNumber',
      'pd.personId',
      'pd.issueDate',
      'pd.expiryDate',
      'pd.documentType',
      'pd.attachmentObj',
      'pd.id as documentId',
      'pd.issueAuthority',
      'pd.issueCountry',
      'pd.issueRegion',
      'pd.issueCity',
    )
    .from('person_document AS pd')
    .where('pd.personId', pre.personId)
    .orderBy('pd.expiryDate', 'desc');
  // eslint-disable-next-line no-return-await
  const documenti = await documentQuery.then((results) => results[0]);

  if (documenti && documenti.personId) {
    return documenti;
  }
  return {};
}

/**
 * @param {Knex} sql
 * @param {string} id
 * @returns {Promise<object>}
 */
async function getDocumentByPersonId(sql, id) {
  const query = sql
    .select(
      'pd.documentNumber',
      'pd.issueDate',
      'pd.expiryDate',
      'pd.issueCountry',
      'pd.issueRegion',
      'pd.issueCity',
      'pd.issueAuthority',
      'pd.documentType',
      'pd.attachmentObj',
      'pd.id as documentId',
    )
    .from('precontractual AS pr')
    .leftJoin('person_document AS pd', 'pd.personId', 'pr.personId')
    .where('pr.personId', id)
    .orderBy('pd.creationDate', 'desc');

  const document = await query.then((results) => results[0]);

  if (document && document.documentId) {
    return document;
  }
  const documentQuery = sql
    .select(
      'pd.documentNumber',
      'pd.personId',
      'pd.issueDate',
      'pd.expiryDate',
      'pd.issueCountry',
      'pd.issueRegion',
      'pd.issueCity',
      'pd.issueAuthority',
      'pd.documentType',
      'pd.attachmentObj',
    )
    .from('person_document AS pd')
    .where('pd.personId', id)
    .orderBy('pd.creationDate', 'desc');
  // eslint-disable-next-line no-return-await
  const documenti = await documentQuery.then((results) => results[0]);
  if (documenti && documenti.personId) {
    return documenti;
  }
  return {};
}

/**
 * @param {Knex} sql
 * @param {string} id
 * @returns {Promise<object>}
 */
async function getbyPersonId(sql, id) {
  const query = sql
    .select(
      'pr.id',
      'pr.status',
      'pr.personId',
      'pr.stepperStatus',
      'pr.documentId',
      'pd.documentNumber',
      'pd.issueDate',
      'pd.expiryDate',
      'pr.signedDate',
      'pr.createdDate',
      'pd.documentType',
      'pd.attachmentObj',
      'pr.fiscalCodeFile',
      'pr.signatureMandate',
      'pr.signaturePrivacy',
      'pr.signatureDocuments',
      'pr.minimalCheck',
      'pr.marketingCheck',
      'pr.profileCheck',
      'pr.signPlacePrivacy',
      'pr.signPlaceMandate',
      'pr.signPlaceOtp',
      'pr.noPolicyLimits',
      'pr.policies',
      'pr.vatDocumentType',
      'pr.vatIssueDate',
      'pr.linkedPersonId',
    )
    .from('precontractual AS pr')
    .leftJoin('person AS p', 'p.id', 'pr.personId')
    .leftJoin('person_document AS pd', 'pd.id', 'pr.documentId')
    .where('pr.personId', id)
    .andWhere('pr.status', 1)
    .orderBy('pr.lastModifiedDate', 'desc');

  return query.then((results) => results[0]);
}

module.exports = {
  insert,
  getbyUuid,
  getbyId,
  getbyPersonId,
  getSummarybyUuid,
  getDocumentByPersonId,
  getDocumentByPrecontractualId,
};
