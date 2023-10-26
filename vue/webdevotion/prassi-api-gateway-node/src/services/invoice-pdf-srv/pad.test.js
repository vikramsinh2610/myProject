const pad = require('./pad');

describe('Pad', () => {
  test('should pad number to obain specified lenght', () => {
    expect(pad(7, 3)).toEqual('007');

    expect(pad(77, 3)).toEqual('077');

    expect(pad(777, 3)).toEqual('777');

    expect(pad(700, 3)).toEqual('700');
  });
});
