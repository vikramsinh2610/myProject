const moment = require('moment');
const xlsx = require('xlsx');
const Payment = require('../payment');
const { types } = require('../payment-types');
const logger = require('../../logger-srv')();

function parseDate(raw) {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const pad = (str) => `0${str}`.slice(-2);
  const [month, day, year] = `${raw}`.split(' ')[0].split('/');
  return new Date(`20${year}-${pad(month)}-${pad(day)}T00:00:00.000Z`);
}

function parseType(raw) {
  switch (raw) {
    case 'SO':
    case 'PS':
      return types.SUBSCRIPTION;
    case 'RA':
    case 'RO':
      return types.INCOME;
    case 'VA':
      return types.ADDITIONAL_INCOME;
    default:
      return types.NONE;
  }
}

const getType = (type) => {
  if (type.includes('polizza')) {
    return 'SO';
  }
  if (type.includes('quietanza')) {
    return 'RA';
  }
  if (type === 'appendici') {
    return '';
  }
  if (type === 'vi') {
    return 'VA';
  }
  if (type === 'qr' || type === 'qf') {
    return 'RA';
  }
  if (type === 'np' || type === 'premio di emissione') {
    return 'SO';
  }
  return type.toUpperCase();
};
// eslint-disable-next-line sonarjs/cognitive-complexity
/**
 * @param {Buffer} buffer
 * @returns {Array<Payment>}
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function parseMetlife(buffer) {
  const excel = xlsx.read(buffer);
  const sheet = excel.Sheets[excel.SheetNames[0]];
  const content = [];

  logger.trace('Acquittances parsing: started');

  let y = 7;
  while (sheet[`A${y}`]) {
    try {
      if (sheet[`D${y}`].v !== 'A' && sheet[`J${y}`]) {
        let date = moment(sheet[`B${y}`].w, 'MM/DD/YYYY');
        if (!date.isValid()) {
          date = moment(sheet[`B${y}`].w, 'DD/MM/YYYY');
        }
        const date1stbit = date.year();
        const date2ndbit = date.month() + 1;
        const productivePeriodYear = date1stbit >= 1 && date1stbit <= 12 ? date2ndbit : date1stbit;
        const productivePeriodMonth = date1stbit >= 1 && date1stbit <= 12 ? date1stbit : date2ndbit;

        let installmentDate = moment(sheet[`D${y}`].w, 'MM/DD/YYYY');
        if (!installmentDate.isValid()) {
          installmentDate = moment(sheet[`D${y}`].w, 'DD/MM/YYYY');
        }
        const payIn = Math.trunc(sheet[`H${y}`].v * 100);
        const contractId = Number.parseInt(sheet[`A${y}`].v, 10);

        let newIdAndPeriod = true;
        content.forEach((item, index) => {
          if (
            item.contractId === contractId &&
            item.productivePeriodYear === productivePeriodYear &&
            item.productivePeriodMonth === productivePeriodMonth
          ) {
            newIdAndPeriod = false;

            if (item.payin + payIn === 0) {
              content.splice(index, 1);
            } else {
              content[`${index}`].payin = item.payin + payIn;
            }
          }
        });

        if (newIdAndPeriod) {
          content.push(
            new Payment({
              practiceId: '',
              contractId: Number.parseInt(sheet[`A${y}`].v, 10),
              type: sheet[`J${y}`] ? parseType(sheet[`J${y}`].v.trim()) : parseType(''),
              premiumNet: Math.trunc(sheet[`F${y}`].v * 100),
              premiumGross: Math.trunc(sheet[`F${y}`].v * 100),
              payin: payIn,
              installmentDate: installmentDate.isValid() ? installmentDate.format('YYYY-MM-DD') : undefined,
              productivePeriodYear,
              productivePeriodMonth,
              installment: 0,
            }),
          );
        }
      }
    } catch (error) {
      logger.error(error, `Error parsing acquittance on line ${y}`);
      throw new Error(`Riga ${y} non valida`);
    }
    y += 1;
  }

  logger.trace('Acquittances parsing: success!');
  return content;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
/**
 * @param {Buffer} buffer
 * @returns {Array<Payment>}
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function parse(buffer) {
  const excel = xlsx.read(buffer);
  const sheet = excel.Sheets[excel.SheetNames[0]];
  const content = [];

  logger.trace('Acquittances parsing: started');

  let y = 2;
  while (sheet[`A${y}`]) {
    try {
      if (sheet[`D${y}`].v !== 'A') {
        const date1stbit = Number.parseInt(sheet[`J${y}`].v.split('/')[0], 10);
        const date2ndbit = Number.parseInt(sheet[`J${y}`].v.split('/')[1], 10);
        const productivePeriodYear = date1stbit >= 1 && date1stbit <= 12 ? date2ndbit : date1stbit;
        const productivePeriodMonth = date1stbit >= 1 && date1stbit <= 12 ? date1stbit : date2ndbit;
        content.push(
          new Payment({
            practiceId: sheet[`B${y}`] ? sheet[`B${y}`].v.trim() : '',
            contractId: sheet[`A${y}`].v.trim(),
            type: parseType(sheet[`D${y}`].v.trim()),
            premiumNet: Math.trunc(sheet[`E${y}`].v * 100),
            premiumGross: Math.trunc(sheet[`G${y}`].v * 100),
            payin: Math.trunc((sheet[`H${y}`].v + sheet[`I${y}`].v) * 100),
            installmentDate: sheet[`K${y}`] && sheet[`K${y}`].w ? parseDate(sheet[`K${y}`].w) : undefined,
            productivePeriodYear,
            productivePeriodMonth,
            installment: Number.parseInt(sheet[`L${y}`].v, 10),
          }),
        );
      }
    } catch (error) {
      logger.error(error, `Error parsing acquittance on line ${y}`);
      throw new Error(`Riga ${y} non valida`);
    }
    y += 1;
  }

  logger.trace('Acquittances parsing: success!');
  return content;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function parseNobis(buffer) {
  const excel = xlsx.read(buffer);
  const sheet = excel.Sheets[excel.SheetNames[0]];
  const content = [];

  logger.trace('Acquittances parsing: started');

  let y = 2;
  while (sheet[`A${y}`]) {
    try {
      if (sheet[`D${y}`].v !== 'A') {
        let date = moment(sheet[`R${y}`].w, 'MM/DD/YYYY');
        if (!date.isValid()) {
          date = moment(sheet[`R${y}`].w, 'DD/MM/YYYY');
        }

        const date1stbit = date.year();
        const date2ndbit = date.month() + 1;
        const productivePeriodYear = date1stbit >= 1 && date1stbit <= 12 ? date2ndbit : date1stbit;
        const productivePeriodMonth = date1stbit >= 1 && date1stbit <= 12 ? date1stbit : date2ndbit;

        let installmentDate = moment(sheet[`N${y}`].w, 'MM/DD/YYYY');
        if (!installmentDate.isValid()) {
          installmentDate = moment(sheet[`N${y}`].w, 'DD/MM/YYYY');
        }

        content.push(
          new Payment({
            practiceId: '',
            contractId: Number.parseInt(sheet[`I${y}`].v, 10),
            type: sheet[`C${y}`] ? parseType(getType(sheet[`C${y}`].v.trim().toLowerCase())) : parseType(''),
            premiumNet: Math.trunc(sheet[`L${y}`].v * 100),
            premiumGross: Math.trunc(sheet[`L${y}`].v * 100),
            payin: Math.trunc(sheet[`P${y}`].v * 100),
            installmentDate: installmentDate.isValid() ? installmentDate.format('YYYY-MM-DD') : undefined,
            productivePeriodYear,
            productivePeriodMonth,
            installment: 0,
          }),
        );
      }
    } catch (error) {
      logger.error(error, `Error parsing acquittance on line ${y}`);
      throw new Error(`Riga ${y} non valida`);
    }
    y += 1;
  }

  logger.trace('Acquittances parsing: success!');
  return content;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function parseZurich(buffer) {
  const excel = xlsx.read(buffer);
  const sheet = excel.Sheets[excel.SheetNames[1]];
  const content = [];

  logger.trace('Acquittances parsing: started');

  let y = 5;
  while (sheet[`A${y}`]) {
    try {
      if (sheet[`D${y}`].v !== 'A') {
        const date1stbit = Number.parseInt(sheet[`A${y}`].v, 10);
        const date2ndbit = Number.parseInt(sheet[`B${y}`].v, 10);
        const productivePeriodYear = date1stbit >= 1 && date1stbit <= 12 ? date2ndbit : date1stbit;
        const productivePeriodMonth = date1stbit >= 1 && date1stbit <= 12 ? date1stbit : date2ndbit;

        let installmentDate = moment(sheet[`G${y}`].w, 'MM/DD/YYYY');
        if (!installmentDate.isValid()) {
          installmentDate = moment(sheet[`G${y}`].w, 'DD/MM/YYYY');
        }

        content.push(
          new Payment({
            practiceId: '',
            contractId: Number.parseInt(sheet[`F${y}`].v, 10),
            type: parseType('SO'),
            premiumNet: Math.trunc(sheet[`L${y}`].v * 100),
            premiumGross: Math.trunc(sheet[`L${y}`].v * 100),
            payin: Math.trunc(sheet[`M${y}`].v * 100),
            installmentDate: installmentDate.isValid() ? installmentDate.format('YYYY-MM-DD') : undefined,
            productivePeriodYear,
            productivePeriodMonth,
            installment: 0,
          }),
        );
      }
    } catch (error) {
      logger.error(error, `Error parsing acquittance on line ${y}`);
      throw new Error(`Riga ${y} non valida`);
    }
    y += 1;
  }

  logger.trace('Acquittances parsing: success!');
  return content;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function parseItaliana(buffer) {
  const excel = xlsx.read(buffer);
  const sheet = excel.Sheets[excel.SheetNames[1]];
  const content = [];

  logger.trace('Acquittances parsing: started');

  let y = 7;
  while (sheet[`A${y}`]) {
    try {
      if (sheet[`D${y}`].v !== 'A') {
        let date = moment(sheet[`I${y}`].w, 'DD/MM/YYYY');
        if (!date.isValid()) {
          date = moment(sheet[`I${y}`].w, 'MM/DD/YYYY');
        }

        const date1stbit = date.year();
        const date2ndbit = date.month() + 1;
        const productivePeriodYear = date1stbit >= 1 && date1stbit <= 12 ? date2ndbit : date1stbit;
        const productivePeriodMonth = date1stbit >= 1 && date1stbit <= 12 ? date1stbit : date2ndbit;

        let installmentDate = moment(sheet[`W${y}`].w, 'DD/MM/YYYY');
        if (!installmentDate.isValid()) {
          installmentDate = moment(sheet[`W${y}`].w, 'MM/DD/YYYY');
        }

        content.push(
          new Payment({
            practiceId: '',
            contractId: sheet[`E${y}`].v.trim() + 2000,
            type: parseType(getType(sheet[`B${y}`].v.trim().toLowerCase())),
            premiumNet: Math.trunc(sheet[`J${y}`].v * 100),
            premiumGross: Math.trunc(sheet[`J${y}`].v * 100),
            payin: Math.trunc(sheet[`K${y}`].v * 100),
            installmentDate: installmentDate.isValid() ? installmentDate.format('YYYY-MM-DD') : undefined,
            productivePeriodYear,
            productivePeriodMonth,
            installment: 0,
          }),
        );
      }
    } catch (error) {
      logger.error(error, `Error parsing acquittance on line ${y}`);
      throw new Error(`Riga ${y} non valida`);
    }
    y += 1;
  }

  logger.trace('Acquittances parsing: success!');
  return content;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function parseCf(buffer) {
  const excel = xlsx.read(buffer);
  const sheet = excel.Sheets[excel.SheetNames[0]];
  const content = [];

  logger.trace('Acquittances parsing: started');

  let y = 5;
  while (sheet[`A${y}`]) {
    try {
      if (sheet[`F${y}`].v !== 'A') {
        let date = moment(sheet[`L${y}`].w, 'DD/MM/YYYY');
        if (!date.isValid()) {
          date = moment(sheet[`L${y}`].w, 'MM/DD/YYYY');
        }

        const date1stbit = date.year();
        const date2ndbit = date.month() + 1;
        const productivePeriodYear = date1stbit >= 1 && date1stbit <= 12 ? date2ndbit : date1stbit;
        const productivePeriodMonth = date1stbit >= 1 && date1stbit <= 12 ? date1stbit : date2ndbit;

        let installmentDate = moment(sheet[`N${y}`].w, 'DD/MM/YYYY');
        if (!installmentDate.isValid()) {
          installmentDate = moment(sheet[`N${y}`].w, 'MM/DD/YYYY');
        }

        content.push(
          new Payment({
            practiceId: '',
            contractId: Number.parseInt(sheet[`A${y}`].v, 10),
            type: parseType(getType(sheet[`F${y}`].v.trim().toLowerCase())),
            premiumNet: Math.trunc(sheet[`AC${y}`].v * 100),
            premiumGross: Math.trunc(sheet[`AB${y}`].v * 100),
            payin: Math.trunc(sheet[`AG${y}`].v * 100),
            installmentDate: installmentDate.isValid() ? installmentDate.format('YYYY-MM-DD') : undefined,
            productivePeriodYear,
            productivePeriodMonth,
            installment: 0,
          }),
        );
      }
    } catch (error) {
      logger.error(error, `Error parsing acquittance on line ${y}`);
      throw new Error(`Riga ${y} non valida`);
    }
    y += 1;
  }

  logger.trace('Acquittances parsing: success!');
  return content;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function parseCfLife(buffer) {
  const excel = xlsx.read(buffer);
  const sheet = excel.Sheets[excel.SheetNames[0]];
  const content = [];

  logger.trace('Acquittances parsing: started');

  let y = 9;
  while (sheet[`A${y}`]) {
    try {
      if (sheet[`E${y}`].v !== 'A') {
        let date = moment(sheet[`H${y}`].w, 'DD/MM/YYYY');
        if (!date.isValid()) {
          date = moment(sheet[`H${y}`].w, 'MM/DD/YYYY');
        }

        const date1stbit = date.year();
        const date2ndbit = date.month() + 1;
        const productivePeriodYear = date1stbit >= 1 && date1stbit <= 12 ? date2ndbit : date1stbit;
        const productivePeriodMonth = date1stbit >= 1 && date1stbit <= 12 ? date1stbit : date2ndbit;

        let installmentDate = moment(sheet[`I${y}`].w, 'DD/MM/YYYY');
        if (!installmentDate.isValid()) {
          installmentDate = moment(sheet[`I${y}`].w, 'MM/DD/YYYY');
        }
        
        content.push(
          new Payment({
            practiceId: '',
            contractId: sheet[`C${y}`].v,
            type: parseType(getType(sheet[`E${y}`].v.trim().toLowerCase())),
            premiumNet: Math.trunc(sheet[`K${y}`].v),
            premiumGross: Math.trunc(sheet[`K${y}`].v),
            payin: Math.trunc(sheet[`L${y}`].v * 100),
            installmentDate: installmentDate.isValid() ? installmentDate.format('YYYY-MM-DD') : undefined,
            productivePeriodYear,
            productivePeriodMonth,
            installment: 0,
          }),
        );
      }
    } catch (error) {
      logger.error(error, `Error parsing acquittance on line ${y}`);
      throw new Error(`Riga ${y} non valida`);
    }
    y += 1;
  }

  logger.trace('Acquittances parsing: success!');
  return content;
}

module.exports = {
  parse,
  parseNobis,
  parseMetlife,
  parseZurich,
  parseItaliana,
  parseCf,
  parseCfLife,
};
