const formatEUR = require('./format-eur');

describe('IT Number formatter', () => {
  test('should format a number in italian format', () => {
    let num = 22100;
    expect(formatEUR(num)).toEqual('22.100,00');

    num = 22100.5;
    expect(formatEUR(num)).toEqual('22.100,50');

    num = 1200100.5;
    expect(formatEUR(num)).toEqual('1.200.100,50');

    num = 1000;
    expect(formatEUR(num)).toEqual('1.000,00');

    num = 1000.5;
    expect(formatEUR(num)).toEqual('1.000,50');
  });
});
