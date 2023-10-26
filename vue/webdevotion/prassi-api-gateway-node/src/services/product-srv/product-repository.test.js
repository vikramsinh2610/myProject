const { v4: uuid } = require('uuid');
const Product = require('./product');
const dbConnector = require('../../utils/mongo-tests');
const { mapProduct, getAll } = require('./product-repository');
const { uuidToBinary } = require("../../utils/uuid-to-binary");

describe('Product Repository', () => {
  test('should map legacy Product object', async () => {
    const _id = uuid();
    expect(
      mapProduct({
        _id: uuidToBinary(_id),
        Title: 'Product',
        AnagraficaProdotto: { CodiceProdotto: '1234' },
      }),
    ).toMatchObject(new Product({ _id, name: 'Product', code: '1234' }));
  });

  test('should get all products', async () => {
    const { db, client } = await dbConnector();

    const _id = uuid();
    await db.collection('Product').insert({
      _id: uuidToBinary(_id),
      Title: 'Product',
      AnagraficaProdotto: { CodiceProdotto: '1234' },
    });

    const result = await getAll(db, {});
    expect(result).toMatchObject([new Product({ _id, name: 'Product', code: '1234' })]);
    client.close();
  });
});
