const Job = require('./job');

describe('Job', () => {
  test('should have these properties', () => {
    const job = new Job({
      roleId: 'PROMOTER',
    });
    expect(job).toHaveProperty('roleId');
  });

  test('should return its JSON Schema', () => {
    expect(Job.getJSONSchema()).toMatchSnapshot();
  });
});
