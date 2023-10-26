const Practice = require('./practice');

describe('Practice', () => {
  test('should have these properties', () => {
    const practice = new Practice({
      dossierId: 'AJCM2134r2',
      practiceId: 'AJCM2134r2',
      productId: 'AHJDKCSX234',
      type: 'subscription',
      effectDate: new Date(Date.now()),
      approvalDate: new Date(Date.now()),
      termDate: new Date(Date.now()),
      lastModifiedDate: new Date(Date.now()),
      createdDate: new Date(Date.now()),
      effectProductivePeriodYear: 2018,
      effectProductivePeriodMonth: 5,
      termProductivePeriodYear: 2018,
      termProductivePeriodMonth: 5,
      insurerId: 'ZZAA2134',
      premiumNet: 1000,
      premiumGross: 2000,
      optionId: 'A',
      contractId: 'ContractId',
      productName: 'Sample Product',
      companyId: 'ZURICH',
      companyName: 'Zurich',
      installmentsPerYear: 12,
      emitDate: new Date('2020-07-01T00:00:00.000+00:00'),
      status: 4,
      statusName: 'In Approvazione',
      insuredName: 'Contraente',
      adequacy: 0,
      praticeType: '',
      postForce: 0,
      customerId: 'pippo',
      paymentMode: 0,
      iban: '',
      loading: 0,
      recurringPremium:  0,
      uniquePremium:  0,
      amountPaid: 0,
      years: 1,
      isPayable: false,
      customer: [],
    });

    expect(practice).toHaveProperty('dossierId');
    expect(practice).toHaveProperty('practiceId');
    expect(practice).toHaveProperty('contractId');
    expect(practice).toHaveProperty('productId');
    expect(practice).toHaveProperty('productName');
    expect(practice).toHaveProperty('companyId');
    expect(practice).toHaveProperty('companyName');
    expect(practice).toHaveProperty('effectDate');
    expect(practice).toHaveProperty('effectProductivePeriodYear');
    expect(practice).toHaveProperty('effectProductivePeriodMonth');
    expect(practice).toHaveProperty('termDate');
    expect(practice).toHaveProperty('insurerId');
    expect(practice).toHaveProperty('premiumNet');
    expect(practice).toHaveProperty('premiumGross');
    expect(practice).toHaveProperty('optionId');
    expect(practice).toHaveProperty('commissionSacrifice');
    expect(practice).toHaveProperty('installmentsPerYear');
    expect(practice).toHaveProperty('iv');
  });
});
