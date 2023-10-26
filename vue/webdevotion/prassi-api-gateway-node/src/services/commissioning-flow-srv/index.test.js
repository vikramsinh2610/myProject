const dbConnector = require('../../utils/mongo-tests-cloud-data');
const dbConnectorSql = require('../../utils/postgres-tests');
const CommissioningFlowService = require('.');

describe('Commissioning Flow Tests', () => {
  let db;
  let client;
  let sql;

  beforeAll(async () => {
    const connection = await dbConnector();
    db = connection.db;
    client = connection.client;
    sql = await dbConnectorSql();
  });

  it('tests commissioning rollback close and close again', async () => {
    const commissioningFlowService = new CommissioningFlowService(db, process.env.EDITION, sql, sql);

    const commissioningStart = await db
      .collection('commissioning')
      .find({ productivePeriodYear: 2020, productivePeriodMonth: 2 })
      .toArray();

    expect(commissioningStart[0].status).toBe('closed');

    const processingStateStartRollback = await commissioningFlowService
      .startRollbackClose('202002')
      .then((state) => state);

    expect(processingStateStartRollback.status).toBe('rollback-close-started');

    const processingStateRollback = await commissioningFlowService.rollbackClose('202002');

    expect(processingStateRollback.status).toBe('confirmed');

    const processingStateClose = await commissioningFlowService.close('202002').then((state) => state);

    expect(processingStateClose.status).toBe('closed');

    const commissioningEnd = await db
      .collection('commissioning')
      .find({ productivePeriodYear: 2020, productivePeriodMonth: 2 })
      .toArray();

    if (process.env.EDITION === 'sheltia') {
      const resultPromoter = commissioningEnd[0].results.find(
        (el) => el.promoterId === '64a8bd10-9463-5744-bc6a-28826b2553e0',
      );

      const notes = await db
        .collection('accounting')
        .find({
          promoterId: '64a8bd10-9463-5744-bc6a-28826b2553e0',
          productivePeriodYear: 2020,
          productivePeriodMonth: 2,
          origin: 'management-fee',
          settled: false,
        })
        .toArray();

      expect(resultPromoter.details.managementFee).toBe(10816);
      expect(notes).toHaveLength(1);
      expect(notes[0].amount).toBe(10816);
    } else {
      const resultPromoter = commissioningEnd[0].results.find(
        (el) => el.promoterId === '7344146b-1aa0-8844-b236-11b179d1518e',
      );

      const notes = await db
        .collection('accounting')
        .find({
          promoterId: '7344146b-1aa0-8844-b236-11b179d1518e',
          productivePeriodYear: 2020,
          productivePeriodMonth: 2,
          origin: 'management-fee',
          settled: false,
        })
        .toArray();

      expect(resultPromoter.details.managementFee).toBe(42791);
      expect(notes).toHaveLength(1);
      expect(notes[0].amount).toBe(42791);
    }
  }, 600000000);

  // eslint-disable-next-line jest/no-commented-out-tests
  // it('tests commissioning confirm 15% advance', async () => {
  //   const commissioningFlowService = new CommissioningFlowService(db, process.env.EDITION);
  //
  //   const processingStateProcess = await commissioningFlowService.process('202011');
  //
  //   const processingStateConfirmed = await commissioningFlowService.confirm('202011', processingStateProcess);
  //
  //   expect(processingStateConfirmed.status).toBe('confirmed');
  //
  //   const commissioningEnd = await db
  //     .collection('commissioning')
  //     .find({ productivePeriodYear: 2020, productivePeriodMonth: 2 })
  //     .toArray();
  //
  //   if (process.env.EDITION === 'sheltia') {
  //     const resultPromoter = commissioningEnd[0].results.find(
  //       (el) => el.promoterId === '64a8bd10-9463-5744-bc6a-28826b2553e0',
  //     );
  //
  //     const notes = await db
  //       .collection('accounting')
  //       .find({
  //         promoterId: '64a8bd10-9463-5744-bc6a-28826b2553e0',
  //         productivePeriodYear: 2020,
  //         productivePeriodMonth: 2,
  //         origin: 'management-fee',
  //         settled: false,
  //       })
  //       .toArray();
  //
  //     expect(resultPromoter.details.managementFee).toBe(10816);
  //     expect(notes).toHaveLength(1);
  //     expect(notes[0].amount).toBe(10816);
  //   } else {
  //     const resultPromoter = commissioningEnd[0].results.find(
  //       (el) => el.promoterId === '7344146b-1aa0-8844-b236-11b179d1518e',
  //     );
  //
  //     const notes = await db
  //       .collection('accounting')
  //       .find({
  //         promoterId: '7344146b-1aa0-8844-b236-11b179d1518e',
  //         productivePeriodYear: 2020,
  //         productivePeriodMonth: 2,
  //         origin: 'management-fee',
  //         settled: false,
  //       })
  //       .toArray();
  //
  //     expect(resultPromoter.details.managementFee).toBe(42791);
  //     expect(notes).toHaveLength(1);
  //     expect(notes[0].amount).toBe(42791);
  //   }
  // }, 600000000);

  afterAll(() => {
    client.close();
  });
});
