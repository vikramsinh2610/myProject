const BonusLetter = require('./bonus-letter');
const { calculateBonuses } = require('./bonus-calculator');

describe('Bonus Calculator', () => {
  test('should calculate BonusLetter with Montly Prepaid Conditioned and Monthly Guaranteed', () => {
    const letter = new BonusLetter({
      _id: '01-2020',
      status: 'wip',
      promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-d21s',
      promoterSerialNumber: 'AZ123456',
      promoterDisplayName: 'Pippo De Peppis',
      type: 'rappel',
      description: 'Bla bla bla',
      signatureDate: new Date(),
      attachmentIds: ['a', 'b'],
      paymentFrequency: 'one-time',
      conditionedBonuses: [
        {
          amount: 1000,
          paymentTime: 'prepayment',
          productivePeriodPaymentDelay: 0,
          maxRecoveryPercentage: 10000,
          conditions: [
            {
              targets: [
                { kpi: { _id: 'KPI1', value: 500 }, targetValue: 500, weightPercentage: 5000 },
                { kpi: { _id: 'KPI2', value: 800 }, targetValue: 800, weightPercentage: 5000 },
              ],
            },
          ],
        },
      ],
      guaranteedBonuses: [
        {
          amount: 2000,
          paymentTime: 'payment-delayed',
          absorbability: {
            directProductionPercentage: 0,
            indirectProductionPercentage: 100,
          },
        },
      ],
      fromProductivePeriodYear: 2018,
      fromProductivePeriodMonth: 9,
      toProductivePeriodYear: 2019,
      toProductivePeriodMonth: 1,
      willExpireDate: new Date('2019-01-31T00:00:00.000Z'),
    });

    expect(calculateBonuses(letter, 2018, 9)).toMatchSnapshot('A');
    expect(calculateBonuses(letter, 2018, 10)).toMatchSnapshot('B');
    expect(calculateBonuses(letter, 2019, 1)).toMatchSnapshot('C');
  });

  test('should calculate BonusLetter with Payment Delayed Conditioned with delay', () => {
    const letter = new BonusLetter({
      _id: '01-2020',
      status: 'wip',
      promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-d21s',
      promoterSerialNumber: 'AZ123456',
      promoterDisplayName: 'Pippo De Peppis',
      type: 'rappel',
      description: 'Bla bla bla',
      signatureDate: new Date(),
      attachmentIds: ['a', 'b'],
      paymentFrequency: 'one-time',
      conditionedBonuses: [
        {
          amount: 1000,
          paymentTime: 'payment-delayed',
          productivePeriodPaymentDelay: 1,
          maxRecoveryPercentage: 10000,
          conditions: [
            {
              targets: [
                { kpi: { _id: 'KPI1', value: 500 }, targetValue: 500, weightPercentage: 5000 },
                { kpi: { _id: 'KPI2', value: 800 }, targetValue: 800, weightPercentage: 5000 },
              ],
            },
          ],
        },
      ],
      guaranteedBonuses: [],
      fromProductivePeriodYear: 2018,
      fromProductivePeriodMonth: 9,
      toProductivePeriodYear: 2019,
      toProductivePeriodMonth: 1,
      willExpireDate: new Date('2019-01-31T00:00:00.000Z'),
    });

    expect(calculateBonuses(letter, 2019, 1)).toMatchSnapshot('A');
    expect(calculateBonuses(letter, 2019, 2)).toMatchSnapshot('B');
  });

  test('should calculate BonusLetter with One Time Delayed Prepaid (failing) and One Time Guaranteed', () => {
    const letter = new BonusLetter({
      _id: '01-2020',
      status: 'wip',
      promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-d21s',
      promoterSerialNumber: 'AZ123456',
      promoterDisplayName: 'Pippo De Peppis',
      type: 'rappel',
      description: 'Bla bla bla',
      signatureDate: new Date(),
      attachmentIds: ['a', 'b'],
      paymentFrequency: 'one-time',
      conditionedBonuses: [
        {
          amount: 1000,
          paymentTime: 'prepayment',
          productivePeriodPaymentDelay: 0,
          maxRecoveryPercentage: 10000,
          conditions: [
            {
              targets: [
                { kpi: { _id: 'KPI1', value: 500 }, targetValue: 500, weightPercentage: 0 },
                { kpi: { _id: 'KPI2', value: 800 }, targetValue: 800, weightPercentage: 0 },
              ],
            },
          ],
        },
      ],
      guaranteedBonuses: [],
      fromProductivePeriodYear: 2018,
      fromProductivePeriodMonth: 9,
      toProductivePeriodYear: 2019,
      toProductivePeriodMonth: 1,
      willExpireDate: new Date('2019-01-31T00:00:00.000Z'),
    });

    expect(calculateBonuses(letter, 2019, 1)).toMatchSnapshot('A');
  });

  test('should calculate BonusLetter with One Time Delayed Prepaid (failing) and progressive recovery', () => {
    const letter = new BonusLetter({
      _id: '01-2020',
      status: 'wip',
      promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-d21s',
      promoterSerialNumber: 'AZ123456',
      promoterDisplayName: 'Pippo De Peppis',
      type: 'rappel',
      description: 'Bla bla bla',
      signatureDate: new Date(),
      attachmentIds: ['a', 'b'],
      paymentFrequency: 'monthly',
      conditionedBonuses: [
        {
          amount: 1000,
          paymentTime: 'prepayment',
          productivePeriodPaymentDelay: 0,
          maxRecoveryPercentage: 3000,
          conditions: [
            {
              targets: [
                { kpi: { _id: 'KPI1', value: 0 }, targetValue: 500, weightPercentage: 0 },
                { kpi: { _id: 'KPI2', value: 0 }, targetValue: 800, weightPercentage: 0 },
              ],
            },
          ],
        },
      ],
      guaranteedBonuses: [],
      fromProductivePeriodYear: 2018,
      fromProductivePeriodMonth: 9,
      toProductivePeriodYear: 2019,
      toProductivePeriodMonth: 1,
      willExpireDate: new Date('2019-01-31T00:00:00.000Z'),
    });

    expect(calculateBonuses(letter, 2019, 1)).toMatchSnapshot('A');
    expect(calculateBonuses(letter, 2019, 2)).toMatchSnapshot('B');
    expect(calculateBonuses(letter, 2019, 3)).toMatchSnapshot('C');
    expect(calculateBonuses(letter, 2019, 4)).toMatchSnapshot('D');
  });
});
