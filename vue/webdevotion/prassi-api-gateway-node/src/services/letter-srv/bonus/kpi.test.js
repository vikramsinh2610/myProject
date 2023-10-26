const KPI = require('./kpi');

describe('KPI', () => {
  test('should have these properties', () => {
    const kpi = new KPI({ _id: 'de2f234-2d2ed2-3d2232' });
    expect(kpi).toHaveProperty('_id');
    expect(kpi).toHaveProperty('value');
  });

  test('should return it s JSON Schema', () => {
    expect(KPI.getJSONSchema()).toMatchSnapshot();
  });
});
