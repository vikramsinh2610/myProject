const ManagementFeeLetter = require('./management-fee-letter');

describe('ManagementFeeLetter', () => {
  test('should have these properties', () => {
    const letter = new ManagementFeeLetter({
      _id: '01-2020',
      status: 'wip',
      promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-d21s',
      promoterSerialNumber: 'AZ123456',
      promoterDisplayName: 'Pippo De Peppis',
      description: 'Bla bla bla',
      signatureDate: new Date(),
      attachmentIds: ['a', 'b'],
      thresholdAmount: 1400,
      paymentDelayMonths: 1,
      fromProductivePeriodYear: 2018,
      fromProductivePeriodMonth: 1,
      toProductivePeriodYear: 2019,
      toProductivePeriodMonth: 1,
    });
    expect(letter).toHaveProperty('_id');
    expect(letter).toHaveProperty('status');
    expect(letter).toHaveProperty('promoterId');
    expect(letter).toHaveProperty('promoterSerialNumber');
    expect(letter).toHaveProperty('promoterDisplayName');
    expect(letter).toHaveProperty('type');
    expect(letter).toHaveProperty('description');
    expect(letter).toHaveProperty('signatureDate');
    expect(letter).toHaveProperty('attachmentIds');
    expect(letter).toHaveProperty('thresholdAmount');
    expect(letter).toHaveProperty('paymentDelayMonths');
    expect(letter).toHaveProperty('fromProductivePeriodYear');
    expect(letter).toHaveProperty('fromProductivePeriodMonth');
    expect(letter).toHaveProperty('toProductivePeriodYear');
    expect(letter).toHaveProperty('toProductivePeriodMonth');
  });

  test('should return it s JSON Schema', () => {
    expect(ManagementFeeLetter.getJSONSchema()).toMatchSnapshot();
  });
});
