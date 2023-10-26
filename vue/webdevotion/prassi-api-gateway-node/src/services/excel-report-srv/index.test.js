const xlsx = require('xlsx');
const { excelReport } = require('.');

const data = {
  headers: [
    { field: 'name', position: 1, translation: 'Nome' },
    { field: 'city', position: 3, translation: 'Город' },
    { field: 'age', position: 2, translation: 'Età' }
  ],
  data: [
    { name: 'Luca', age: '22', city: 'Milano' },
    { name: 'Joe', city: 'New York', age: '23' },
    { age: '23', city: 'New York' },
  ]
};

describe('Excel report service', () => {
  test('should create buffer properly',
    () => {
      const buffer = excelReport(data);
      const parsedBuffer = xlsx.read(buffer);
      return expect(parsedBuffer.Sheets).toMatchSnapshot();
    });
});
