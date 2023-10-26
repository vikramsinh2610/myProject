const { groupBy } = require('./group-by');

describe('GroupBy', () => {
  test('should group by an array of objects by given property', () => {
    const arr = [
      { animal: 'cat', name: 'Billy' },
      { animal: 'cat', name: 'Tom' },
      { animal: 'dog', name: 'Rex' },
    ];

    const grouped = groupBy(arr, 'animal');
    expect(grouped).toMatchObject([
      [{ animal: 'cat', name: 'Billy' }, { animal: 'cat', name: 'Tom' }],
      [{ animal: 'dog', name: 'Rex' }],
    ]);
  });
});
