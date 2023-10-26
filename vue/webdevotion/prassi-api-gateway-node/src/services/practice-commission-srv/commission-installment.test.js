const CommissionInstallment = require('./commission-installment');

describe('CommissionInstallment', () => {
  test('should have these properties', () => {
    const practiceFeeEntry = new CommissionInstallment({
      dossierId: 'DDDOSSIERID',
      practiceId: 'PRACTICEID',
      contractId: 'CCCONTRACTIDD',
      productId: 'PRODUCTTIDD',
      practiceType: 'subscription',
      productName: 'THISISAPRODUCTNANE',
      companyId: 'COMMPANYYYID',
      companyName: 'COMPANYNAME',
      effectDate: new Date(),
      termDate: new Date(),
      insurerId: 'INSURERIDDDD',
      premiumNet: 200000,
      premiumGross: 180000,
      optionId: 'A',
      createDate: new Date(),
      dueDate: new Date(),
      installment: 2,
      productivePeriodYear: 2018,
      productivePeriodMonth: 9,
      commissioningProductivePeriodYear: 2018,
      commissioningProductivePeriodMonth: 9,
      payin: 5000,
      margin: 10000,
      payout: 40000,
      advance: true,
      forecast: false,
      paidToNetwork: true,
      commissionType: 'subscription',
      installmentsPerYear: 2,
    });

    expect(practiceFeeEntry).toHaveProperty('_id');
    expect(practiceFeeEntry).toHaveProperty('dossierId');
    expect(practiceFeeEntry).toHaveProperty('practiceId');
    expect(practiceFeeEntry).toHaveProperty('contractId');
    expect(practiceFeeEntry).toHaveProperty('practiceType');
    expect(practiceFeeEntry).toHaveProperty('productId');
    expect(practiceFeeEntry).toHaveProperty('productName');
    expect(practiceFeeEntry).toHaveProperty('companyId');
    expect(practiceFeeEntry).toHaveProperty('companyName');
    expect(practiceFeeEntry).toHaveProperty('effectDate');
    expect(practiceFeeEntry).toHaveProperty('termDate');
    expect(practiceFeeEntry).toHaveProperty('insurerId');
    expect(practiceFeeEntry).toHaveProperty('premiumNet');
    expect(practiceFeeEntry).toHaveProperty('premiumGross');
    expect(practiceFeeEntry).toHaveProperty('optionId');
    expect(practiceFeeEntry).toHaveProperty('createDate');
    expect(practiceFeeEntry).toHaveProperty('installment');
    expect(practiceFeeEntry).toHaveProperty('productivePeriodYear');
    expect(practiceFeeEntry).toHaveProperty('productivePeriodMonth');
    expect(practiceFeeEntry).toHaveProperty('productivePeriod');
    expect(practiceFeeEntry).toHaveProperty('payin');
    expect(practiceFeeEntry).toHaveProperty('margin');
    expect(practiceFeeEntry).toHaveProperty('payout');
    expect(practiceFeeEntry).toHaveProperty('advance');
    expect(practiceFeeEntry).toHaveProperty('forecast');
    expect(practiceFeeEntry).toHaveProperty('paidToNetwork');
    expect(practiceFeeEntry).toHaveProperty('reminder');
    expect(practiceFeeEntry).toHaveProperty('paymentDate');
    expect(practiceFeeEntry).toHaveProperty('dueDate');
    expect(practiceFeeEntry).toHaveProperty('confirmed');
    expect(practiceFeeEntry).toHaveProperty('commissionType');
    expect(practiceFeeEntry).toHaveProperty('installmentsPerYear');
    expect(practiceFeeEntry).toHaveProperty('iv');
    expect(practiceFeeEntry.productivePeriod).toEqual(201809);
  });
});
