const dbConnector = require('../../utils/mongo-tests-cloud-data');
const dbConnectorSql = require('../../utils/postgres-tests');
const PracticeFeeService = require('.');
const PracticeService = require('../practice-srv');

describe('Utils', () => {
  let db;
  let client;
  let sql;

  beforeAll(async () => {
    const connection = await dbConnector();
    sql = await dbConnectorSql();
    db = connection.db;
    client = connection.client;
  });

  test('sync single practice, 12 months installments, 3 months advance', async () => {
    if (process.env.EDITION === 'tcw') {
      const practiceService = new PracticeService(db);
      const practiceFeeService = new PracticeFeeService(db, sql);

      const practice = await practiceService.getPracticeById('SUB30062084');

      const result = await practiceFeeService.addNewPractice(practice, 'tcw', true);

      expect(result).toHaveLength(238);
    }
  }, 600000);

  test('sync single practice unique premium', async () => {
    if (process.env.EDITION === 'tcw') {
      const practiceService = new PracticeService(db);
      const practiceFeeService = new PracticeFeeService(db, sql);

      const practice = await practiceService.getPracticeById('SUB9453568');

      const result = await practiceFeeService.addNewPractice(practice, 'tcw', true);

      expect(result).toHaveLength(1);
    }
  }, 600000);

  test('sync single practice quarterly premium', async () => {
    if (process.env.EDITION === 'tcw') {
      const practiceService = new PracticeService(db);
      const practiceFeeService = new PracticeFeeService(db, sql);

      const practice = await practiceService.getPracticeById('SUB9392104');

      const result = await practiceFeeService.addNewPractice(practice, 'tcw', true);

      expect(result).toHaveLength(13);
    }
  }, 600000);

  afterAll(() => {
    client.close();
  });
});
