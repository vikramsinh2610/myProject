const Acquittance = require('./acquittance');

describe('Acquittance', () => {
  test('should have these properties', () => {
    const acquittance = new Acquittance({
      companyId: 'CompanyId',
      companyName: 'Zurich',
      documentId: 'DocumentId',
      didCreatedDate: new Date(Date.now()),
      payments: [],
    });
    expect(acquittance).toHaveProperty('_id');
    expect(acquittance).toHaveProperty('didCreatedDate');
    expect(acquittance).toHaveProperty('didConfirmedDate');
    expect(acquittance).toHaveProperty('companyId');
    expect(acquittance).toHaveProperty('companyName');
    expect(acquittance).toHaveProperty('documentId');
    expect(acquittance).toHaveProperty('payments');
    expect(acquittance).toHaveProperty('status');
  });

  test('should have JSON Schema', () => {
    expect(Acquittance.getJSONSchema()).toMatchSnapshot();
  });
});
