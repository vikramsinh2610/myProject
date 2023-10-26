const { capitalizeFirstLetter } = require('./text-helper');

describe('Text Helper', () => {
  test('should capitalize first letter of each word in a string', () => {
    const text = 'this is a nICE storY, Of course!';
    const expected = 'This Is A Nice Story, Of Course!';
    expect(capitalizeFirstLetter(text)).toEqual(expected);

    expect(capitalizeFirstLetter('')).toEqual('');

    // @ts-ignore
    // eslint-disable-next-line unicorn/no-useless-undefined
    expect(capitalizeFirstLetter(undefined)).toEqual('');

    // @ts-ignore
    expect(capitalizeFirstLetter(null)).toEqual('');

    // @ts-ignore
    expect(capitalizeFirstLetter({ text: 'aaa' })).toEqual('');
  });
});
