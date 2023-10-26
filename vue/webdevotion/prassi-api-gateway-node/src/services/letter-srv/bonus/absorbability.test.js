const Absorbability = require('./absorbability');

describe('Absorbability', () => {
  test('should have these properties', () => {
    const absorbability = new Absorbability({
      indirectProductionPercentage: 3000,
      directProductionPercentage: 7000,
    });
    expect(absorbability).toHaveProperty('indirectProductionPercentage');
    expect(absorbability).toHaveProperty('directProductionPercentage');
  });

  test('should return it s JSON Schema', () => {
    expect(Absorbability.getJSONSchema()).toMatchSnapshot();
  });
});
