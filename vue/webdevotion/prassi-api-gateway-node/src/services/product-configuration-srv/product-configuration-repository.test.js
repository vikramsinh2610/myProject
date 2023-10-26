const dbConnector = require('../../utils/mongo-tests');
const { getByProductId } = require('./product-configuration-repository');
const ProductConfiguration = require('./product-configuration');
const Option = require('./option');

describe('Product Configuration Repository', () => {
  it('should get configuration by product ID', async () => {
    const { db, client } = await dbConnector();
    expect.assertions(1);

    const mockObject = new ProductConfiguration({
      _id: 'ProductId',
      premiumType: 'net',
      productName: 'Pippo',
      productCode: 'Pluto',
      advance: true,
      companyAdvance: true,
      monthsOnSubscription: 1,
      options: [
        new Option({
          _id: 'A',
          fromYear: 0,
          toYear: 2,
          fromPremiumAmount: 0,
          toPremiumAmount: 10000,
          fixedAmount: 125,
          percentage: 10,
          retrocessionFee: 80,
        }),
      ],
    });
    await db.collection('product-configuration').insert(mockObject);

    const configObject = await getByProductId(db, 'ProductId');
    expect(configObject).toMatchObject(mockObject);
    client.close();
  });

  it('should error with nonexistent product configuration', async () => {
    const { db, client } = await dbConnector();
    expect.assertions(1);
    try {
      await getByProductId(db, 'fake-product-id');
    } catch (error) {
      // eslint-disable-next-line jest/no-try-expect
      expect(error).toMatchObject(new Error("La configurazione del prodotto 'fake-product-id' non esiste"));
    }
    client.close();
  });
});
