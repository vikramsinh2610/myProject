const Payment = require('./payment');

describe('Payment', () => {
  test('should have these properties', () => {
    const payment = new Payment({
      _id: 'ID',
      type: 'subscription',
      contractId: 'ContractId',
      premiumNet: 1234,
      premiumGross: 2345,
      installment: 2,
      payin: 5500,
      installmentDate: new Date(),
      productivePeriodYear: 2018,
      productivePeriodMonth: 8,
    });
    expect(payment).toHaveProperty('_id');
    expect(payment).toHaveProperty('contractId');
    expect(payment).toHaveProperty('type');
    expect(payment).toHaveProperty('premiumNet');
    expect(payment).toHaveProperty('premiumGross');
    expect(payment).toHaveProperty('installment');
    expect(payment).toHaveProperty('payin');
    expect(payment).toHaveProperty('installmentDate');
    expect(payment).toHaveProperty('productivePeriodYear');
    expect(payment).toHaveProperty('productivePeriodMonth');
    expect(payment).toHaveProperty('ok');
    expect(payment).toHaveProperty('calculatedPayin');
  });

  test('should have JSON Schema', () => {
    expect(Payment.getJSONSchema()).toMatchSnapshot();
  });
});
