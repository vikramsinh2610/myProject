// @ts-nocheck
const dbConnector = require('../../utils/mongo-tests');
const { seed: tcwSeed } = require('./seed/roles.tcw');
const { seed: sheltiaSeed } = require('./seed/roles.sheltia');
const roleRepository = require('./role-repository');

describe('roles tests', () => {
  let db;
  let client;

  beforeAll(async () => {
    const connection = await dbConnector();
    db = connection.db;
    client = connection.client;

    // eslint-disable-next-line max-len
    await (process.env.EDITION === 'tcw'
      ? roleRepository.insertSeed(db, tcwSeed)
      : roleRepository.insertSeed(db, sheltiaSeed));
  });

  it('gets all roles', async () => {
    expect.assertions(1);

    const roles = await roleRepository.getList(db);

    if (process.env.EDITION === 'tcw') {
      expect(roles).toHaveLength(10);
    } else {
      expect(roles).toHaveLength(13);
    }
  }, 50000);

  it('gets system role', async () => {
    expect.assertions(1);

    const role = await roleRepository.getOne(db, 'system');

    expect(role.authenticationId).toBe(1000);
  }, 50000);

  afterAll(() => {
    client.close();
  });
});
