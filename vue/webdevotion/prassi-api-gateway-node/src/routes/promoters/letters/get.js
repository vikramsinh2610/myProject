const Mongo = require('mongodb');
const Boom = require('boom');
const BonusLetter = require('../../../services/letter-srv/bonus/bonus-letter');
const Letter = require('../../../services/letter-srv/letter');
const ManagementFeeLetter = require('../../../services/letter-srv/management-fee/management-fee-letter');
const PrivacyLetter = require('../../../services/letter-srv/privacy/privacy-letter');
const JobLetter = require('../../../services/letter-srv/job/job-letter');
const CommissioningPasLetter = require('../../../services/letter-srv/commissioning/commissioning-pas-letter');
const CommissioningPaLetter = require('../../../services/letter-srv/commissioning/commissioning-pa-letter');
const BonusPasLetter = require('../../../services/letter-srv/commissioning/bonus-pas-letter');
const BonusPaLetter = require('../../../services/letter-srv/commissioning/bonus-pa-letter');
const RappelPasLetter = require('../../../services/letter-srv/commissioning/rappel-pas-letter');
const RappelPaLetter = require('../../../services/letter-srv/commissioning/rappel-pa-letter');
const NetworkService = require('../../../services/network-srv');
const errorHandler = require('../../../utils/error-handler');
const PromoterJobService = require('../../../services/promoter-job-srv');
require('../../../utils/foreach');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Promoter Letter Get',
      description: 'Get a promoter letter',
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
              required: Letter.getJSONSchema().required,
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

  fastify.get(
    '/',
    options,
    // eslint-disable-next-line sonarjs/cognitive-complexity
    errorHandler(async (request, reply) => {
      /** @type {Mongo.Db} */
      // eslint-disable-next-line prefer-destructuring
      const db = fastify.mongo.db;

      const networkService = new NetworkService(fastify.mongo.db);
      const promoterJobService = new PromoterJobService(fastify.mongo.db);
      const promoterCanSee = await networkService.userCanSee(
        request.identity.roleId,
        request.identity._id,
        request.params.promoterId,
      );
      if (!promoterCanSee) return reply.send(Boom.badRequest('Utente non autorizzato'));
      const allJobs = await promoterJobService.getAllPromoterJobs(request.params.promoterId);

      return db
        .collection('letter')
        .findOne({ _id: request.params.letterId, promoterId: request.params.promoterId })
        .then((letter) => {
          if (!letter) return reply.send(Boom.notFound());

          if (letter.jobs || letter.job) {
            const jobs = [];

            allJobs.forEach((el) => {
              const current = letter.jobs
                ? letter.jobs.find(
                    (o) =>
                      o.fromProductivePeriodYear === el.fromProductivePeriodYear &&
                      o.fromProductivePeriodMonth === el.fromProductivePeriodMonth,
                  )
                : undefined;
              jobs.push({
                fromProductivePeriodYear: el.fromProductivePeriodYear,
                fromProductivePeriodMonth: el.fromProductivePeriodMonth,
                roleId: el.roleId,
                state: current ? current.state : 'active',
                date: current ? current.date : new Date().toISOString().slice(0, 10),
              });
            });

            return reply.send({
              _meta: {},
              item: { ...letter, jobs },
            });
          }

          return reply.send({
            _meta: {},
            item: letter,
          });
        })
        .catch((error) => reply.send(Boom.badRequest(error.message)));
    }),
  );
  next();
};
