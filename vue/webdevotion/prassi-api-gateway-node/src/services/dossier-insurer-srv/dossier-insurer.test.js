const DossierInsurer = require('./dossier-insurer');

describe('DossierInsurer', () => {
  test('should have these properties', () => {
    const dossierInsurer = new DossierInsurer({
      _id: 'ID',
      dossierId: 'DossierID',
      productivePeriodYear: 2018,
      productivePeriodMonth: 9,
      networkNodeId: 'NetworkNodeId',
      promoterId: 'PromoterID',
    });
    expect(dossierInsurer).toHaveProperty('dossierId');
    expect(dossierInsurer).toHaveProperty('productivePeriodYear');
    expect(dossierInsurer).toHaveProperty('productivePeriodMonth');
    expect(dossierInsurer).toHaveProperty('networkNodeId');
    expect(dossierInsurer).toHaveProperty('promoterId');
  });

  test('should reject not integer year month', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const testFunction = () => {
      // eslint-disable-next-line no-unused-vars
      const dossierInsurer = new DossierInsurer({
        dossierId: 'DossierID',
        productivePeriodYear: 'pippo',
        productivePeriodMonth: 'pluto',
        networkNodeId: 'NetworkNodeId',
        promoterId: 'PromoterID',
      });
    };

    expect(testFunction).toThrow(TypeError);
  });
});
