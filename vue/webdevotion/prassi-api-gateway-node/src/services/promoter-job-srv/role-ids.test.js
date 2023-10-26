// @ts-nocheck
const dbConnector = require('../../utils/mongo-tests');
const { seed: tcwSeed } = require('./seed/roles.tcw');
const { seed: sheltiaSeed } = require('./seed/roles.sheltia');
const roleRepository = require('./role-repository');
const { mapNetworkToAuthRole, translateRoleId, getRoleIds } = require('./role-ids');

describe('role ids tests', () => {
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

  it('maps network role to auth role', async () => {
    expect.assertions(2);

    const authRole = await mapNetworkToAuthRole(db, 'team-manager');

    expect(authRole.key).toBe(3);
    expect(authRole.value).toBe('Team Manager');
  }, 50000);

  it('translates network role', async () => {
    expect.assertions(1);

    const translation = await translateRoleId(db, 'team-manager');

    expect(translation).toBe('Team Manager');
  }, 50000);

  it('translates network role to Nessuno', async () => {
    expect.assertions(1);

    const translation = await translateRoleId(db, 'none');

    expect(translation).toBe('Nessuno');
  }, 50000);

  it('translates network role to Non esistente', async () => {
    expect.assertions(1);

    const translation = await translateRoleId(db, 'non-esiste');

    expect(translation).toBe('Non esistente');
  }, 50000);

  it('gets role list', async () => {
    expect.assertions(3);

    const roles = await getRoleIds(db);

    if (process.env.EDITION === 'tcw') {
      expect(roles).toHaveLength(10);
    } else {
      expect(roles).toHaveLength(13);
    }
    expect(roles[0]).toHaveProperty('_id');
    expect(roles[0]).toHaveProperty('authenticationId');
  }, 50000);

  afterAll(() => {
    client.close();
  });
});
