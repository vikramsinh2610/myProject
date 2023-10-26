const Company = require('./company');

describe('Company', () => {
  test('should have these properties', () => {
    const company = new Company({
      _id: 'CompanyID',
      name: 'Zurich',
      code: '01',
    });
    expect(company).toHaveProperty('_id');
    expect(company).toHaveProperty('name');
    expect(company).toHaveProperty('code');
  });
});
