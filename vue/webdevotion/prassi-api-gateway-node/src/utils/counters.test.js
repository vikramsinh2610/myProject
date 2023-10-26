const dbConnector = require('./mongo-tests');
const { next, preview } = require('./counters');

// eslint-disable-next-line jest/no-disabled-tests
describe('Counters', () => {
  test('should init and return new counter', async () => {
    const { db, client } = await dbConnector();
    const count = await next(db, 'pippo');
    expect(count).toBe(1);
    client.close();
  });

  test('should increment existing counter', async () => {
    const { db, client } = await dbConnector();
    const count1 = await next(db, 'pluto');
    expect(count1).toBe(1);
    const preview1 = await preview(db, 'pluto');
    expect(preview1).toBe(2);
    const count2 = await next(db, 'pluto');
    expect(count2).toBe(2);

    const preview2 = await preview(db, 'pluto');
    expect(preview2).toBe(3);
    const count3= await next(db, 'pluto');
    expect(count3).toBe(3);
    client.close();
  });
});

// eslint-disable-next-line jest/no-export
module.exports = { next };
