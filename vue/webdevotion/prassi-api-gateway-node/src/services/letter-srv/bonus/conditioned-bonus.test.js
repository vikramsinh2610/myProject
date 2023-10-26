const ConditionedBonus = require('./conditioned-bonus');

describe('ConditionedBonus', () => {
  test('should have these properties', () => {
    const bonus = new ConditionedBonus({
      amount: 1000,
      paymentTime: 'prepayment',
      conditions: [{}, {}],
    });
    expect(bonus).toHaveProperty('amount');
    expect(bonus).toHaveProperty('paymentTime');
    expect(bonus).toHaveProperty('conditions');
    expect(bonus).toHaveProperty('productivePeriodPaymentDelay');
  });

  test('should return it s JSON Schema', () => {
    expect(ConditionedBonus.getJSONSchema()).toMatchSnapshot();
  });
});
