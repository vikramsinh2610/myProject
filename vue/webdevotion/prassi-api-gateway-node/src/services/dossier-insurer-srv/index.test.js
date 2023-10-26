const dbConnector = require('../../utils/mongo-tests');
const DossierInsurerSrv = require('.');
const { parse } = require('../../utils/productive-period-helper');

describe('Get Dossier Insurer Tests', () => {
  it('getDossierInsurer should get record of exact period', async () => {
    expect.assertions(2);

    const { db, client } = await dbConnector();
    const dossierInsurerSrv = new DossierInsurerSrv(db);
    const firstPeriodYear = new Date().getFullYear() - 1;
    const firstPeriodMonth = new Date().getMonth() + 1;


    await db.collection('dossier-insurer').insertOne({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        firstPeriodYear,
        firstPeriodMonth,
      )}`,
      dossierId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: firstPeriodYear,
      productivePeriodMonth: firstPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    const dossier = await dossierInsurerSrv.getDossierInsurer(
      'fff0bbb1-902a-ed47-8f80-a984013e439a',
      firstPeriodYear,
      firstPeriodMonth,
    );

    const count = await db.collection('dossier-insurer').find({}).count();

    expect(dossier).toMatchObject({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        firstPeriodYear,
        firstPeriodMonth,
      )}`,
      dossierId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: firstPeriodYear,
      productivePeriodMonth: firstPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    expect(count).toBe(1);

    client.close();
  }, 600000);

  it('getLastDossierInsurer should get record of exact period', async () => {
    expect.assertions(2);

    const { db, client } = await dbConnector();
    const dossierInsurerSrv = new DossierInsurerSrv(db);
    const firstPeriodYear = new Date().getFullYear() - 1;
    const firstPeriodMonth = new Date().getMonth() + 1;


    await db.collection('dossier-insurer').insertOne({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
          firstPeriodYear,
          firstPeriodMonth,
      )}`,
      dossierId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: firstPeriodYear,
      productivePeriodMonth: firstPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    const dossier = await dossierInsurerSrv.getLastDossierInsurer(
        'fff0bbb1-902a-ed47-8f80-a984013e439a',
    );

    const count = await db.collection('dossier-insurer').find({}).count();

    expect(dossier).toMatchObject({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
          firstPeriodYear,
          firstPeriodMonth,
      )}`,
      dossierId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: firstPeriodYear,
      productivePeriodMonth: firstPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    expect(count).toBe(1);

    client.close();
  }, 600000);

  it('getDossierInsurer should insert record of today period', async () => {
    expect.assertions(3);

    const { db, client } = await dbConnector();
    const dossierInsurerSrv = new DossierInsurerSrv(db);
    const firstPeriodYear = new Date().getFullYear() - 1;
    const firstPeriodMonth = new Date().getMonth() + 1;
    const todayPeriodYear = new Date().getFullYear();
    const todayPeriodMonth = new Date().getMonth() + 1;

    await db.collection('dossier-insurer').insertOne({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        firstPeriodYear,
        firstPeriodMonth,
      )}`,
      dossierId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: firstPeriodYear,
      productivePeriodMonth: firstPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    const dossier = await dossierInsurerSrv.getDossierInsurer(
      'fff0bbb1-902a-ed47-8f80-a984013e439a',
      todayPeriodYear,
      todayPeriodMonth,
    );

    const dossierInserted = await db.collection('dossier-insurer').findOne({
      dossierId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      productivePeriodYear: todayPeriodYear,
      productivePeriodMonth: todayPeriodMonth,
    });

    const count = await db.collection('dossier-insurer').find({}).count();

    expect(dossier).toMatchObject({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        todayPeriodYear,
        todayPeriodMonth,
      )}`,
      dossierId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: todayPeriodYear,
      productivePeriodMonth: todayPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    expect(dossierInserted).toMatchObject({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        todayPeriodYear,
        todayPeriodMonth,
      )}`,
      dossierId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: todayPeriodYear,
      productivePeriodMonth: todayPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    expect(count).toBe(2);

    client.close();
  }, 600000);

  it('getDossierInsurer should get record of next period', async () => {
    expect.assertions(2);

    const { db, client } = await dbConnector();
    const dossierInsurerSrv = new DossierInsurerSrv(db);
    const firstPeriodYear = new Date().getFullYear() - 1;
    const firstPeriodMonth = new Date().getMonth() + 1;
    const nextPeriodYear = new Date().getFullYear() + 1;
    const nextPeriodMonth = new Date().getMonth() + 1;

    await db.collection('dossier-insurer').insertOne({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        firstPeriodYear,
        firstPeriodMonth,
      )}`,
      dossierId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: firstPeriodYear,
      productivePeriodMonth: firstPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    const dossier = await dossierInsurerSrv.getDossierInsurer(
      'fff0bbb1-902a-ed47-8f80-a984013e439a',
      nextPeriodYear,
      nextPeriodMonth,
    );

    const count = await db.collection('dossier-insurer').find({}).count();

    expect(dossier).toMatchObject({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        nextPeriodYear,
        nextPeriodMonth,
      )}`,
      dossierId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: nextPeriodYear,
      productivePeriodMonth: nextPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    expect(count).toBe(1);

    client.close();
  }, 600000);

  it('getDossierInsurer should get record of before period', async () => {
    expect.assertions(2);

    const { db, client } = await dbConnector();
    const dossierInsurerSrv = new DossierInsurerSrv(db);
    const firstPeriodYear = new Date().getFullYear() - 1;
    const firstPeriodMonth = new Date().getMonth() + 1;
    const beforePeriodYear = new Date().getFullYear() - 2;
    const beforePeriodMonth = new Date().getMonth() + 1;

    await db.collection('dossier-insurer').insertOne({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        firstPeriodYear,
        firstPeriodMonth,
      )}`,
      dossierId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: firstPeriodYear,
      productivePeriodMonth: firstPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    const dossier = await dossierInsurerSrv.getDossierInsurer(
      'fff0bbb1-902a-ed47-8f80-a984013e439a',
      beforePeriodYear,
      beforePeriodMonth,
    );

    const count = await db.collection('dossier-insurer').find({}).count();

    expect(dossier).toMatchObject({
      _id: `fff0bbb1-902a-ed47-8f80-a984013e439a-${parse(
        firstPeriodYear,
        firstPeriodMonth,
      )}`,
      dossierId: 'fff0bbb1-902a-ed47-8f80-a984013e439a',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: firstPeriodYear,
      productivePeriodMonth: firstPeriodMonth,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    expect(count).toBe(1);

    client.close();
  }, 600000);
});
