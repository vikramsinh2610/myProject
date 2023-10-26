const Option = require('./option');

describe('Option', () => {
  test('should have these properties', () => {
    const option = new Option({
      _id: 'id',
      fromYear: 0,
      toYear: 1,
      fromPremiumAmount: 0,
      toPremiumAmount: 1000,
      fixedAmount: 40,
      percentage: 5,
      retrocessionFee: 80,
    });
    expect(option).toHaveProperty('_id');
    expect(option).toHaveProperty('fromYear');
    expect(option).toHaveProperty('toYear');
    expect(option).toHaveProperty('fromPremiumAmount');
    expect(option).toHaveProperty('toPremiumAmount');
    expect(option).toHaveProperty('fixedAmount');
    expect(option).toHaveProperty('percentage');
    expect(option).toHaveProperty('retrocessionFee');
  });
});
