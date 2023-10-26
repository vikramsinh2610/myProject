const fs = require('fs');
const path = require('path');
// eslint-disable-next-line unicorn/import-index
const { parse } = require("..");

describe('Parser', () => {
  test('should parse company income Excel', () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const buffer = fs.readFileSync(path.join(__dirname, 'income.xls'));
    const payments = parse(buffer);
    expect(payments[0]).toHaveProperty('_id');
    expect(payments[0]).toHaveProperty('contractId');
    expect(payments[0]).toHaveProperty('type');
    expect(payments[0]).toHaveProperty('premiumNet');
    expect(payments[0]).toHaveProperty('premiumGross');
    expect(payments[0]).toHaveProperty('payin');
    expect(payments[0]).toHaveProperty('installmentDate');
    expect(payments[0]).toHaveProperty('installment');

  });
});
