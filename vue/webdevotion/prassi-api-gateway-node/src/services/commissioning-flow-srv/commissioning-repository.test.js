const CommissioningState = require('./commissioning-state');
const dbConnector = require('../../utils/mongo-tests');

const { getById, update, exists } = require('./commissioning-repository');

describe('Commissioning Repository', () => {
  it('should save commissioning state', async () => {
    expect.assertions(1);

    const { db, client } = await dbConnector();

    const commissioningState = new CommissioningState({
      productivePeriodYear: 2018,
      productivePeriodMonth: 5,
      status: 'OPENED',
    });
    await db.collection('commissioning').insertOne(commissioningState);

    commissioningState.status = 'CLOSED';
    await update(db, commissioningState);

    const resp = await db.collection('commissioning').findOne({ _id: '201805' });
    expect(resp).toMatchObject({
      _id: '201805',
      installments: [],
      productivePeriodMonth: 5,
      productivePeriodYear: 2018,
      status: 'CLOSED',
    });
    client.close();
  });

  it('should get commissioning state by Id', async () => {
    expect.assertions(1);

    const { db, client } = await dbConnector();

    const commissioningState = new CommissioningState({
      productivePeriodYear: 2018,
      productivePeriodMonth: 5,
      didClosedDate: null,
      didConfirmedDate: null,
      didOpenedDate: null,
      didProcessDate: null,
    });
    await db.collection('commissioning').insertOne(commissioningState);

    const resp = await getById(db, '201805');
    expect(resp).toMatchObject(commissioningState);
    client.close();
  });

  it('should check if commissioning state exists by Id', async () => {
    expect.assertions(1);

    const { db, client } = await dbConnector();

    const commissioningState = new CommissioningState({
      productivePeriodYear: 2018,
      productivePeriodMonth: 5,
    });
    await db.collection('commissioning').insertOne(commissioningState);

    const resp = await exists(db, '201805');
    expect(resp).toBeTruthy();
    client.close();
  });
});
