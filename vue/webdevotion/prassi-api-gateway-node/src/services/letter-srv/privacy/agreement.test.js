const Agreement = require('./agreement');

describe('Agreement', () => {
  test('should have these properties', () => {
    const agreement = new Agreement({
      name: 'Mickey Mouse is nice',
      content: 'This is a very long story...',
      agree: true,
    });
    expect(agreement).toHaveProperty('name');
    expect(agreement).toHaveProperty('content');
    expect(agreement).toHaveProperty('agree');
  });

  test('should return it s JSON Schema', () => {
    expect(Agreement.getJSONSchema()).toMatchSnapshot();
  });
});
