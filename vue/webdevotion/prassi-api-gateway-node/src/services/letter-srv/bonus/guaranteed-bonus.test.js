const GuaranteedBonus = require('./guaranteed-bonus');

describe('GuaranteedBonus', () => {
  test('should have these properties', () => {
    const bonus = new GuaranteedBonus({
      amount: 1000,
      paymentTime: 'prepayment',
      absorbability: {
        directProductionPercentage: 0,
        indirectProductionPercentage: 100,
      },
    });
    expect(bonus).toHaveProperty('amount');
    expect(bonus).toHaveProperty('paymentTime');
    expect(bonus.absorbability).toHaveProperty('directProductionPercentage');
    expect(bonus.absorbability).toHaveProperty('indirectProductionPercentage');
  });

  test('should return it s JSON Schema', () => {
    expect(GuaranteedBonus.getJSONSchema()).toMatchSnapshot();
  });
});
