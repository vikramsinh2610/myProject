const CommissioningState = require('./commissioning-state');

describe('CommissioningState', () => {
  test('should have these properties', () => {
    const commissioningState = new CommissioningState({
      productivePeriodYear: 2018,
      productivePeriodMonth: 8,
    });
    expect(commissioningState).toHaveProperty('_id');
    expect(commissioningState).toHaveProperty('productivePeriodYear');
    expect(commissioningState).toHaveProperty('productivePeriodMonth');
    expect(commissioningState).toHaveProperty('status');
    expect(commissioningState).toHaveProperty('installments');
    expect(commissioningState).toHaveProperty('didOpenedDate');
    expect(commissioningState).toHaveProperty('didConfirmedDate');
    expect(commissioningState).toHaveProperty('didClosedDate');
  });

  test('should init empty _id', () => {
    const commissioningState = new CommissioningState({
      productivePeriodYear: 2018,
      productivePeriodMonth: 7,
    });
    expect(commissioningState._id).toEqual('201807');
  });
});
