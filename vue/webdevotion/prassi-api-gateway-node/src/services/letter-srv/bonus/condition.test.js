const Condition = require('./condition');

describe('Condition', () => {
  test('should have these properties', () => {
    const condition = new Condition({ targets: [{}] });
    expect(condition).toHaveProperty('targets');
  });

  test('should return it s JSON Schema', () => {
    expect(Condition.getJSONSchema()).toMatchSnapshot();
  });
});
