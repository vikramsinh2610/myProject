const { v4: uuid } = require('uuid');
const Company = require('./company');
const { mapCompany, getAll } = require('./company-repository');
const { uuidToBinary } = require('../../utils/uuid-to-binary');
const dbConnector = require('../../utils/mongo-tests');

describe('Company Repository', () => {
  test('should map legacy Company object', async () => {
    expect.assertions(1);
    const _id = uuid();
    expect(
      mapCompany({
        _id: uuidToBinary(_id),
        NomeCompagnia: 'Company',
        CodiceCompagnia: '1234',
      }),
    ).toMatchObject(new Company({ _id, name: 'Company', code: '1234' }));
  });

  test('should get all companies', async () => {
    const { db, client } = await dbConnector();

    const _id = uuid();
    await db.collection('CompanyConfiguration').insertOne({
      _id: uuidToBinary(_id),
      NomeCompagnia: 'Company',
      CodiceCompagnia: '1234',
    });

    const result = await getAll(db);
    expect(result).toMatchObject([new Company({ _id, name: 'Company', code: '1234' })]);
    client.close();
  });
});
