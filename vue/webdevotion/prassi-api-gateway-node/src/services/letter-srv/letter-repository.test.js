const dbConnector = require('../../utils/mongo-tests');
const { getNextId, insert, getById, replace, countOverlappingLetters } = require('./letter-repository');
const Letter = require('./letter');
const ManagementFeeLetter = require('./management-fee/management-fee-letter');

const letter = new Letter({
  _id: '01-2020',
  status: 'wip',
  promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-d21s',
  promoterSerialNumber: 'AZ123456',
  promoterDisplayName: 'Pippo De Peppis',
  didActiveDate: null,
  didCreateDate: null,
  didDeleteDate: null,
  didExpireDate: null,
  willExpireDate: null,
});

describe('Letter Repository', () => {
  test('should insert a letter', async () => {
    const { db, client } = await dbConnector();
    await insert(db, letter);

    const result = await db.collection('letter').findOne({ _id: letter._id });
    expect(result).toMatchObject(letter);
    client.close();
  });

  test('should get sequential letter id', async () => {
    const { db, client } = await dbConnector();
    await insert(db, letter);

    const id = await getNextId(db);
    expect(id).toMatch(/^(\d)-(20\d+).*$/);
    client.close();
  });

  test('should get a letter', async () => {
    const { db, client } = await dbConnector();
    await db.collection('letter').insert(letter);

    const result = await getById(db, letter._id, letter.promoterId);
    expect(result).toMatchObject(letter);
    client.close();
  });

  test('should count overlapping letters of same promoter and type', async () => {
    const { db, client } = await dbConnector();
    const letters = [
      new ManagementFeeLetter({
        _id: '01-2022',
        status: 'wip',
        promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-d21s',
        promoterSerialNumber: 'AZ123456',
        promoterDisplayName: 'Pippo De Peppis',
        thresholdAmount: 1400,
        paymentDelayMonths: 1,
        fromProductivePeriodYear: 2018,
        fromProductivePeriodMonth: 5,
        toProductivePeriodYear: 2019,
        toProductivePeriodMonth: 1,
      }),
      new ManagementFeeLetter({
        _id: '02-2022',
        status: 'active',
        promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-d21s',
        promoterSerialNumber: 'AZ123456',
        promoterDisplayName: 'Pippo De Peppis',
        thresholdAmount: 1400,
        paymentDelayMonths: 1,
        fromProductivePeriodYear: 2018,
        fromProductivePeriodMonth: 1,
        toProductivePeriodYear: 2018,
        toProductivePeriodMonth: 4,
      }),
      new ManagementFeeLetter({
        _id: '03-2022',
        status: 'active',
        promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-d21s',
        promoterSerialNumber: 'AZ123456',
        promoterDisplayName: 'Pippo De Peppis',
        thresholdAmount: 1400,
        paymentDelayMonths: 1,
        fromProductivePeriodYear: 2018,
        fromProductivePeriodMonth: 12,
        toProductivePeriodYear: 2020,
        toProductivePeriodMonth: 1,
      }),
      new ManagementFeeLetter({
        _id: '04-2022',
        status: 'active',
        promoterId: 'f34g3df-f3c3x2ed-d232r4g5h5-ABC',
        promoterSerialNumber: 'AZ123456',
        promoterDisplayName: 'Topolino De Paperis',
        thresholdAmount: 1400,
        paymentDelayMonths: 1,
        fromProductivePeriodYear: 2018,
        fromProductivePeriodMonth: 6,
        toProductivePeriodYear: 2018,
        toProductivePeriodMonth: 8,
      }),
    ];

    await db.collection('letter').insertMany(letters);

    const result = await countOverlappingLetters(db, letters[0]);
    expect(result).toBe(2);
    client.close();
  });

  // eslint-disable-next-line jest/no-disabled-tests
  test('should update a letter', async () => {
    const { db, client } = await dbConnector();
    await db.collection('letter').insert(letter);

    const result = await replace(db, { ...letter, description: 'Bla bla bla' });
    expect(result).toMatchObject({ ...letter, description: 'Bla bla bla' });
    client.close();
  });
});
