const dbConnector = require('../../utils/mongo-tests');
const CustomerInsurerSrv = require('.');
const { parse } = require('../../utils/productive-period-helper');

describe('Get Customer Insurer Tests', () => {
  it('getCustomerInsurer should get record of exact period', async () => {
    expect.assertions(2);

    const { db, client } = await dbConnector();
    const customerInsurerSrv = new CustomerInsurerSrv(db);
    const firstPeriodYear = new Date().getFullYear() - 1;
    const firstPeriodMonth = new Date().getMonth() + 1;


    await db.collection('customer-insurer').insertOne({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        firstPeriodYear,
        firstPeriodMonth,
      )}`,
      customerId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: firstPeriodYear,
      productivePeriodMonth: firstPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    const customer = await customerInsurerSrv.getCustomerInsurer(
      'fff0bbb1-902a-ed47-8f80-a984013e439a',
      firstPeriodYear,
      firstPeriodMonth,
    );

    const count = await db.collection('customer-insurer').find({}).count();

    expect(customer).toMatchObject({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        firstPeriodYear,
        firstPeriodMonth,
      )}`,
      customerId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: firstPeriodYear,
      productivePeriodMonth: firstPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    expect(count).toBe(1);

    client.close();
  }, 600000);

  it('getCustomerInsurer should insert record of today period', async () => {
    expect.assertions(3);

    const { db, client } = await dbConnector();
    const customerInsurerSrv = new CustomerInsurerSrv(db);
    const firstPeriodYear = new Date().getFullYear() - 1;
    const firstPeriodMonth = new Date().getMonth() + 1;
    const todayPeriodYear = new Date().getFullYear();
    const todayPeriodMonth = new Date().getMonth() + 1;

    await db.collection('customer-insurer').insertOne({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        firstPeriodYear,
        firstPeriodMonth,
      )}`,
      customerId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: firstPeriodYear,
      productivePeriodMonth: firstPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    const customer = await customerInsurerSrv.getCustomerInsurer(
      'fff0bbb1-902a-ed47-8f80-a984013e439a',
      todayPeriodYear,
      todayPeriodMonth,
    );

    const customerInserted = await db.collection('customer-insurer').findOne({
      customerId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      productivePeriodYear: todayPeriodYear,
      productivePeriodMonth: todayPeriodMonth,
    });

    const count = await db.collection('customer-insurer').find({}).count();

    expect(customer).toMatchObject({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        todayPeriodYear,
        todayPeriodMonth,
      )}`,
      customerId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: todayPeriodYear,
      productivePeriodMonth: todayPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    expect(customerInserted).toMatchObject({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        todayPeriodYear,
        todayPeriodMonth,
      )}`,
      customerId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: todayPeriodYear,
      productivePeriodMonth: todayPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    expect(count).toBe(2);

    client.close();
  }, 600000);

  it('getCustomerInsurer should get record of next period', async () => {
    expect.assertions(2);

    const { db, client } = await dbConnector();
    const customerInsurerSrv = new CustomerInsurerSrv(db);
    const firstPeriodYear = new Date().getFullYear() - 1;
    const firstPeriodMonth = new Date().getMonth() + 1;
    const nextPeriodYear = new Date().getFullYear() + 1;
    const nextPeriodMonth = new Date().getMonth() + 1;

    await db.collection('customer-insurer').insertOne({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        firstPeriodYear,
        firstPeriodMonth,
      )}`,
      customerId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: firstPeriodYear,
      productivePeriodMonth: firstPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    const customer = await customerInsurerSrv.getCustomerInsurer(
      'fff0bbb1-902a-ed47-8f80-a984013e439a',
      nextPeriodYear,
      nextPeriodMonth,
    );

    const count = await db.collection('customer-insurer').find({}).count();

    expect(customer).toMatchObject({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        nextPeriodYear,
        nextPeriodMonth,
      )}`,
      customerId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: nextPeriodYear,
      productivePeriodMonth: nextPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    expect(count).toBe(1);

    client.close();
  }, 600000);

  it('getCustomerInsurer should get record of before period', async () => {
    expect.assertions(2);

    const { db, client } = await dbConnector();
    const customerInsurerSrv = new CustomerInsurerSrv(db);
    const firstPeriodYear = new Date().getFullYear() - 1;
    const firstPeriodMonth = new Date().getMonth() + 1;
    const beforePeriodYear = new Date().getFullYear() - 2;
    const beforePeriodMonth = new Date().getMonth() + 1;

    await db.collection('customer-insurer').insertOne({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        firstPeriodYear,
        firstPeriodMonth,
      )}`,
      customerId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: firstPeriodYear,
      productivePeriodMonth: firstPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    const customer = await customerInsurerSrv.getCustomerInsurer(
      'fff0bbb1-902a-ed47-8f80-a984013e439a',
      beforePeriodYear,
      beforePeriodMonth,
    );

    const count = await db.collection('customer-insurer').find({}).count();

    expect(customer).toMatchObject({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        firstPeriodYear,
        firstPeriodMonth,
      )}`,
      customerId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: firstPeriodYear,
      productivePeriodMonth: firstPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    expect(count).toBe(1);

    client.close();
  }, 600000);
});

describe('Force Customer Insurer Tests', () => {
  it('forceCustomerInsurer should get record of exact period', async () => {
    expect.assertions(2);

    const { db, client } = await dbConnector();
    const customerInsurerSrv = new CustomerInsurerSrv(db);
    const firstPeriodYear = new Date().getFullYear() - 1;
    const firstPeriodMonth = new Date().getMonth() + 1;


    await db.collection('customer-insurer').insertOne({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        firstPeriodYear,
        firstPeriodMonth,
      )}`,
      customerId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: firstPeriodYear,
      productivePeriodMonth: firstPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    const customer = await customerInsurerSrv.forceCustomerInsurer(
      'fff0bbb1-902a-ed47-8f80-a984013e439a',
      firstPeriodYear,
      firstPeriodMonth,
    );

    const count = await db.collection('customer-insurer').find({}).count();

    expect(customer).toMatchObject({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        firstPeriodYear,
        firstPeriodMonth,
      )}`,
      customerId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: firstPeriodYear,
      productivePeriodMonth: firstPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    expect(count).toBe(1);

    client.close();
  }, 600000);

  it('forceCustomerInsurer should insert record of today period', async () => {
    expect.assertions(3);

    const { db, client } = await dbConnector();
    const customerInsurerSrv = new CustomerInsurerSrv(db);
    const firstPeriodYear = new Date().getFullYear() - 1;
    const firstPeriodMonth = new Date().getMonth() + 1;
    const todayPeriodYear = new Date().getFullYear();
    const todayPeriodMonth = new Date().getMonth() + 1;

    await db.collection('customer-insurer').insertOne({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        firstPeriodYear,
        firstPeriodMonth,
      )}`,
      customerId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: firstPeriodYear,
      productivePeriodMonth: firstPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    const customer = await customerInsurerSrv.forceCustomerInsurer(
      'fff0bbb1-902a-ed47-8f80-a984013e439a',
      todayPeriodYear,
      todayPeriodMonth,
    );

    const customerInserted = await db.collection('customer-insurer').findOne({
      customerId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      productivePeriodYear: todayPeriodYear,
      productivePeriodMonth: todayPeriodMonth,
    });

    const count = await db.collection('customer-insurer').find({}).count();

    expect(customer).toMatchObject({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        todayPeriodYear,
        todayPeriodMonth,
      )}`,
      customerId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: todayPeriodYear,
      productivePeriodMonth: todayPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    expect(customerInserted).toMatchObject({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        todayPeriodYear,
        todayPeriodMonth,
      )}`,
      customerId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: todayPeriodYear,
      productivePeriodMonth: todayPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    expect(count).toBe(2);

    client.close();
  }, 600000);

  it('forceCustomerInsurer should get record of next period', async () => {
    expect.assertions(2);

    const { db, client } = await dbConnector();
    const customerInsurerSrv = new CustomerInsurerSrv(db);
    const firstPeriodYear = new Date().getFullYear() - 1;
    const firstPeriodMonth = new Date().getMonth() + 1;
    const nextPeriodYear = new Date().getFullYear() + 1;
    const nextPeriodMonth = new Date().getMonth() + 1;

    await db.collection('customer-insurer').insertOne({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        firstPeriodYear,
        firstPeriodMonth,
      )}`,
      customerId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: firstPeriodYear,
      productivePeriodMonth: firstPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    const customer = await customerInsurerSrv.forceCustomerInsurer(
      'fff0bbb1-902a-ed47-8f80-a984013e439a',
      nextPeriodYear,
      nextPeriodMonth,
    );

    const count = await db.collection('customer-insurer').find({}).count();

    expect(customer).toMatchObject({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        nextPeriodYear,
        nextPeriodMonth,
      )}`,
      customerId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: nextPeriodYear,
      productivePeriodMonth: nextPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    expect(count).toBe(1);

    client.close();
  }, 600000);

  it('forceCustomerInsurer should get record of before period', async () => {
    expect.assertions(2);

    const { db, client } = await dbConnector();
    const customerInsurerSrv = new CustomerInsurerSrv(db);
    const firstPeriodYear = new Date().getFullYear() - 1;
    const firstPeriodMonth = new Date().getMonth() + 1;
    const beforePeriodYear = new Date().getFullYear() - 2;
    const beforePeriodMonth = new Date().getMonth() + 1;

    await db.collection('customer-insurer').insertOne({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        firstPeriodYear,
        firstPeriodMonth,
      )}`,
      customerId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: firstPeriodYear,
      productivePeriodMonth: firstPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    const customer = await customerInsurerSrv.forceCustomerInsurer(
      'fff0bbb1-902a-ed47-8f80-a984013e439a',
      beforePeriodYear,
      beforePeriodMonth,
    );

    const count = await db.collection('customer-insurer').find({}).count();

    expect(customer).toMatchObject({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        firstPeriodYear,
        firstPeriodMonth,
      )}`,
      customerId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: firstPeriodYear,
      productivePeriodMonth: firstPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    expect(count).toBe(1);

    client.close();
  }, 600000);

  it('forceCustomerInsurer to fix bug rigamonti', async () => {
    expect.assertions(2);

    const { db, client } = await dbConnector();
    const customerInsurerSrv = new CustomerInsurerSrv(db);
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

    const customer = await customerInsurerSrv.forceCustomerInsurer(
      '6f121c97-20e1-ac41-829c-a55c00a9653c',
      todayPeriodYear,
      todayPeriodMonth,
    );

    const count = await db.collection('customer-insurer').find({}).count();

    expect(customer).toMatchObject({
      _id: `6f121c97-20e1-ac41-829c-a55c00a9653c-${parse(todayPeriodYear, todayPeriodMonth)}`,
      productivePeriodYear: todayPeriodYear,
      productivePeriodMonth: todayPeriodMonth,
      customerId: '6f121c97-20e1-ac41-829c-a55c00a9653c',
      networkNodeId: 'bc57e219-b5ff-f643-84c9-8057d857fb4d',
      promoterId: '06f5fbac-8af5-0a47-a081-decf16c8d25d',
    });

    expect(count).toBe(3);

    client.close();
  }, 600000);
});
