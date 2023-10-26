const {
  parse,
  unparse,
  toDate,
  differenceBetween,
  addMonths,
  periodOrToday,
  toDateEnd,
} = require('./productive-period-helper');

describe('Productive Period Helper', () => {
  test('should parse', () => {
    expect(parse(2018, 8)).toBe(201808);
    expect(parse(2018, 11)).toBe(201811);
  });

  test('should unparse', () => {
    expect(unparse(201901)).toMatchObject({
      productivePeriodYear: 2019,
      productivePeriodMonth: 1,
    });

    expect(unparse(202912)).toMatchObject({
      productivePeriodYear: 2029,
      productivePeriodMonth: 12,
    });
  });

  test('should convert productive period to date', () => {
    const productivePeriod = 201701;
    expect(toDate(productivePeriod)).toEqual(new Date('2017-01-01T00:00:00.000Z'));
  });

  test('should calculate exclusive difference between productive periods', () => {
    const difference = differenceBetween(201901, 201809);
    expect(difference).toBe(3);
  });

  test('should add months to productive periods', () => {
    expect(addMonths(201808, 4)).toBe(201812);
    expect(addMonths(201811, 4)).toBe(201903);
    expect(addMonths(201802, -1)).toBe(201801);
    expect(addMonths(201801, -2)).toBe(201711);
    expect(addMonths(201812, 12)).toBe(201912);
  });

  test('return today period if future period', () => {
    const period = periodOrToday(new Date().getFullYear() + 1, new Date().getMonth() + 1);
    expect(period).toStrictEqual({
      productivePeriodMonth: new Date().getMonth() + 1,
      productivePeriodYear: new Date().getFullYear(),
    });
  });

  test('return 2019 12 period', () => {
    const period = periodOrToday(2019, 12);
    expect(period).toStrictEqual({
      productivePeriodMonth: 12,
      productivePeriodYear: 2019,
    });
  });

  test('return past period if past period', () => {
    const period = periodOrToday(new Date().getFullYear() - 1, new Date().getMonth() + 1);
    expect(period).toStrictEqual({
      productivePeriodMonth: new Date().getMonth() + 1,
      productivePeriodYear: new Date().getFullYear() - 1,
    });
  });

  test('return today period if today period', () => {
    const period = periodOrToday(new Date().getFullYear(), new Date().getMonth() + 1);
    expect(period).toStrictEqual({
      productivePeriodMonth: new Date().getMonth() + 1,
      productivePeriodYear: new Date().getFullYear(),
    });
  });

  test('returnlast day of productive period', () => {
    const date = toDateEnd(202001);
    expect(date.toISOString().slice(0, 10)).toBe('2020-01-31');
  });
});
