const ProductConfiguration = require('./product-configuration');

describe('Config', () => {
  test('should have properties', () => {
    const config = new ProductConfiguration({
      productName: 'Pippo',
      productCode: 'Pluto',
      premiumType: 'net',
      advance: true,
      companyAdvance: true,
      monthsOnSubscription: 1,
      options: [{}, {}],
    });
    expect(config).toHaveProperty('_id');
    expect(config).toHaveProperty('advance');
    expect(config).toHaveProperty('companyAdvance');
    expect(config).toHaveProperty('options');
    expect(config).toHaveProperty('productName');
    expect(config).toHaveProperty('productCode');
    expect(config).toHaveProperty('monthsOnSubscription');
  });
});
