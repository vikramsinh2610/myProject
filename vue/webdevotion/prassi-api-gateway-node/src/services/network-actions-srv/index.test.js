const dbConnector = require('../../utils/mongo-tests-cloud-data');
const dbConnectorSql = require('../../utils/postgres-tests');
const NetworkActionsService = require('.');

describe('Network Actions Tests', () => {
  let db;
  let client;
  let sql;

  beforeAll(async () => {
    const connection = await dbConnector();
    db = connection.db;
    client = connection.client;
    sql = await dbConnectorSql();
  });

  // eslint-disable-next-line jest/no-commented-out-tests
  // it('tests save network node', async () => {
  //   if (process.env.EDITION === 'sheltia') {
  //     expect.assertions(11);
  //     const networkActionsService = new NetworkActionsService(db, sql);
  //
  //     await db.collection('dossier-insurer').updateOne(
  //       { _id: '90014006063-202004' },
  //       {
  //         $set: {
  //           dossierId: '90014006063',
  //           // networkNodeId: '5ab04953-fe33-a949-87fc-43adf0220aa2',
  //           networkNodeId: '54ea16af-68ac-6645-bb7a-4a7a339e6723',
  //           productivePeriodMonth: 4,
  //           productivePeriodYear: 2020,
  //           promoterId: '877db0d1-d099-7f4f-8267-83e64efd7353',
  //         },
  //       },
  //     );
  //
  //     await db.collection('customer-insurer').updateOne(
  //       { _id: '643d9f79-31c7-0541-bd9f-ab1401245336-202005' },
  //       {
  //         $set: {
  //           customerId: '643d9f79-31c7-0541-bd9f-ab1401245336',
  //           networkNodeId: '54ea16af-68ac-6645-bb7a-4a7a339e6723',
  //           productivePeriodMonth: 5,
  //           productivePeriodYear: 2020,
  //           promoterId: '877db0d1-d099-7f4f-8267-83e64efd7353',
  //         },
  //       },
  //     );
  //
  //     const bodySetup = {
  //       children: [],
  //       enabled: true,
  //       name: '15',
  //       promoterId: '877db0d1-d099-7f4f-8267-83e64efd7353',
  //       promoterName: 'Anna Rita Pinna',
  //       roleId: 'promoter',
  //       _id: '54ea16af-68ac-6645-bb7a-4a7a339e6723',
  //     };
  //
  //     await networkActionsService.saveNode('54ea16af-68ac-6645-bb7a-4a7a339e6723', bodySetup, 2020, 5);
  //
  //     await db
  //       .collection('dossier-insurer')
  //       .deleteOne({ dossierId: '90014006063', productivePeriodMonth: 5, productivePeriodYear: 2020 });
  //
  //     const body = {
  //       children: [],
  //       enabled: true,
  //       name: '15',
  //       promoterId: '5ba917b8-1b6f-414e-b882-bbec5a7f75b7',
  //       promoterName: 'Sara Gaddari',
  //       roleId: 'promoter',
  //       _id: '54ea16af-68ac-6645-bb7a-4a7a339e6723',
  //     };
  //
  // eslint-disable-next-line max-len
  //     const dossierInsurerBefore = await db.collection('dossier-insurer').find({ dossierId: '90014006063' }).toArray();
  //
  //     const customerInsurerBefore = await db
  //       .collection('customer-insurer')
  //       .find({ customerId: '643d9f79-31c7-0541-bd9f-ab1401245336' })
  //       .toArray();
  //
  //     expect(dossierInsurerBefore[2]).toBeDefined();
  //     expect(dossierInsurerBefore).toHaveLength(4);
  //     expect(dossierInsurerBefore[2].promoterId).toBe('877db0d1-d099-7f4f-8267-83e64efd7353');
  //
  //     expect(customerInsurerBefore[6]).toBeDefined();
  //     expect(customerInsurerBefore[6].promoterId).toBe('877db0d1-d099-7f4f-8267-83e64efd7353');
  //
  //     // eslint-disable-next-line no-unused-vars
  //     const children = await networkActionsService.saveNode('54ea16af-68ac-6645-bb7a-4a7a339e6723', body, 2020, 5);
  //
  // eslint-disable-next-line max-len
  //     const dossierInsurerAfter = await db.collection('dossier-insurer').find({ dossierId: '90014006063' }).toArray();
  //
  //     const customerInsurerAfter = await db
  //       .collection('customer-insurer')
  //       .find({ customerId: '643d9f79-31c7-0541-bd9f-ab1401245336' })
  //       .toArray();
  //
  //     const networkNode = await sql
  //       .select()
  //       .from('network_node')
  //       .where('uuid', '54ea16af-68ac-6645-bb7a-4a7a339e6723')
  //       .andWhere('productivePeriodMonth', 5)
  //       .andWhere('productivePeriodYear', 2020)
  //       .then((results) => results);
  //
  //     // @ts-ignore
  //     expect(networkNode[0].name).toBe('15');
  //
  //     expect(customerInsurerAfter[6]).toBeDefined();
  //     expect(customerInsurerAfter[6].promoterId).toBe('877db0d1-d099-7f4f-8267-83e64efd7353');
  //
  //     expect(dossierInsurerAfter[3]).toBeDefined();
  //     expect(dossierInsurerAfter).toHaveLength(4);
  //     expect(dossierInsurerAfter[3].promoterId).toBe('5ba917b8-1b6f-414e-b882-bbec5a7f75b7');
  //   } else {
  //     expect.assertions(1);
  //     expect(true).toBe(true);
  //   }
  // }, 6000000);

  it('tests create network node and verify role', async () => {
    if (process.env.EDITION === 'sheltia') {
      expect.assertions(2);
      const networkActionsService = new NetworkActionsService(db, sql);

      await db.collection('promoter-job').deleteOne({
        promoterId: '877db0d1-d099-7f4f-8267-83e64efd7353',
        fromProductivePeriodMonth: 5,
        fromProductivePeriodYear: 2020,
      });

      const bodySetup = {
        children: [],
        enabled: true,
        name: '15',
        promoterId: '877db0d1-d099-7f4f-8267-83e64efd7353',
        promoterName: 'Anna Rita Pinna',
        roleId: 'promoter',
        _id: '54ea16af-68ac-6645-bb7a-4a7a339e6723',
      };

      await networkActionsService.createNode('54ea16af-68ac-6645-bb7a-4a7a339e6723', bodySetup, 2020, 5);

      const promoterJob = await db
        .collection('promoter-job')
        .find({
          promoterId: '877db0d1-d099-7f4f-8267-83e64efd7353',
          fromProductivePeriodMonth: 5,
          fromProductivePeriodYear: 2020,
        })
        .toArray();

      const networkNode = await sql
        .select()
        .from('network_node')
        .where('uuid', '54ea16af-68ac-6645-bb7a-4a7a339e6723')
        .andWhere('productivePeriodMonth', 5)
        .andWhere('productivePeriodYear', 2020)
        .then((results) => results);

      // @ts-ignore
      expect(networkNode[0].name).toBe('15');

      expect(promoterJob[0].roleId).toBe('promoter');
    } else {
      expect.assertions(1);
      expect(true).toBe(true);
    }
  }, 6000000);

  // eslint-disable-next-line jest/no-commented-out-tests
  // it('tests move node customers in network', async () => {
  //   if (process.env.EDITION === 'sheltia') {
  //     expect.assertions(10);
  //     const networkActionsService = new NetworkActionsService(db, sql);
  //
  //     await db.collection('dossier-insurer').updateOne(
  //       { _id: '90014006063-202004' },
  //       {
  //         $set: {
  //           dossierId: '90014006063',
  //           // networkNodeId: '5ab04953-fe33-a949-87fc-43adf0220aa2',
  //           networkNodeId: '54ea16af-68ac-6645-bb7a-4a7a339e6723',
  //           productivePeriodMonth: 4,
  //           productivePeriodYear: 2020,
  //           promoterId: '877db0d1-d099-7f4f-8267-83e64efd7353',
  //         },
  //       },
  //     );
  //
  //     await db.collection('customer-insurer').updateOne(
  //       { _id: '643d9f79-31c7-0541-bd9f-ab1401245336-202005' },
  //       {
  //         $set: {
  //           customerId: '643d9f79-31c7-0541-bd9f-ab1401245336',
  //           networkNodeId: '54ea16af-68ac-6645-bb7a-4a7a339e6723',
  //           productivePeriodMonth: 5,
  //           productivePeriodYear: 2020,
  //           promoterId: '877db0d1-d099-7f4f-8267-83e64efd7353',
  //         },
  //       },
  //     );
  //
  //     const bodySetup = {
  //       children: [],
  //       enabled: true,
  //       name: '15',
  //       promoterId: '877db0d1-d099-7f4f-8267-83e64efd7353',
  //       promoterName: 'Anna Rita Pinna',
  //       roleId: 'promoter',
  //       _id: '54ea16af-68ac-6645-bb7a-4a7a339e6723',
  //     };
  //
  //     const bodySetup2 = {
  //       children: [],
  //       enabled: true,
  //       name: '13',
  //       promoterId: '5ba917b8-1b6f-414e-b882-bbec5a7f75b7',
  //       promoterName: 'Sara Gaddari',
  //       roleId: 'promoter',
  //       _id: 'b310be3e-4267-144f-aa09-09e9fd01a41f',
  //     };
  //
  //     await networkActionsService.saveNode('54ea16af-68ac-6645-bb7a-4a7a339e6723', bodySetup, 2020, 5);
  //     await networkActionsService.saveNode('b310be3e-4267-144f-aa09-09e9fd01a41f', bodySetup2, 2020, 5);
  //
  //     await db
  //       .collection('dossier-insurer')
  //       .deleteOne({ dossierId: '90014006063', productivePeriodMonth: 5, productivePeriodYear: 2020 });
  //
  // eslint-disable-next-line max-len
  //     const dossierInsurerBefore = await db.collection('dossier-insurer').find({ dossierId: '90014006063' }).toArray();
  //
  //     const customerInsurerBefore = await db
  //       .collection('customer-insurer')
  //       .find({ customerId: '643d9f79-31c7-0541-bd9f-ab1401245336' })
  //       .toArray();
  //
  //     expect(dossierInsurerBefore[2]).toBeDefined();
  //     expect(dossierInsurerBefore).toHaveLength(4);
  //     expect(dossierInsurerBefore[2].promoterId).toBe('877db0d1-d099-7f4f-8267-83e64efd7353');
  //
  //     expect(customerInsurerBefore[6]).toBeDefined();
  //     expect(customerInsurerBefore[6].promoterId).toBe('877db0d1-d099-7f4f-8267-83e64efd7353');
  //
  //     // eslint-disable-next-line no-unused-vars
  //     const children = await networkActionsService.moveNodeCustomer(
  //       '54ea16af-68ac-6645-bb7a-4a7a339e6723',
  //       'b310be3e-4267-144f-aa09-09e9fd01a41f',
  //       2020,
  //       5,
  //     );
  //
  // eslint-disable-next-line max-len
  //     const dossierInsurerAfter = await db.collection('dossier-insurer').find({ dossierId: '90014006063' }).toArray();
  //
  //     const customerInsurerAfter = await db
  //       .collection('customer-insurer')
  //       .find({ customerId: '643d9f79-31c7-0541-bd9f-ab1401245336' })
  //       .toArray();
  //
  //     expect(customerInsurerAfter[6]).toBeDefined();
  //     expect(customerInsurerAfter[6].promoterId).toBe('877db0d1-d099-7f4f-8267-83e64efd7353');
  //
  //     expect(dossierInsurerAfter[3]).toBeDefined();
  //     expect(dossierInsurerAfter).toHaveLength(4);
  //     expect(dossierInsurerAfter[3].promoterId).toBe('5ba917b8-1b6f-414e-b882-bbec5a7f75b7');
  //   } else {
  //     expect.assertions(1);
  //     expect(true).toBe(true);
  //   }
  // }, 6000000);

  afterAll(() => {
    client.close();
  });
});
