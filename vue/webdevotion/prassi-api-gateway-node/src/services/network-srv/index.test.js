const dbConnector = require('../../utils/mongo-tests');
const dbConnectorSql = require('../../utils/postgres-tests');
const NetworkSrv = require('.');
const { parse, unparse, addMonths } = require('../../utils/productive-period-helper');

describe('Get Network Tree Tests', () => {
  it('createAndGetNetwork should get record of exact period', async () => {
    expect.assertions(2);

    const { db, client } = await dbConnector();
    const sql = await dbConnectorSql();
    const networkSrv = new NetworkSrv(db, sql);
    const firstPeriodYear = new Date().getFullYear() - 1;
    const firstPeriodMonth = new Date().getMonth() + 1;

    await db.collection('network').insertOne({
      _id: parse(firstPeriodYear, firstPeriodMonth),
      createDate: '2020-03-16T16:53:32.374+01:00',
      tree: {
        _id: '7e6250b0-e343-4c4f-8c00-4cffb78f8df6',
        name: 'Direzione',
        enabled: true,
        roleId: 'administrator',
        promoterId: '1e455cd0-59aa-0448-af68-b9c60d3ff346',
        promoterName: 'Stefano Vaghi',
        children: [],
      },
    });

    const tree = await networkSrv.createAndGetNetwork(firstPeriodYear, firstPeriodMonth);

    const count = await db.collection('network').find({}).count();

    expect(tree).toMatchObject({
      _id: '7e6250b0-e343-4c4f-8c00-4cffb78f8df6',
      name: 'Direzione',
      enabled: true,
      roleId: 'administrator',
      promoterId: '1e455cd0-59aa-0448-af68-b9c60d3ff346',
      promoterName: 'Stefano Vaghi',
      children: [],
    });

    expect(count).toBe(1);

    client.close();
  }, 600000);

  it('createAndGetNetwork should get record of next period', async () => {
    expect.assertions(2);

    const { db, client } = await dbConnector();
    const sql = await dbConnectorSql();
    const networkSrv = new NetworkSrv(db, sql);
    const firstPeriodYear = new Date().getFullYear() - 1;
    const firstPeriodMonth = new Date().getMonth() + 1;
    const nextPeriod = addMonths(parse(firstPeriodYear, firstPeriodMonth), 1);
    const nextPeriodYear = unparse(nextPeriod).productivePeriodYear;
    const nextPeriodMonth = unparse(nextPeriod).productivePeriodMonth;

    await db.collection('network').insertOne({
      _id: parse(firstPeriodYear, firstPeriodMonth),
      createDate: '2020-03-16T16:53:32.374+01:00',
      tree: {
        _id: '7e6250b0-e343-4c4f-8c00-4cffb78f8df6',
        name: 'Direzione',
        enabled: true,
        roleId: 'administrator',
        promoterId: '1e455cd0-59aa-0448-af68-b9c60d3ff346',
        promoterName: 'Stefano Vaghi',
        children: [],
      },
    });

    const tree = await networkSrv.createAndGetNetwork(nextPeriodYear, nextPeriodMonth);

    const count = await db.collection('network').find({}).count();

    expect(tree).toMatchObject({
      _id: '7e6250b0-e343-4c4f-8c00-4cffb78f8df6',
      name: 'Direzione',
      enabled: true,
      roleId: 'administrator',
      promoterId: '1e455cd0-59aa-0448-af68-b9c60d3ff346',
      promoterName: 'Stefano Vaghi',
      children: [],
    });

    expect(count).toBe(2);

    client.close();
  }, 600000);

  it('createAndGetNetworkAsTree should get record of exact period', async () => {
    expect.assertions(2);

    const { db, client } = await dbConnector();
    const sql = await dbConnectorSql();
    const networkSrv = new NetworkSrv(db, sql);
    const firstPeriodYear = new Date().getFullYear() - 1;
    const firstPeriodMonth = new Date().getMonth() + 1;

    await db.collection('network').insertOne({
      _id: parse(firstPeriodYear, firstPeriodMonth),
      createDate: '2020-03-16T16:53:32.374+01:00',
      tree: {
        _id: '7e6250b0-e343-4c4f-8c00-4cffb78f8df6',
        name: 'Direzione',
        enabled: true,
        roleId: 'administrator',
        promoterId: '1e455cd0-59aa-0448-af68-b9c60d3ff346',
        promoterName: 'Stefano Vaghi',
        children: [],
      },
    });

    const tree = await networkSrv.createAndGetNetworkAsTree(firstPeriodYear, firstPeriodMonth);

    const count = await db.collection('network').find({}).count();

    expect(tree.model).toMatchObject({
      _id: '7e6250b0-e343-4c4f-8c00-4cffb78f8df6',
      name: 'Direzione',
      enabled: true,
      roleId: 'administrator',
      promoterId: '1e455cd0-59aa-0448-af68-b9c60d3ff346',
      promoterName: 'Stefano Vaghi',
      children: [],
    });

    expect(count).toBe(1);

    client.close();
  }, 600000);

  it('createAndGetNetworkAsTree should get record of next period', async () => {
    expect.assertions(2);

    const { db, client } = await dbConnector();
    const sql = await dbConnectorSql();
    const networkSrv = new NetworkSrv(db, sql);
    const firstPeriodYear = new Date().getFullYear() - 1;
    const firstPeriodMonth = new Date().getMonth() + 1;
    const nextPeriod = addMonths(parse(firstPeriodYear, firstPeriodMonth), 1);
    const nextPeriodYear = unparse(nextPeriod).productivePeriodYear;
    const nextPeriodMonth = unparse(nextPeriod).productivePeriodMonth;

    await db.collection('network').insertOne({
      _id: parse(firstPeriodYear, firstPeriodMonth),
      createDate: '2020-03-16T16:53:32.374+01:00',
      tree: {
        _id: '7e6250b0-e343-4c4f-8c00-4cffb78f8df6',
        name: 'Direzione',
        enabled: true,
        roleId: 'administrator',
        promoterId: '1e455cd0-59aa-0448-af68-b9c60d3ff346',
        promoterName: 'Stefano Vaghi',
        children: [],
      },
    });

    const tree = await networkSrv.createAndGetNetworkAsTree(nextPeriodYear, nextPeriodMonth);

    const count = await db.collection('network').find({}).count();

    expect(tree.model).toMatchObject({
      _id: '7e6250b0-e343-4c4f-8c00-4cffb78f8df6',
      name: 'Direzione',
      enabled: true,
      roleId: 'administrator',
      promoterId: '1e455cd0-59aa-0448-af68-b9c60d3ff346',
      promoterName: 'Stefano Vaghi',
      children: [],
    });

    expect(count).toBe(2);

    client.close();
  }, 600000);

  it('updateNode should update postgres node', async () => {
    expect.assertions(3);

    const { db, client } = await dbConnector();
    const sql = await dbConnectorSql();
    const networkSrv = new NetworkSrv(db, sql);
    const firstPeriodYear = new Date().getFullYear() - 1;
    const firstPeriodMonth = new Date().getMonth() + 1;
    const nextPeriod = addMonths(parse(firstPeriodYear, firstPeriodMonth), 1);
    const nextPeriodYear = unparse(nextPeriod).productivePeriodYear;
    const nextPeriodMonth = unparse(nextPeriod).productivePeriodMonth;

    await db.collection('network').insertOne({
      _id: parse(firstPeriodYear, firstPeriodMonth),
      createDate: '2020-03-16T16:53:32.374+01:00',
      tree: {
        _id: '7e6250b0-e343-4c4f-8c00-4cffb78f8df6',
        name: 'Direzione',
        enabled: true,
        roleId: 'administrator',
        promoterId: '1e455cd0-59aa-0448-af68-b9c60d3ff346',
        promoterName: 'Stefano Vaghi',
        children: [],
      },
    });

    const tree = await networkSrv.createAndGetNetworkAsTree(nextPeriodYear, nextPeriodMonth);

    await networkSrv.updateNode(
      '7e6250b0-e343-4c4f-8c00-4cffb78f8df6',
      nextPeriodYear,
      nextPeriodMonth,
    );

    const networkNode = await sql
      .select()
      .from('network_node')
      .where('uuid', '7e6250b0-e343-4c4f-8c00-4cffb78f8df6')
      .andWhere('productivePeriodMonth', nextPeriodMonth)
      .andWhere('productivePeriodYear', nextPeriodYear)
      .then((results) => results);

    // @ts-ignore
    expect(networkNode[0].name).toBe('Direzione');

    const count = await db.collection('network').find({}).count();

    expect(tree.model).toMatchObject({
      _id: '7e6250b0-e343-4c4f-8c00-4cffb78f8df6',
      name: 'Direzione',
      enabled: true,
      roleId: 'administrator',
      promoterId: '1e455cd0-59aa-0448-af68-b9c60d3ff346',
      promoterName: 'Stefano Vaghi',
      children: [],
    });

    expect(count).toBe(2);

    client.close();
  }, 600000);
});
