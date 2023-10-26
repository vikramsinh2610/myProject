const Product = require('./product');

describe('Product', () => {
  test('should have these properties', () => {
    const product = new Product({
      _id: 'ProductID',
      name: 'Zurich',
      code: '01',
    });
    expect(product).toHaveProperty('_id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('code');
  });
});
