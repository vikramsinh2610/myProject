const PrivacyLetter = require('./privacy-letter');

describe('PrivacyLetter', () => {
  test('should have these properties', () => {
    const letter = new PrivacyLetter({
      _id: '01-2020',
      status: 'wip',
      promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-d21s',
      promoterSerialNumber: 'AZ123456',
      promoterDisplayName: 'Pippo De Peppis',
      description: 'Bla bla bla',
      signatureDate: new Date(),
      attachmentIds: ['a', 'b'],
      agreements: [],
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
    expect(letter).toHaveProperty('agreements');
  });

  test('should return it s JSON Schema', () => {
    expect(PrivacyLetter.getJSONSchema()).toMatchSnapshot();
  });
});
