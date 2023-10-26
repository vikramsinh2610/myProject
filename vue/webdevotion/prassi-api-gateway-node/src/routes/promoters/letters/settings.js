const errorHandler = require('../../../utils/error-handler');
const roleIds = require('../../../services/promoter-job-srv/role-ids');
const { types } = require("../../../services/letter-srv/letter-types");
const KPI = require("../../../services/letter-srv/bonus/kpi");
const Target = require("../../../services/letter-srv/bonus/target");
const Absorbability = require("../../../services/letter-srv/bonus/absorbability");
const { paymentFrequencyEnum } = require("../../../services/letter-srv/bonus/payment-frequency-enum");
const { paymentTimeEnum } = require("../../../services/letter-srv/bonus/payment-time-enum");
const { kpiTypeEnum } = require("../../../services/letter-srv/bonus/kpi-type-enum");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Promoter Letter Settings Get',
      description: 'Get letter settings',
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
              additionalProperties: true,
            },
          },
        },
      },
    },
  };

  fastify.get('/', options, errorHandler( async () => {
    const roles = await roleIds.getRoleIds(fastify.mongo.db);
    const paymentFrequency = Object.values(paymentFrequencyEnum);
    const paymentTime = Object.values(paymentTimeEnum);
    const targets =
      fastify.edition === 'tcw'
        ? {
            'MONTHLY-PRODUCT': new Target({
              kpi: new KPI({ _id: 'MONTHLY-PRODUCT', type: kpiTypeEnum.NUMBER }),
              targetValue: 0,
              weightPercentage: 10000,
            }),
            PRODUCT: new Target({
              kpi: new KPI({ _id: 'PRODUCT', type: kpiTypeEnum.NUMBER }),
              targetValue: 0,
              weightPercentage: 10000,
            }),
            'ADJUSTED-PREMIUM': new Target({
              kpi: new KPI({ _id: 'ADJUSTED-PREMIUM' }),
              targetValue: 0,
              weightPercentage: 10000,
            }),
            'ADJUSTED-PREMIUM-DIRECT': new Target({
              kpi: new KPI({ _id: 'ADJUSTED-PREMIUM-DIRECT' }),
              targetValue: 0,
              weightPercentage: 10000,
            }),
            'ADJUSTED-PREMIUM-INDIRECT': new Target({
              kpi: new KPI({ _id: 'ADJUSTED-PREMIUM-INDIRECT' }),
              targetValue: 0,
              weightPercentage: 10000,
            }),
            'MONTHLY-ADJUSTED-PREMIUM': new Target({
              kpi: new KPI({ _id: 'MONTHLY-ADJUSTED-PREMIUM' }),
              targetValue: 0,
              weightPercentage: 10000,
            }),
            'MONTHLY-ADJUSTED-PREMIUM-DIRECT': new Target({
              kpi: new KPI({ _id: 'MONTHLY-ADJUSTED-PREMIUM-DIRECT' }),
              targetValue: 0,
              weightPercentage: 10000,
            }),
            'MONTHLY-ADJUSTED-PREMIUM-INDIRECT': new Target({
              kpi: new KPI({ _id: 'MONTHLY-ADJUSTED-PREMIUM-INDIRECT' }),
              targetValue: 0,
              weightPercentage: 10000,
            }),
            'PROMOTERS-NUMBER': new Target({
              kpi: new KPI({ _id: 'PROMOTERS-NUMBER', type: kpiTypeEnum.NUMBER }),
              targetValue: 0,
              weightPercentage: 10000,
            }),
            CORRENTIZZAZIONE: new Target({
              kpi: new KPI({ _id: 'CORRENTIZZAZIONE', type: kpiTypeEnum.PERCENTAGE }),
              targetValue: 0,
              weightPercentage: 10000,
            }),
          }
        : {
            IV: new Target({
              kpi: new KPI({ _id: 'IV' }),
              targetValue: 0,
              weightPercentage: 10000,
            }),
            'ADJUSTED-PREMIUM': new Target({
              kpi: new KPI({ _id: 'ADJUSTED-PREMIUM' }),
              targetValue: 0,
              weightPercentage: 10000,
            }),
            'ADJUSTED-PREMIUM-DIRECT': new Target({
              kpi: new KPI({ _id: 'ADJUSTED-PREMIUM-DIRECT' }),
              targetValue: 0,
              weightPercentage: 10000,
            }),
            'ADJUSTED-PREMIUM-INDIRECT': new Target({
              kpi: new KPI({ _id: 'ADJUSTED-PREMIUM-INDIRECT' }),
              targetValue: 0,
              weightPercentage: 10000,
            }),
            'MONTHLY-ADJUSTED-PREMIUM': new Target({
              kpi: new KPI({ _id: 'MONTHLY-ADJUSTED-PREMIUM' }),
              targetValue: 0,
              weightPercentage: 10000,
            }),
            'MONTHLY-ADJUSTED-PREMIUM-DIRECT': new Target({
              kpi: new KPI({ _id: 'MONTHLY-ADJUSTED-PREMIUM-DIRECT' }),
              targetValue: 0,
              weightPercentage: 10000,
            }),
            'MONTHLY-ADJUSTED-PREMIUM-INDIRECT': new Target({
              kpi: new KPI({ _id: 'MONTHLY-ADJUSTED-PREMIUM-INDIRECT' }),
              targetValue: 0,
              weightPercentage: 10000,
            }),
          };
    const absorbabilities = {
      ABSORBABLE: new Absorbability({
        directProductionPercentage: 10000,
        indirectProductionPercentage: 10000,
      }),
      SUPPLEMENTARY: new Absorbability({
        directProductionPercentage: 0,
        indirectProductionPercentage: 0,
      }),
    };
    const productivePeriodPaymentDelay = { NONE: 0, '+1': 1, '+2': 2, '+3': 3 };
    const item =
      fastify.edition === 'tcw'
        ? {
            types: {
              RAPPEL: {
                _id: types.RAPPEL,
                targets,
                paymentFrequency,
                paymentTime,
                productivePeriodPaymentDelay,
              },
              'RAPPEL-2': {
                _id: types['RAPPEL-2'],
                targets,
                paymentFrequency,
                paymentTime,
                productivePeriodPaymentDelay,
              },
              'RAPPEL-3': {
                _id: types['RAPPEL-3'],
                targets,
                paymentFrequency,
                paymentTime,
                productivePeriodPaymentDelay,
              },
              'RAPPEL-5': {
                _id: types['RAPPEL-5'],
                targets,
                paymentFrequency,
                paymentTime,
                productivePeriodPaymentDelay,
              },
              GUARANTEED: {
                _id: types.GUARANTEED,
                absorbabilities,
                paymentFrequency,
                paymentTime,
              },
              GUARANTEED_VARIABLE: {
                _id: types.GUARANTEED_VARIABLE,
                absorbabilities,
                targets,
                paymentFrequency,
                paymentTime,
              },
              GUARANTEED_VARIABLE_MINIMUM: {
                _id: types.GUARANTEED_VARIABLE_MINIMUM,
                absorbabilities,
                targets,
                paymentFrequency,
                paymentTime,
              },
              GUARANTEED_WITH_BONUS_PREPAYD: {
                _id: types.GUARANTEED_WITH_BONUS_PREPAYD,
                absorbabilities,
                targets,
                paymentFrequency,
                paymentTime,
              },
              GUARANTEED_WITH_BONUS: {
                _id: types.GUARANTEED_WITH_BONUS,
                absorbabilities,
                paymentFrequency,
                paymentTime,
                productivePeriodPaymentDelay,
              },
              WELCOME_BONUS: {
                _id: types.WELCOME_BONUS,
                targets,
                paymentFrequency,
                paymentTime,
              },
              MANAGEMENT_FEE: {
                _id: types.MANAGEMENT_FEE,
              },
              JOB: {
                _id: types.JOB,
                roleType: roles,
              },
              PRIVACY: {
                _id: types.PRIVACY,
              },
            },
          }
        : {
            types: {
              RAPPEL: {
                _id: types.RAPPEL,
                targets,
                paymentFrequency,
                paymentTime,
                productivePeriodPaymentDelay,
              },
              GUARANTEED: {
                _id: types.GUARANTEED,
                absorbabilities,
                paymentFrequency,
                paymentTime,
              },
              GUARANTEED_VARIABLE: {
                _id: types.GUARANTEED_VARIABLE,
                absorbabilities,
                targets,
                paymentFrequency,
                paymentTime,
              },
              GUARANTEED_WITH_BONUS_PREPAYD: {
                _id: types.GUARANTEED_WITH_BONUS_PREPAYD,
                absorbabilities,
                targets,
                paymentFrequency,
                paymentTime,
              },
              GUARANTEED_WITH_BONUS: {
                _id: types.GUARANTEED_WITH_BONUS,
                absorbabilities,
                paymentFrequency,
                paymentTime,
                productivePeriodPaymentDelay,
              },
              JOB: {
                _id: types.JOB,
                roleType: roles,
              },
              COMMISSIONING_PA: {
                _id: types.COMMISSIONING_PA,
              },
              COMMISSIONING_PAS: {
                _id: types.COMMISSIONING_PAS,
              },
              BONUS_PA: {
                _id: types.BONUS_PA,
              },
              BONUS_PAS: {
                _id: types.BONUS_PAS,
              },
              RAPPEL_PA: {
                _id: types.RAPPEL_PA,
              },
              RAPPEL_PA_2021: {
                _id: types.RAPPEL_PA_2021,
              },
              RAPPEL_PAS: {
                _id: types.RAPPEL_PAS,
              },
            },
          };

    return Promise.resolve({ _meta: {}, item });
  }));
  next();
};
