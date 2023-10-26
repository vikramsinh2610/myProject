const { calculatePayin } = require('.');
const ProductConfiguration = require("../product-configuration-srv/product-configuration");

describe('Payin Service', () => {
  test('should calcualte payin using provided configuration', () => {
    const premiumNet = 50000;
    const premiumGross = 70000;
    const optionId = 'A';
    const year = 1;
    const config = new ProductConfiguration({
      _id: 'id',
      premiumType: 'net',
      productName: 'Pippo',
      productCode: 'Pluto',
      advance: true,
      companyAdvance: false,
      monthsOnSubscription: 3,
      options: [
        {
          _id: 'A',
          fromYear: 0,
          toYear: 1,
          fromPremiumAmount: 0,
          toPremiumAmount: 100000,
          fixedAmount: 40,
          percentage: 500,
          retrocessionFee: 8000,
        },
      ],
    });

    expect(calculatePayin(premiumNet, premiumGross, optionId, year, config)).toEqual(2540);
  });

  test('should calcualte payin using provided configuration irpef style', () => {
    const premiumNet = 50000;
    const premiumGross = 70000;
    const optionId = 'A';
    const year = 1;
    const config = new ProductConfiguration({
      _id: 'id',
      premiumType: 'net',
      productName: 'Pippo',
      productCode: 'Pluto',
      advance: true,
      companyAdvance: false,
      monthsOnSubscription: 3,
      options: [
        {
          _id: 'A',
          fromYear: 0,
          toYear: 1,
          fromPremiumAmount: 0,
          toPremiumAmount: 25000,
          fixedAmount: 0,
          percentage: 200,
          retrocessionFee: 8000,
        },
        {
          _id: 'A',
          fromYear: 0,
          toYear: 1,
          fromPremiumAmount: 25000,
          toPremiumAmount: 100000,
          fixedAmount: 0,
          percentage: 500,
          retrocessionFee: 8000,
        },
      ],
    });

    expect(calculatePayin(premiumNet, premiumGross, optionId, year, config)).toEqual(1750);
  });
});
