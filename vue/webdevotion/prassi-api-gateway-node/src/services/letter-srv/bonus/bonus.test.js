const Bonus = require('./bonus');

describe('Bonus', () => {
  test('should have these properties', () => {
    const bonus = new Bonus({
      amount: 1000,
      type: 'guaranteed',
      paymentTime: 'prepayment',
    });
    expect(bonus).toHaveProperty('amount');
    expect(bonus).toHaveProperty('type');
    expect(bonus).toHaveProperty('paymentTime');
  });

  test('should return it s JSON Schema', () => {
    expect(Bonus.getJSONSchema()).toMatchSnapshot();
  });
});
