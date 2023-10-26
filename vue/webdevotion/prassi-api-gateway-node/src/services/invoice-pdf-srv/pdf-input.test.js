const PDFInput = require('./pdf-input');

describe('PDFInput', () => {
  test('should have its JSON Schema', () => {
    expect(PDFInput.getJSONSchema()).toMatchSnapshot();
  });

  test('should have these properties', () => {
    const input = new PDFInput({
      regimeType: 'flat',
      invoiceNumber: '007',
      fiscalYear: 2018,
      emissionDate: '2018-07-20T12:15:48.320Z',
      dueDate: '2018-07-20T12:15:48.320Z',
      trustDate: '2018-07-20T12:15:48.320Z',
      productivePeriodMonth: 2,
      productivePeriodYear: 2018,
      total: 32300,
      payment: {
        paymentCondition: 'pagamento a vista',
        bank: 'Unicredit – Filiale di Cefalù – Piazza Garibaldi, 2',
      },
      iban: 'IT 23 T 02008 43260 000103943030',
      recipient: {
        name: 'TC Agency Insurance S.r.l.',
        vatNumber: '09528651004',
        fiscalCode: 'PZZNTN22H66E1111',
        address: {
          route: 'Via Monte Bianco',
          houseNumber: '60/A',
          postalCode: '20089',
          city: 'Rozzano',
          province: 'MI',
          country: 'Italia',
        },
      },
      sender: {
        name: 'Antonio Pizzardi',
        vatNumber: '03146970961',
        fiscalCode: 'C.F. PZZNTN72H12E617O',
        address: {
          route: 'Via Carlo Cattaneo',
          houseNumber: '6',
          postalCode: '20821',
          city: 'Meda',
          province: 'MB',
          country: 'Italia',
        },
      },
      content: {
        grossEntries: [
          {
            name: 'Anticipo provvigionale',
            value: 8424,
          },
          {
            name: 'Provvigioni maturate nel mese di gennaio 2018',
            value: 7330.71,
          },
          {
            name: 'Over provvigionali',
            value: 4847.6,
          },
        ],
        grossTotal: {
          name: 'Totale corrispettivi lordi',
          value: 20602.31,
        },
        taxEntries: [
          {
            name: 'Imponibile ritenuta d’acconto (50% dei corrispettivi lordi)',
            value: 10301.16,
          },
          {
            name: 'Ritenuta d’acconto 23%',
            value: -2359.27,
          },
        ],
      },
    });
    expect(input).toMatchSnapshot();
  });
});
