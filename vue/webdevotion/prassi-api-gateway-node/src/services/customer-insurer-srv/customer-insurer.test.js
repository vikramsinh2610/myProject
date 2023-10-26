const CustomerInsurer = require('./customer-insurer');

describe('CustomerInsurer', () => {
  test('should have these properties', () => {
    const customerInsurer = new CustomerInsurer({
      _id: 'ID',
      customerId: 'CustomerID',
      productivePeriodYear: 2018,
      productivePeriodMonth: 9,
      networkNodeId: 'NetworkNodeId',
      promoterId: 'PromoterID',
    });
    expect(customerInsurer).toHaveProperty('customerId');
    expect(customerInsurer).toHaveProperty('productivePeriodYear');
    expect(customerInsurer).toHaveProperty('productivePeriodMonth');
    expect(customerInsurer).toHaveProperty('networkNodeId');
    expect(customerInsurer).toHaveProperty('promoterId');
  });

  test('should reject not integer year month', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const testFunction = () => {
      // eslint-disable-next-line no-unused-vars
      const dossierInsurer = new CustomerInsurer({
        customerId: 'customerInsurer',
        productivePeriodYear: 'pippo',
        productivePeriodMonth: 'pluto',
        networkNodeId: 'NetworkNodeId',
        promoterId: 'PromoterID',
      });
    };

    expect(testFunction).toThrow(TypeError);
  });
});
