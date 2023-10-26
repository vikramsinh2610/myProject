const { types } = require('./letter-types');
const BonusLetter = require('./bonus/bonus-letter');
const ManagementFeeLetter = require('./management-fee/management-fee-letter');
const PrivacyLetter = require('./privacy/privacy-letter');
const JobLetter = require('./job/job-letter');
const CommissioningPaLetter = require('./commissioning/commissioning-pa-letter');
const CommissioningPasLetter = require('./commissioning/commissioning-pas-letter');
const BonusPaLetter = require('./commissioning/bonus-pa-letter');
const BonusPasLetter = require('./commissioning/bonus-pas-letter');
const RappelPaLetter = require('./commissioning/rappel-pa-letter');
const RappelPasLetter = require('./commissioning/rappel-pas-letter');
const Job = require('./job/job');
const CommissioningPa = require('./commissioning/commissioning-pa');
const CommissioningPas = require('./commissioning/commissioning-pas');
const BonusPa = require('./commissioning/bonus-pa');
const BonusPas = require('./commissioning/bonus-pas');
const RappelPa = require('./commissioning/rappel-pa');
const RappelPas = require('./commissioning/rappel-pas');
const Letter = require('./letter');
const GuaranteedBonus = require('./bonus/guaranteed-bonus');
const GuaranteedVariableBonus = require('./bonus/guaranteed-variable-bonus');
const ConditionedBonus = require('./bonus/conditioned-bonus');
const Condition = require('./bonus/condition');
const Absorbability = require('./bonus/absorbability');
const Agreement = require('./privacy/agreement');
const { paymentFrequencyEnum } = require('./bonus/payment-frequency-enum');
const { paymentTimeEnum } = require('./bonus/payment-time-enum');
const roleIds = require('../promoter-job-srv/role-ids');
const fsm = require('./letter-fsm');
const KPI = require("./bonus/kpi");
const Target = require("./bonus/target");
const productivePeriodHelper = require("../../utils/productive-period-helper");

/**
 * @param {Letter} letter
 * @param {object} changes
 * @returns {Letter|BonusLetter|ManagementFeeLetter|PrivacyLetter}
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function  getTypedLetter(letter, changes) {
  const attachmentIds = changes.attachmentIds || [];
  const type = changes.type || letter.type;
  let basicLetter = new Letter({
    ...letter,
    type,
    description: changes.description || letter.description,
    signatureDate: changes.signatureDate || letter.signatureDate,
    attachmentIds: [...letter.attachmentIds, ...attachmentIds],
  });
  const useDefaults = type !== letter.type;

  const today = new Date(Date.now());
  const fromProductivePeriod = productivePeriodHelper.unparse(
    productivePeriodHelper.addMonths(
      productivePeriodHelper.parse(
        changes.fromProductivePeriodYear || today.getUTCFullYear(),
        changes.fromProductivePeriodMonth || today.getUTCMonth() + 1,
      ),
      1,
    ),
  );
  const toProductivePeriod = productivePeriodHelper.unparse(
    productivePeriodHelper.addMonths(
      productivePeriodHelper.parse(
        changes.fromProductivePeriodYear ? changes.fromProductivePeriodYear : today.getUTCFullYear(),
        changes.fromProductivePeriodMonth ? changes.fromProductivePeriodMonth : today.getUTCMonth() + 1,
      ),
      2,
    ),
  );
  const productivePeriodRange = {
    fromProductivePeriodYear: changes.fromProductivePeriodYear
      ? changes.fromProductivePeriodYear
      : fromProductivePeriod.productivePeriodYear,
    fromProductivePeriodMonth: changes.fromProductivePeriodMonth
      ? changes.fromProductivePeriodMonth
      : fromProductivePeriod.productivePeriodMonth,
    toProductivePeriodYear: changes.toProductivePeriodYear
      ? changes.toProductivePeriodYear
      : toProductivePeriod.productivePeriodYear,
    toProductivePeriodMonth: changes.toProductivePeriodMonth
      ? changes.toProductivePeriodMonth
      : toProductivePeriod.productivePeriodMonth,
  };

  const invoiceDescription = changes.invoiceDescription ? { invoiceDescription: changes.invoiceDescription } : {};

  switch (basicLetter.type) {
    case types.GUARANTEED: {
      const paymentFrequency =
        useDefaults || !changes.paymentFrequency ? paymentFrequencyEnum.MONTHLY : changes.paymentFrequency;
      let guaranteedBonuses;
      if (useDefaults || !changes.guaranteedBonuses) {
        guaranteedBonuses = [
          new GuaranteedBonus({
            amount: 0,
            paymentTime: paymentTimeEnum.PAYMENT_DELAYED,
            absorbability: new Absorbability({
              directProductionPercentage: 0,
              indirectProductionPercentage: 0,
            }),
          }),
        ];
        basicLetter = fsm.initState(basicLetter);
      } else {
        guaranteedBonuses = [...changes.guaranteedBonuses];
      }
      const willExpireDate = productivePeriodHelper.toDate(
        productivePeriodHelper.parse(
          productivePeriodRange.toProductivePeriodYear,
          productivePeriodRange.toProductivePeriodMonth,
        ),
      );
      return new BonusLetter({
        ...basicLetter,
        ...productivePeriodRange,
        guaranteedBonuses,
        paymentFrequency,
        willExpireDate,
        ...invoiceDescription,
        // eslint-disable-next-line no-prototype-builtins
        cumulateConditionedBonuses: changes.hasOwnProperty('cumulateConditionedBonuses')
          ? changes.cumulateConditionedBonuses
          : true,
      });
    }

    case types.GUARANTEED_VARIABLE: {
      const paymentFrequency =
        useDefaults || !changes.paymentFrequency ? paymentFrequencyEnum.MONTHLY : changes.paymentFrequency;
      let guaranteedVariableBonuses;
      let conditionedBonuses = [];
      if (useDefaults || !changes.guaranteedVariableBonuses || !changes.conditionedBonuses) {
        guaranteedVariableBonuses = [
          new GuaranteedVariableBonus({
            amount: 0,
            paymentTime: paymentTimeEnum.PAYMENT_DELAYED,
            absorbability: new Absorbability({
              directProductionPercentage: 0,
              indirectProductionPercentage: 0,
            }),
            variableBonus: [
              {
                adjustedPercentage: 34001,
                formula: '340',
              },
              {
                adjustedPercentage: 8000,
                formula: 'x',
              },
              {
                adjustedPercentage: 7999,
                formula: '0',
              },
            ],
          }),
        ];
        const cb = new ConditionedBonus({
          amount: 0,
          paymentTime: paymentTimeEnum.PAYMENT_DELAYED,
          conditions: [
            new Condition({
              targets: [
                new Target({
                  kpi: new KPI({ _id: 'MONTHLY-ADJUSTED-PREMIUM' }),
                  targetValue: 0,
                  weightPercentage: 10000,
                }),
              ],
            }),
          ],
        });

        conditionedBonuses.push(cb);
        basicLetter = fsm.initState(basicLetter);
      } else {
        guaranteedVariableBonuses = [...changes.guaranteedVariableBonuses];
        conditionedBonuses = [...changes.conditionedBonuses];
      }
      const willExpireDate = productivePeriodHelper.toDate(
        productivePeriodHelper.parse(
          productivePeriodRange.toProductivePeriodYear,
          productivePeriodRange.toProductivePeriodMonth,
        ),
      );
      return new BonusLetter({
        ...basicLetter,
        ...productivePeriodRange,
        guaranteedVariableBonuses,
        conditionedBonuses,
        paymentFrequency,
        willExpireDate,
        ...invoiceDescription,
        // eslint-disable-next-line no-prototype-builtins
        cumulateConditionedBonuses: changes.hasOwnProperty('cumulateConditionedBonuses')
          ? changes.cumulateConditionedBonuses
          : true,
      });
    }

    case types.GUARANTEED_VARIABLE_MINIMUM: {
      const paymentFrequency =
        useDefaults || !changes.paymentFrequency ? paymentFrequencyEnum.MONTHLY : changes.paymentFrequency;

      let guaranteedBonuses;
      if (useDefaults || !changes.guaranteedBonuses) {
        guaranteedBonuses = [
          new GuaranteedBonus({
            amount: 0,
            paymentTime: paymentTimeEnum.PAYMENT_DELAYED,
            absorbability: new Absorbability({
              directProductionPercentage: 0,
              indirectProductionPercentage: 0,
            }),
          }),
        ];
        basicLetter = fsm.initState(basicLetter);
      } else {
        guaranteedBonuses = [...changes.guaranteedBonuses];
      }

      let guaranteedVariableBonuses;
      let conditionedBonuses = [];
      if (useDefaults || !changes.guaranteedVariableBonuses || !changes.conditionedBonuses) {
        guaranteedVariableBonuses = [
          new GuaranteedVariableBonus({
            amount: 0,
            paymentTime: paymentTimeEnum.PAYMENT_DELAYED,
            absorbability: new Absorbability({
              directProductionPercentage: 0,
              indirectProductionPercentage: 0,
            }),
            variableBonus: [
              {
                adjustedPercentage: 34001,
                formula: '340',
              },
              {
                adjustedPercentage: 8000,
                formula: 'x',
              },
              {
                adjustedPercentage: 7999,
                formula: '0',
              },
            ],
          }),
        ];
        const cb = new ConditionedBonus({
          amount: 0,
          paymentTime: paymentTimeEnum.PAYMENT_DELAYED,
          conditions: [
            new Condition({
              targets: [
                new Target({
                  kpi: new KPI({ _id: 'MONTHLY-ADJUSTED-PREMIUM' }),
                  targetValue: 0,
                  weightPercentage: 10000,
                }),
              ],
            }),
          ],
        });

        conditionedBonuses.push(cb);
        basicLetter = fsm.initState(basicLetter);
      } else {
        guaranteedVariableBonuses = [...changes.guaranteedVariableBonuses];
        conditionedBonuses = [...changes.conditionedBonuses];
      }
      const willExpireDate = productivePeriodHelper.toDate(
        productivePeriodHelper.parse(
          productivePeriodRange.toProductivePeriodYear,
          productivePeriodRange.toProductivePeriodMonth,
        ),
      );
      return new BonusLetter({
        ...basicLetter,
        ...productivePeriodRange,
        guaranteedBonuses,
        guaranteedVariableBonuses,
        conditionedBonuses,
        paymentFrequency,
        willExpireDate,
        ...invoiceDescription,
        // eslint-disable-next-line no-prototype-builtins
        cumulateConditionedBonuses: changes.hasOwnProperty('cumulateConditionedBonuses')
          ? changes.cumulateConditionedBonuses
          : true,
      });
    }

    case types.GUARANTEED_WITH_BONUS:
    case types.GUARANTEED_WITH_BONUS_PREPAYD: {
      const paymentFrequency =
        useDefaults || !changes.paymentFrequency ? paymentFrequencyEnum.MONTHLY : changes.paymentFrequency;
      let guaranteedBonuses;
      let conditionedBonuses;
      if (useDefaults || !changes.guaranteedBonuses || !changes.conditionedBonuses) {
        guaranteedBonuses = [
          new GuaranteedBonus({
            amount: 0,
            paymentTime: paymentTimeEnum.PAYMENT_DELAYED,
            absorbability: new Absorbability({
              directProductionPercentage: 0,
              indirectProductionPercentage: 0,
            }),
          }),
        ];
        conditionedBonuses = [
          new ConditionedBonus({
            amount: 0,
            paymentTime:
              basicLetter.type === types.GUARANTEED_WITH_BONUS_PREPAYD
                ? paymentTimeEnum.PREPAYMENT
                : paymentTimeEnum.PAYMENT_DELAYED,
            conditions: [
              new Condition({
                targets: [],
              }),
            ],
          }),
        ];
        basicLetter = fsm.initState(basicLetter);
      } else {
        guaranteedBonuses = [...changes.guaranteedBonuses];
        conditionedBonuses = [...changes.conditionedBonuses];
      }
      const willExpireDate = productivePeriodHelper.toDate(
        productivePeriodHelper.addMonths(
          productivePeriodHelper.parse(
            productivePeriodRange.toProductivePeriodYear,
            productivePeriodRange.toProductivePeriodMonth,
          ),
          // eslint-disable-next-line unicorn/no-reduce
          conditionedBonuses.reduce((acc, bonus) => Math.max(bonus.productivePeriodPaymentDelay, acc), 0),
        ),
      );
      return new BonusLetter({
        ...basicLetter,
        ...productivePeriodRange,
        guaranteedBonuses,
        conditionedBonuses,
        paymentFrequency,
        willExpireDate,
        ...invoiceDescription,
        // eslint-disable-next-line no-prototype-builtins
        cumulateConditionedBonuses: changes.hasOwnProperty('cumulateConditionedBonuses')
          ? changes.cumulateConditionedBonuses
          : true,
      });
    }

    case types.RAPPEL:
    case types['RAPPEL-2']:
    case types['RAPPEL-3']:
    case types['RAPPEL-5']: {
      const paymentFrequency =
        useDefaults || !changes.paymentFrequency ? paymentFrequencyEnum.ONE_TIME : changes.paymentFrequency;
      let conditionedBonuses = [];
      if (useDefaults || !changes.conditionedBonuses) {
        let n = 1;
        switch (basicLetter.type) {
          case types['RAPPEL-2']:
            n = 2;
            break;
          case types['RAPPEL-3']:
            n = 3;
            break;
          case types['RAPPEL-5']:
            n = 5;
            break;
          default:
            n = 1;
            break;
        }
        const cb = new ConditionedBonus({
          amount: 0,
          paymentTime: paymentTimeEnum.PAYMENT_DELAYED,
          conditions: [
            new Condition({
              targets: [],
            }),
          ],
        });

        for (let i = 0; i < n; i += 1) {
          conditionedBonuses.push(cb);
        }
        basicLetter = fsm.initState(basicLetter);
      } else {
        conditionedBonuses = [...changes.conditionedBonuses];
      }
      const willExpireDate = productivePeriodHelper.toDate(
        productivePeriodHelper.addMonths(
          productivePeriodHelper.parse(
            productivePeriodRange.toProductivePeriodYear,
            productivePeriodRange.toProductivePeriodMonth,
          ),
          // eslint-disable-next-line unicorn/no-reduce
          conditionedBonuses.reduce((acc, bonus) => Math.max(bonus.productivePeriodPaymentDelay, acc), 0),
        ),
      );
      return new BonusLetter({
        ...basicLetter,
        ...productivePeriodRange,
        conditionedBonuses,
        paymentFrequency,
        willExpireDate,
        ...invoiceDescription,
        // eslint-disable-next-line no-prototype-builtins
        cumulateConditionedBonuses: changes.hasOwnProperty('cumulateConditionedBonuses')
          ? changes.cumulateConditionedBonuses
          : true,
      });
    }

    case types.WELCOME_BONUS: {
      const paymentFrequency =
        useDefaults || !changes.paymentFrequency ? paymentFrequencyEnum.ONE_TIME : changes.paymentFrequency;
      let conditionedBonuses;
      if (useDefaults || !changes.conditionedBonuses) {
        conditionedBonuses = [
          new ConditionedBonus({
            amount: 0,
            paymentTime: paymentTimeEnum.PREPAYMENT,
            conditions: [
              new Condition({
                targets: [],
              }),
            ],
          }),
        ];
        basicLetter = fsm.initState(basicLetter);
      } else {
        conditionedBonuses = [...changes.conditionedBonuses];
      }
      const willExpireDate = productivePeriodHelper.toDate(
        productivePeriodHelper.addMonths(
          productivePeriodHelper.parse(
            productivePeriodRange.toProductivePeriodYear,
            productivePeriodRange.toProductivePeriodMonth,
          ),
          // eslint-disable-next-line unicorn/no-reduce
          conditionedBonuses.reduce((acc, bonus) => Math.max(bonus.productivePeriodPaymentDelay, acc), 0),
        ),
      );
      return new BonusLetter({
        ...basicLetter,
        ...productivePeriodRange,
        conditionedBonuses,
        paymentFrequency,
        willExpireDate,
        ...invoiceDescription,
        // eslint-disable-next-line no-prototype-builtins
        cumulateConditionedBonuses: changes.hasOwnProperty('cumulateConditionedBonuses')
          ? changes.cumulateConditionedBonuses
          : true,
      });
    }

    case types.MANAGEMENT_FEE: {
      let { thresholdAmount, paymentDelayMonths } = changes;
      if (useDefaults || !thresholdAmount || !paymentDelayMonths) {
        thresholdAmount = 0;
        paymentDelayMonths = 0;
        basicLetter = fsm.initState(basicLetter);
      }
      const willExpireDate = productivePeriodHelper.toDate(
        productivePeriodHelper.parse(
          productivePeriodRange.toProductivePeriodYear,
          productivePeriodRange.toProductivePeriodMonth,
        ),
      );
      // @ts-ignore
      return new ManagementFeeLetter({
        ...basicLetter,
        ...productivePeriodRange,
        thresholdAmount,
        paymentDelayMonths,
        willExpireDate,
      });
    }

    case types.PRIVACY: {
      let { agreements } = changes;
      if (useDefaults || !agreements) {
        agreements = [
          new Agreement({
            name: 'Test Agreement #1',
            content: 'Hey, this is a long story',
            agree: false,
          }),
          new Agreement({
            name: 'Test Agreement #2',
            content: 'Hey, this is a long story',
            agree: false,
          }),
          new Agreement({
            name: 'Test Agreement #3',
            content: 'Hey, this is a long story',
            agree: false,
          }),
        ];
        basicLetter = fsm.initState(basicLetter);
      }
      const willExpireDate = new Date('2099-01-01T00:00:00.000Z');
      // @ts-ignore
      return new PrivacyLetter({
        ...basicLetter,
        ...productivePeriodRange,
        agreements,
        willExpireDate,
      });
    }

    case types.JOB: {
      let { job } = changes;
      let { jobs } = changes;
      if (useDefaults || !job) {
        basicLetter = fsm.initState(basicLetter);
        job = new Job({
          roleId: roleIds.BASIC,
        });
      }
      if (useDefaults || !jobs) {
        jobs = [];
      }
      const willExpireDate = new Date('2099-01-01T00:00:00.000Z');
      // @ts-ignore
      return new JobLetter({
        ...basicLetter,
        ...productivePeriodRange,
        job,
        jobs,
        willExpireDate,
      });
    }

    case types.COMMISSIONING_PAS: {
      let { commissioningPas } = changes;
      if (useDefaults || !commissioningPas) {
        basicLetter = fsm.initState(basicLetter);
        commissioningPas = new CommissioningPas({
          quarterTargetTableRows: [
            {
              from: 0,
              to: 29999999,
              percentage: 0,
            },
            {
              from: 30000000,
              to: 39999999,
              percentage: 110,
            },
            {
              from: 40000000,
              to: 44999999,
              percentage: 110,
            },
            {
              from: 45000000,
              to: 999999999,
              percentage: 120,
            },
          ],
          bonusTableRows: [
            {
              from: 0,
              to: 11999999,
              amount: 100000,
            },
            {
              from: 12000000,
              to: 19999999,
              amount: 120000,
            },
            {
              from: 20000000,
              to: 29999999,
              amount: 90000,
            },
            {
              from: 30000000,
              to: 39999999,
              amount: 50000,
            },
            {
              from: 40000000,
              to: 44999999,
              amount: 50000,
            },
            {
              from: 45000000,
              to: 999999999,
              amount: 0,
            },
          ],
        });
      }
      const willExpireDate = productivePeriodHelper.toDate(
        productivePeriodHelper.parse(
          productivePeriodRange.toProductivePeriodYear,
          productivePeriodRange.toProductivePeriodMonth,
        ),
      );
      return new CommissioningPasLetter({
        ...basicLetter,
        ...productivePeriodRange,
        ...invoiceDescription,
        commissioningPas,
        willExpireDate,
      });
    }

    case types.BONUS_PAS: {
      let { bonusPas } = changes;
      if (useDefaults || !bonusPas) {
        basicLetter = fsm.initState(basicLetter);
        bonusPas = new BonusPas({
          bonusTableRows: [
            {
              from: 0,
              to: 11999999,
              amount: 100000,
            },
            {
              from: 12000000,
              to: 19999999,
              amount: 120000,
            },
            {
              from: 20000000,
              to: 29999999,
              amount: 90000,
            },
            {
              from: 30000000,
              to: 39999999,
              amount: 50000,
            },
            {
              from: 40000000,
              to: 44999999,
              amount: 50000,
            },
            {
              from: 45000000,
              to: 999999999,
              amount: 0,
            },
          ],
        });
      }
      const willExpireDate = productivePeriodHelper.toDate(
        productivePeriodHelper.parse(
          productivePeriodRange.toProductivePeriodYear,
          productivePeriodRange.toProductivePeriodMonth,
        ),
      );
      return new BonusPasLetter({
        ...basicLetter,
        ...productivePeriodRange,
        ...invoiceDescription,
        bonusPas,
        willExpireDate,
      });
    }

    case types.RAPPEL_PAS: {
      let { rappelPas } = changes;
      if (useDefaults || !rappelPas) {
        basicLetter = fsm.initState(basicLetter);
        rappelPas = new RappelPas({
          quarterTargetTableRows: [
            {
              from: 0,
              to: 29999999,
              percentage: 0,
            },
            {
              from: 30000000,
              to: 39999999,
              percentage: 110,
            },
            {
              from: 40000000,
              to: 44999999,
              percentage: 110,
            },
            {
              from: 45000000,
              to: 999999999,
              percentage: 120,
            },
          ],
        });
      }
      const willExpireDate = productivePeriodHelper.toDate(
        productivePeriodHelper.parse(
          productivePeriodRange.toProductivePeriodYear,
          productivePeriodRange.toProductivePeriodMonth,
        ),
      );
      return new RappelPasLetter({
        ...basicLetter,
        ...productivePeriodRange,
        ...invoiceDescription,
        rappelPas,
        willExpireDate,
      });
    }

    case types.COMMISSIONING_PA: {
      let { commissioningPa } = changes;
      if (useDefaults || !commissioningPa) {
        basicLetter = fsm.initState(basicLetter);
        commissioningPa = new CommissioningPa({
          quarterTargetTableRows: [
            {
              from: 0,
              to: 7499999,
              percentage: 0,
            },
            {
              from: 7500000,
              to: 9999999,
              percentage: 330,
            },
            {
              from: 10000000,
              to: 99999999,
              percentage: 350,
            },
          ],
          bonusMonths: [
            {
              month: 1,
              targetIv: 800000,
              guaranteedBonusAmount: 35000,
              guaranteedBonusThreshold: 0,
              guaranteedBonusMode: 'fixed',
              targetBonusAmount: 15000,
              targetBonusThreshold: 10000,
              targetBonusMode: 'fixed',
            },
            {
              month: 2,
              targetIv: 2500000,
              guaranteedBonusAmount: 35000,
              guaranteedBonusThreshold: 0,
              guaranteedBonusMode: 'fixed',
              targetBonusAmount: 15000,
              targetBonusThreshold: 10000,
              targetBonusMode: 'fixed',
            },
            {
              month: 3,
              targetIv: 3300000,
              guaranteedBonusAmount: 35000,
              guaranteedBonusThreshold: 0,
              guaranteedBonusMode: 'fixed',
              targetBonusAmount: 15000,
              targetBonusThreshold: 10000,
              targetBonusMode: 'fixed',
            },
          ],
        });
      }
      const willExpireDate = productivePeriodHelper.toDate(
        productivePeriodHelper.parse(
          productivePeriodRange.toProductivePeriodYear,
          productivePeriodRange.toProductivePeriodMonth,
        ),
      );
      return new CommissioningPaLetter({
        ...basicLetter,
        ...productivePeriodRange,
        ...invoiceDescription,
        commissioningPa,
        willExpireDate,
      });
    }

    case types.BONUS_PA: {
      let { bonusPa } = changes;
      if (useDefaults || !bonusPa) {
        basicLetter = fsm.initState(basicLetter);
        bonusPa = new BonusPa({
          bonusMonths: [
            {
              month: 1,
              targetIv: 800000,
              guaranteedBonusAmount: 35000,
              guaranteedBonusThreshold: 0,
              guaranteedBonusMode: 'fixed',
              targetBonusAmount: 15000,
              targetBonusThreshold: 10000,
              targetBonusMode: 'fixed',
            },
            {
              month: 2,
              targetIv: 2500000,
              guaranteedBonusAmount: 35000,
              guaranteedBonusThreshold: 0,
              guaranteedBonusMode: 'fixed',
              targetBonusAmount: 15000,
              targetBonusThreshold: 10000,
              targetBonusMode: 'fixed',
            },
            {
              month: 3,
              targetIv: 3300000,
              guaranteedBonusAmount: 35000,
              guaranteedBonusThreshold: 0,
              guaranteedBonusMode: 'fixed',
              targetBonusAmount: 15000,
              targetBonusThreshold: 10000,
              targetBonusMode: 'fixed',
            },
          ],
        });
      }
      const willExpireDate = productivePeriodHelper.toDate(
        productivePeriodHelper.parse(
          productivePeriodRange.toProductivePeriodYear,
          productivePeriodRange.toProductivePeriodMonth,
        ),
      );
      return new BonusPaLetter({
        ...basicLetter,
        ...productivePeriodRange,
        ...invoiceDescription,
        bonusPa,
        willExpireDate,
      });
    }

    case types.RAPPEL_PA_2021:
    case types.RAPPEL_PA: {
      let { rappelPa } = changes;
      if (useDefaults || !rappelPa) {
        basicLetter = fsm.initState(basicLetter);
        rappelPa = new RappelPa({
          quarterTargetTableRows: [
            {
              from: 0,
              to: 7499999,
              percentage: 0,
            },
            {
              from: 7500000,
              to: 9999999,
              percentage: 330,
            },
            {
              from: 10000000,
              to: 99999999,
              percentage: 350,
            },
          ],
        });
      }
      const willExpireDate = productivePeriodHelper.toDate(
        productivePeriodHelper.parse(
          productivePeriodRange.toProductivePeriodYear,
          productivePeriodRange.toProductivePeriodMonth,
        ),
      );
      return new RappelPaLetter({
        ...basicLetter,
        ...productivePeriodRange,
        ...invoiceDescription,
        rappelPa,
        willExpireDate,
      });
    }

    default:
      return basicLetter;
  }
}

module.exports = { getTypedLetter };
