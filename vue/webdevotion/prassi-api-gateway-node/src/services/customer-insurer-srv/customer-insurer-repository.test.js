const dbConnector = require('../../utils/mongo-tests');
const { parse } = require('../../utils/productive-period-helper');
const customerInsurerRepository = require('./customer-insurer-repository');

describe('CustomerInsurer repository tests', () => {
  let db;
  let client;

  beforeAll(async () => {
    const connection = await dbConnector();
    db = connection.db;
    client = connection.client;
  });

  it('get getLastBeforePeriod customer insurer', async () => {
    expect.assertions(2);

    const todayPeriodYear = new Date().getFullYear();
    const todayPeriodMonth = new Date().getMonth() + 1;

    await db.collection('customer-insurer').insertOne({
      _id: `6f121c97-20e1-ac41-829c-a55c00a9653c-${parse(2015, 11)}`,
      customerId: '6f121c97-20e1-ac41-829c-a55c00a9653c',
      networkNodeId: 'b6bec517-bc02-b941-9ae3-383a2aa4c78f',
      productivePeriodMonth: 11,
      productivePeriodYear: 2015,
      promoterId: '06f5fbac-8af5-0a47-a081-decf16c8d25d',
    });

    await db.collection('customer-insurer').insertOne({
      _id: `6f121c97-20e1-ac41-829c-a55c00a9653c-${parse(2017, 11)}`,
      customerId: '6f121c97-20e1-ac41-829c-a55c00a9653c',
      networkNodeId: 'bc57e219-b5ff-f643-84c9-8057d857fb4d',
      productivePeriodMonth: 11,
      productivePeriodYear: 2017,
      promoterId: '06f5fbac-8af5-0a47-a081-decf16c8d25d',
    });

    const customer = await customerInsurerRepository.getLastBeforePeriod(
      db,
      '6f121c97-20e1-ac41-829c-a55c00a9653c',
      todayPeriodYear,
      todayPeriodMonth,
    );

    const count = await db.collection('customer-insurer').find({}).count();

    expect(customer).toMatchObject({
      _id: `6f121c97-20e1-ac41-829c-a55c00a9653c-${parse(2017, 11)}`,
      productivePeriodYear: 2017,
      productivePeriodMonth: 11,
      customerId: '6f121c97-20e1-ac41-829c-a55c00a9653c',
      networkNodeId: 'bc57e219-b5ff-f643-84c9-8057d857fb4d',
      promoterId: '06f5fbac-8af5-0a47-a081-decf16c8d25d',
    });

    expect(count).toBe(2);
  }, 600000);

  afterAll(() => {
    client.close();
  });
});
