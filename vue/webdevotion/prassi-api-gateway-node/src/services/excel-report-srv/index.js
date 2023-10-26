const Xlsx = require('xlsx');
const ExcelInputData = require('./excel-input-data');

const REPORT_NAME = 'Report';

/**
 * @param {object} data
 * @returns {object}
 */
function prepareDataForXLSX(data) {
  const xlsTable = [];
  // soring header by position;
  data.headers.sort((a, b) => a.position - b.position);
  // headers key
  const headerFieldNames = data.headers.map((item) => item.field);
  // adding headers to resulted table
  xlsTable.push(data.headers.map((item) => item.translation));
  // adding rows to resulted table
  data.data.forEach((row) => {
    const newRow = [];
    headerFieldNames.forEach((header) => {
      const rowHeader = row[`${header}`];
      let pushRow = '';
      if (rowHeader) {
        pushRow = rowHeader;
      } else if (rowHeader === 0) {
        // @ts-ignore
        pushRow = 0;
      } else {
        // @ts-ignore
        pushRow = null;
      }
      newRow.push(pushRow);
    });
    xlsTable.push(newRow);
  });
  return xlsTable;
}

/**
 * @param {ExcelInputData} data
 * @returns {Buffer}
 */
function excelReport(data) {
  if (!data.headers || !data.data) {
    throw new Error('Wrong data structure');
  }

  const preparedData = prepareDataForXLSX(data);
  const ws = Xlsx.utils.aoa_to_sheet(preparedData);
  const wb = Xlsx.utils.book_new();
  Xlsx.utils.book_append_sheet(wb, ws, REPORT_NAME);

  return Xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * @param {ExcelInputData} data
 * @returns {Buffer}
 */
function csvReport(data) {
  if (!data.headers || !data.data) {
    throw new Error('Wrong data structure');
  }

  const preparedData = prepareDataForXLSX(data);
  const ws = Xlsx.utils.aoa_to_sheet(preparedData);
  const wb = Xlsx.utils.book_new();
  Xlsx.utils.book_append_sheet(wb, ws, REPORT_NAME);
  return Buffer.from(Xlsx.utils.sheet_to_csv(ws, { FS: ';' }), 'utf-8');
}

module.exports = {
  excelReport,
  csvReport,
};
