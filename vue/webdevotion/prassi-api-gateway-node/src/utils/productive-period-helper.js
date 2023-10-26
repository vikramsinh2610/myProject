const moment = require('moment');

/**
 * @typedef {object} Period
 * @property {number} productivePeriodYear
 * @property {number} productivePeriodMonth
 */

function parse(productivePeriodYear, productivePeriodMonth) {
  return Number.parseInt(productivePeriodYear + `0${productivePeriodMonth}`.slice(-2), 10);
}

function unparse(productivePeriod) {
  return {
    productivePeriodYear: Number.parseInt(`${productivePeriod}`.slice(0, 4), 10),
    productivePeriodMonth: Number.parseInt(`${productivePeriod}`.slice(-2), 10),
  };
}

function dateToPeriod() {
  const productivePeriodMonth = new Date().getMonth() + 1;
  const productivePeriodYear = new Date().getFullYear();
  return parse(productivePeriodYear, productivePeriodMonth);
}

function toPeriod(periodDate) {
  const productivePeriodMonth = periodDate.getMonth() + 1;
  const productivePeriodYear = periodDate.getFullYear();
  return parse(productivePeriodYear, productivePeriodMonth);
}

function toDate(productivePeriod) {
  const year = `${productivePeriod}`.slice(0, 4);
  const month = `${productivePeriod}`.slice(-2);
  return new Date(`${year}-${month}-01T00:00:00.000Z`);
}

function toDateEnd(productivePeriod) {
  const year = `${productivePeriod}`.slice(0, 4);
  const month = `${productivePeriod}`.slice(-2);

  const startDate = moment(new Date(`${year}-${month}-01T00:00:00.000Z`));
  return moment(startDate).endOf('month').toDate();
}

function toQuarter(year, month) {
  let quarter = 'Q1';
  switch (month) {
    case 1:
    case 2:
    case 3:
      quarter = 'Q1';
      break;
    case 4:
    case 5:
    case 6:
      quarter = 'Q2';
      break;
    case 7:
    case 8:
    case 9:
      quarter = 'Q3';
      break;
    case 10:
    case 11:
    case 12:
      quarter = 'Q4';
      break;
    default:
      quarter = 'Q1';
  }

  return `${year.toString()}${quarter}`;
}

/**
 * @param {number} productivePeriodA
 * @param {number} productivePeriodB
 */
function differenceBetween(productivePeriodA, productivePeriodB) {
  const a = toDate(productivePeriodA);
  const b = toDate(productivePeriodB);
  let months = Math.abs(b.getFullYear() - a.getFullYear()) * 12;
  months -= b.getMonth() + 1;
  months += a.getMonth();
  return months <= 0 ? 0 : months;
}

/**
 * @param {number} productivePeriodA
 * @param {number} productivePeriodB
 */
function monthsDifference(productivePeriodA, productivePeriodB) {
  const a = toDate(productivePeriodA);
  const b = toDate(productivePeriodB);
  let months = Math.abs(b.getFullYear() - a.getFullYear()) * 12;
  months -= b.getMonth() + 1;
  months += a.getMonth() + 1;
  return months <= 0 ? 0 : months;
}

/**
 * @param {number} productivePeriod
 * @param {number} months
 */
function addMonths(productivePeriod, months) {
  const a = toDate(productivePeriod);
  a.setMonth(a.getMonth() + months);

  return parse(a.getFullYear(), a.getMonth() + 1);
}


/**
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 * @return {object} Period
 */
function periodOrToday(productivePeriodYear, productivePeriodMonth) {
  const todayProductivePeriodMonth = new Date().getMonth() + 1;
  const todayProductivePeriodYear = new Date().getFullYear();
  const todayPeriod = parse(todayProductivePeriodYear, todayProductivePeriodMonth);
  const period = parse(productivePeriodYear, productivePeriodMonth);

  if (period >= todayPeriod) {
    return unparse(todayPeriod);
  }

  return unparse(period);
}

  module.exports = {
  parse,
  unparse,
  dateToPeriod,
  toPeriod,
  toDate,
  toDateEnd,
  toQuarter,
  differenceBetween,
  monthsDifference,
  addMonths,
  periodOrToday,
};
