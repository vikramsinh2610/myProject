const PayoutPartition = require('./payout-partition');

describe('PayoutPartition', () => {
  test('should have these properties', () => {
    const payoutPartition = new PayoutPartition({
      promoterId: 'promoterId',
      amount: 10000,
      percentage: 5000,
      productionType: 'direct',
    });
    expect(payoutPartition).toHaveProperty('promoterId');
    expect(payoutPartition).toHaveProperty('amount');
    expect(payoutPartition).toHaveProperty('percentage');
  });
});
