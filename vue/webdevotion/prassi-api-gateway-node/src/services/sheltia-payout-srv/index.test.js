const { calculatePayout } = require('.');

describe('Sheltia Payout Service', () => {
  test('should calculate payout using provided configuration', () => {
    expect(calculatePayout()).toEqual(0);
  });
});
