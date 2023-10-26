const Boom = require('boom');
const LetterService = require("../../../services/letter-srv");
const BonusLetter = require('../../../services/letter-srv/bonus/bonus-letter');
const ManagementFeeLetter = require('../../../services/letter-srv/management-fee/management-fee-letter');
const PrivacyLetter = require('../../../services/letter-srv/privacy/privacy-letter');
const JobLetter = require('../../../services/letter-srv/job/job-letter');
const CommissioningPasLetter = require('../../../services/letter-srv/commissioning/commissioning-pas-letter');
const CommissioningPaLetter = require('../../../services/letter-srv/commissioning/commissioning-pa-letter');
const Letter = require("../../../services/letter-srv/letter");
const BonusPasLetter = require('../../../services/letter-srv/commissioning/bonus-pas-letter');
const BonusPaLetter = require('../../../services/letter-srv/commissioning/bonus-pa-letter');
const RappelPasLetter = require('../../../services/letter-srv/commissioning/rappel-pas-letter');
const RappelPaLetter = require('../../../services/letter-srv/commissioning/rappel-pa-letter');
const PromoterJobService = require("../../../services/promoter-job-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Promoter Letter Udpate',
      description: 'Update a promoter letter',
      tags: ['letters'],
      params: {
        type: 'object',
        properties: {
          promoterId: {
            type: 'string',
            description: 'Promoter ID',
          },
          letterId: {
            type: 'string',
            description: 'Letter ID',
          },
        },
      },
      body: {
        type: 'object',
        required: ['type', 'description', 'signatureDate'],
        additionalProperties: false,
        properties: {
          type: Letter.getJSONSchema().properties.type,
          description: Letter.getJSONSchema().properties.description,
          signatureDate: Letter.getJSONSchema().properties.signatureDate,
          guaranteedBonuses: BonusLetter.getJSONSchema().properties.guaranteedBonuses,
          guaranteedVariableBonuses: BonusLetter.getJSONSchema().properties.guaranteedVariableBonuses,
          conditionedBonuses: BonusLetter.getJSONSchema().properties.conditionedBonuses,
          cumulateConditionedBonuses: BonusLetter.getJSONSchema().properties.cumulateConditionedBonuses,
          paymentFrequency: BonusLetter.getJSONSchema().properties.paymentFrequency,
          thresholdAmount: ManagementFeeLetter.getJSONSchema().properties.thresholdAmount,
          paymentDelayMonths: ManagementFeeLetter.getJSONSchema().properties.paymentDelayMonths,
          fromProductivePeriodYear: BonusLetter.getJSONSchema().properties.fromProductivePeriodYear,
          fromProductivePeriodMonth: BonusLetter.getJSONSchema().properties.fromProductivePeriodMonth,
          toProductivePeriodYear: BonusLetter.getJSONSchema().properties.toProductivePeriodYear,
          toProductivePeriodMonth: BonusLetter.getJSONSchema().properties.toProductivePeriodMonth,
          invoiceDescription: BonusLetter.getJSONSchema().properties.invoiceDescription,
          agreements: PrivacyLetter.getJSONSchema().properties.agreements,
          job: JobLetter.getJSONSchema().properties.job,
          jobs: JobLetter.getJSONSchema().properties.jobs,
          commissioningPa: CommissioningPaLetter.getJSONSchema().properties.commissioningPa,
          commissioningPas: CommissioningPasLetter.getJSONSchema().properties.commissioningPas,
          bonusPa: BonusPaLetter.getJSONSchema().properties.bonusPa,
          bonusPas: BonusPasLetter.getJSONSchema().properties.bonusPas,
          rappelPa: RappelPaLetter.getJSONSchema().properties.rappelPa,
          rappelPa2021: RappelPaLetter.getJSONSchema().properties.rappelPa,
          rappelPas: RappelPasLetter.getJSONSchema().properties.rappelPas,
        },
      },
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'item'],
          properties: {
            _meta: {
              type: 'object',
              properties: {},
            },
            item: {
              type: 'object',
              required: [...Letter.getJSONSchema().required],
              properties: {
                ...Letter.getJSONSchema().properties,
                guaranteedBonuses: BonusLetter.getJSONSchema().properties.guaranteedBonuses,
                guaranteedVariableBonuses: BonusLetter.getJSONSchema().properties.guaranteedVariableBonuses,
                conditionedBonuses: BonusLetter.getJSONSchema().properties.conditionedBonuses,
                cumulateConditionedBonuses: BonusLetter.getJSONSchema().properties.cumulateConditionedBonuses,
                paymentFrequency: BonusLetter.getJSONSchema().properties.paymentFrequency,
                thresholdAmount: ManagementFeeLetter.getJSONSchema().properties.thresholdAmount,
                paymentDelayMonths: ManagementFeeLetter.getJSONSchema().properties.paymentDelayMonths,
                fromProductivePeriodYear: BonusLetter.getJSONSchema().properties.fromProductivePeriodYear,
                fromProductivePeriodMonth: BonusLetter.getJSONSchema().properties.fromProductivePeriodMonth,
                toProductivePeriodYear: BonusLetter.getJSONSchema().properties.toProductivePeriodYear,
                toProductivePeriodMonth: BonusLetter.getJSONSchema().properties.toProductivePeriodMonth,
                invoiceDescription: BonusLetter.getJSONSchema().properties.invoiceDescription,
                agreements: PrivacyLetter.getJSONSchema().properties.agreements,
                didCreateDate: PrivacyLetter.getJSONSchema().properties.didCreateDate,
                didActiveDate: PrivacyLetter.getJSONSchema().properties.didActiveDate,
                didDeleteDate: PrivacyLetter.getJSONSchema().properties.didDeleteDate,
                didExpireDate: PrivacyLetter.getJSONSchema().properties.didExpireDate,
                willExpireDate: PrivacyLetter.getJSONSchema().properties.willExpireDate,
                job: JobLetter.getJSONSchema().properties.job,
                jobs: JobLetter.getJSONSchema().properties.jobs,
                commissioningPa: CommissioningPaLetter.getJSONSchema().properties.commissioningPa,
                commissioningPas: CommissioningPasLetter.getJSONSchema().properties.commissioningPas,
                bonusPa: BonusPaLetter.getJSONSchema().properties.bonusPa,
                bonusPas: BonusPasLetter.getJSONSchema().properties.bonusPas,
                rappelPa: RappelPaLetter.getJSONSchema().properties.rappelPa,
                rappelPa2021: RappelPaLetter.getJSONSchema().properties.rappelPa,
                rappelPas: RappelPasLetter.getJSONSchema().properties.rappelPas,
              },
            },
          },
        },
      },
    },
  };

  fastify.patch('/', options, (request, reply) => {
    const letterService = new LetterService(fastify.mongo.db, fastify.log, fastify.knex);
    const promoterJobService = new PromoterJobService(fastify.mongo.db);
    return letterService
      .updateLetter(request.params.letterId, request.params.promoterId, request.body)
      .then(async (letter) =>
        {
          // eslint-disable-next-line promise/always-return
          if (letter.type === 'job') {
            // @ts-ignore
            await promoterJobService.updatePromoterJobs(letter.promoterId, letter.jobs);
          }
          reply.send({
          _meta: {},
          item: letter,
          });
        }
      )
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
