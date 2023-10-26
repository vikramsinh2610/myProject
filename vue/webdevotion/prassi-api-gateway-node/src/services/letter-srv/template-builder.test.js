const MockDate = require('mockdate');
const Letter = require('./letter');
const { getTypedLetter } = require('./template-builder');
const { types } = require('./letter-types');

describe('Letter Template Builder', () => {
  beforeAll(() => {
    // @ts-ignore
    MockDate.set(new Date('2018-08-01T00:00:00.000Z'), 0);
  });

  test('should create GUARANTEED template', () => {
    const letter = new Letter({
      _id: '01-2020',
      status: 'wip',
      promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-d21s',
      promoterSerialNumber: 'AZ123456',
      promoterDisplayName: 'Pippo De Peppis',
      description: 'Bla bla bla',
      signatureDate: new Date(),
      attachmentIds: ['a', 'b'],
    });

    const template = getTypedLetter(letter, { type: types.GUARANTEED });
    expect(template).toMatchSnapshot();
  });

  test('should create GUARANTEED_WITH_BONUS template', () => {
    const letter = new Letter({
      _id: '01-2020',
      status: 'wip',
      promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-d21s',
      promoterSerialNumber: 'AZ123456',
      promoterDisplayName: 'Pippo De Peppis',
      description: 'Bla bla bla',
      signatureDate: new Date(),
      attachmentIds: ['a', 'b'],
    });

    const template = getTypedLetter(letter, { type: types.GUARANTEED_WITH_BONUS });
    expect(template).toMatchSnapshot();
  });

  test('should create GUARANTEED_WITH_BONUS_PREPAYD template', () => {
    const letter = new Letter({
      _id: '01-2020',
      status: 'wip',
      promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-d21s',
      promoterSerialNumber: 'AZ123456',
      promoterDisplayName: 'Pippo De Peppis',
      description: 'Bla bla bla',
      signatureDate: new Date(),
      attachmentIds: ['a', 'b'],
    });

    const template = getTypedLetter(letter, { type: types.GUARANTEED_WITH_BONUS_PREPAYD });
    expect(template).toMatchSnapshot();
  });

  test('should create MANAGEMENT_FEE template', () => {
    const letter = new Letter({
      _id: '01-2020',
      status: 'wip',
      promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-d21s',
      promoterSerialNumber: 'AZ123456',
      promoterDisplayName: 'Pippo De Peppis',
      description: 'Bla bla bla',
      signatureDate: new Date(),
      attachmentIds: ['a', 'b'],
    });

    const template = getTypedLetter(letter, { type: types.MANAGEMENT_FEE });
    expect(template).toMatchSnapshot();
  });

  test('should create WELCOME_BONUS template', () => {
    const letter = new Letter({
      _id: '01-2020',
      status: 'wip',
      promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-d21s',
      promoterSerialNumber: 'AZ123456',
      promoterDisplayName: 'Pippo De Peppis',
      description: 'Bla bla bla',
      signatureDate: new Date(),
      attachmentIds: ['a', 'b'],
    });

    const template = getTypedLetter(letter, { type: types.WELCOME_BONUS });
    expect(template).toMatchSnapshot();
  });

  test('should create RAPPEL template', () => {
    const letter = new Letter({
      _id: '01-2020',
      status: 'wip',
      promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-d21s',
      promoterSerialNumber: 'AZ123456',
      promoterDisplayName: 'Pippo De Peppis',
      description: 'Bla bla bla',
      signatureDate: new Date(),
      attachmentIds: ['a', 'b'],
    });

    const template = getTypedLetter(letter, { type: types.RAPPEL });
    expect(template).toMatchSnapshot();
  });

  test('should create PRIVACY template', () => {
    const letter = new Letter({
      _id: '01-2020',
      status: 'wip',
      promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-d21s',
      promoterSerialNumber: 'AZ123456',
      promoterDisplayName: 'Pippo De Peppis',
      description: 'Bla bla bla',
      signatureDate: new Date(),
      attachmentIds: ['a', 'b'],
    });

    const template = getTypedLetter(letter, { type: types.PRIVACY });
    expect(template).toMatchSnapshot();
  });

  test('should create JOB template', () => {
    const letter = new Letter({
      _id: '01-2020',
      status: 'wip',
      promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-d21s',
      promoterSerialNumber: 'AZ123456',
      promoterDisplayName: 'Pippo De Peppis',
      description: 'Bla bla bla',
      signatureDate: new Date(),
      attachmentIds: ['a', 'b'],
    });

    const template = getTypedLetter(letter, { type: types.JOB });
    expect(template).toMatchSnapshot();
  });
});
