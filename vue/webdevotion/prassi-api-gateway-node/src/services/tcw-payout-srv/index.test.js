const { calculatePayout } = require('.');

describe('Tcw Payout Service', () => {
  test('should calculate payout using provided configuration', () => {
    const payin = 100;

    const productConfig = {
      _id: 'id',
      premiumType: 'net',
      advance: true,
      companyAdvance: false,
      productName: 'Pippo',
      productCode: 'Pluto',
      installmentsPerYear: 3,
      monthsOnSubscription: 3,
      subscriptionYears: 1,
      surveyTypePerson: 'pippo',
      surveyTypeCompany: 'pippo',
      adjustedAdvance: [],
      adjustedBrackets: [],
      promoter100: false,
      options: [
        {
          _id: 'id',
          fromYear: 0,
          toYear: 1,
          fromPremiumAmount: 0,
          toPremiumAmount: 10000,
          fixedAmount: 75,
          percentage: 500,
          retrocessionFee: 8000,
        },
      ],
    };

    expect(calculatePayout(500, 550, 'id', 1, payin, productConfig)).toEqual(80);
  });

  test('should calculate payout using provided configuration irpef style', () => {
    const payin = 150;

    const productConfig = {
      _id: 'id',
      premiumType: 'net',
      advance: true,
      companyAdvance: false,
      productName: 'Pippo',
      productCode: 'Pluto',
      installmentsPerYear: 3,
      monthsOnSubscription: 3,
      subscriptionYears: 1,
      surveyTypePerson: 'pippo',
      surveyTypeCompany: 'pippo',
      adjustedAdvance: [],
      adjustedBrackets: [],
      promoter100: false,
      options: [
        {
          _id: 'id',
          fromYear: 0,
          toYear: 1,
          fromPremiumAmount: 0,
          toPremiumAmount: 1000,
          fixedAmount: 0,
          percentage: 100,
          retrocessionFee: 8000,
        },
        {
          _id: 'id',
          fromYear: 0,
          toYear: 1,
          fromPremiumAmount: 1001,
          toPremiumAmount: 5000,
          fixedAmount: 40,
          percentage: 500,
          retrocessionFee: 8000,
        },
      ],
    };

    expect(calculatePayout(3000, 550, 'id', 1, payin, productConfig)).toEqual(120);
  });
});
