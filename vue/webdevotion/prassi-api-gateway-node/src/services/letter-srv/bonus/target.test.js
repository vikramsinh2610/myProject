const Target = require('./target');

describe('Target', () => {
  test('should have these properties', () => {
    const target = new Target({ kpi: {}, targetValue: 18765, weightPercentage: 50 });
    expect(target).toHaveProperty('kpi');
    expect(target).toHaveProperty('targetValue');
    expect(target).toHaveProperty('weightPercentage');
  });

  test('should return it s JSON Schema', () => {
    expect(Target.getJSONSchema()).toMatchSnapshot();
  });
});
