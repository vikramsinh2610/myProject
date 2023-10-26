const JobLetter = require('./job-letter');

describe('JobLetter', () => {
  test('should have these properties', () => {
    const letter = new JobLetter({
      _id: '01-2020',
      status: 'wip',
      promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-d21s',
      promoterSerialNumber: 'AZ123456',
      promoterDisplayName: 'Pippo De Peppis',
      description: 'Bla bla bla',
      signatureDate: new Date(),
      attachmentIds: ['a', 'b'],
      fromProductivePeriodYear: 2018,
      fromProductivePeriodMonth: 1,
      job: {
        roleId: 'PROMOTER',
        directProductionPercentage: 65,
        isIndirectProductionCombinable: false,
        directProductionForfait: 1000,
      },
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
    expect(letter).toHaveProperty('job');
    expect(letter).toHaveProperty('fromProductivePeriodYear');
    expect(letter).toHaveProperty('fromProductivePeriodMonth');
  });

  test('should return it s JSON Schema', () => {
    expect(JobLetter.getJSONSchema()).toMatchSnapshot();
  });
});
