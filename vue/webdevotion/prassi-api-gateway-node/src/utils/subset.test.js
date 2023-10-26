const { subsets } = require('./subset');

describe('Subset', () => {
  test('should retuns all subset of a set', () => {
    const set = [1, 2, 3];
    const sub = subsets(set).sort();
    const expected = [[], [1], [2], [3], [1, 2], [2, 3], [1, 3], [1, 2, 3]].sort();
    expect(sub).toEqual(expected);
  });
});
