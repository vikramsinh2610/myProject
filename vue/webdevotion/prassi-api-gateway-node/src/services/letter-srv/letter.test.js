const Letter = require('./letter');

describe('Letter', () => {
  test('should have these properties', () => {
    const letter = new Letter({
      _id: '01-2020',
      status: 'wip',
      promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-d21s',
      promoterSerialNumber: 'AZ123456',
      promoterDisplayName: 'Pippo De Peppis',
      type: 'rappel',
      description: 'Bla bla bla',
      signatureDate: new Date(),
      attachmentIds: ['a', 'b'],
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
    expect(letter).toHaveProperty('didActiveDate');
    expect(letter).toHaveProperty('didCreateDate');
    expect(letter).toHaveProperty('didDeleteDate');
    expect(letter).toHaveProperty('didExpireDate');
    expect(letter).toHaveProperty('willExpireDate');
  });

  test('should return it s JSON Schema', () => {
    expect(Letter.getJSONSchema()).toMatchSnapshot();
  });
});
