const Promoter = require('./promoter');

describe('Promoter', () => {
  test('should have these properties', () => {
    const promoter = new Promoter({
      _id: 'ID',
      name: 'Pippo',
      surname: 'De Peppis',
      username: 'pippo@thepeppis.com',
      role: {},
      tipoDocumento: {},
      numeroDocumento: '',
      documentoRilasciatoDa: '',
      documentoDataRilascio: '',
      documentoDataScadenza: '',
      serialNumber: 'AZ00123',
      fiscalCode: 'DPPPPP12D76C342R',
      ivass: '',
      address: {
        route: 'Via Della Vittoria',
        streetNumber: 25,
        city: 'Paperopoli',
        province: 'TO',
        area: 'BO',
        postalCode: '20182',
      },
      tax: { iban: 'IT0987265345675432', vat: '098767890', fiscalRegimeType: 'ordinary' },
      gerarchiaResponsabili: {},
      approved: false,
      enabled: true,
      networkEnterDate: new Date(),
      networkExitDate: new Date(),
      fixedPhone: '00922132',
      mobilePhone: '39483252934',
      birthDate: new Date(),
      birthCity: 'Milano',
      physicalPerson: true,
      sex: 'M',
      corporateEmail: 'm@m.it',
      personalEmail: 'm@m.it',
      birthRegion: 'Milano',
      birthState: 'Italia',
      trustDate: new Date(),
      endTrustDate: '',
      taxCode: '0001',
      subjectCode: '0001',
      eInvoice: true,
      companyData: {
        Denominazione: 'EUROPROGRESSSRL',
        CodiceFiscale: '',
        PartitaIva: '00000000000',
      },
    });

    expect(promoter).toHaveProperty('_id');
    expect(promoter).toHaveProperty('name');
    expect(promoter).toHaveProperty('surname');
    expect(promoter).toHaveProperty('username');
    expect(promoter).toHaveProperty('serialNumber');
    expect(promoter).toHaveProperty('fiscalCode');
    expect(promoter).toHaveProperty('approved');
    expect(promoter).toHaveProperty('enabled');
    expect(promoter).toHaveProperty('networkEnterDate');
    expect(promoter).toHaveProperty('networkExitDate');
    expect(promoter).toHaveProperty('fixedPhone');
    expect(promoter).toHaveProperty('mobilePhone');
    expect(promoter).toHaveProperty('birthDate');
    expect(promoter).toHaveProperty('tax');
    expect(promoter.tax).toHaveProperty('iban');
    expect(promoter.tax).toHaveProperty('vat');
    expect(promoter.tax).toHaveProperty('fiscalRegimeType');
    expect(promoter).toHaveProperty('address');
    expect(promoter.address).toHaveProperty('route');
    expect(promoter.address).toHaveProperty('streetNumber');
    expect(promoter.address).toHaveProperty('city');
    expect(promoter.address).toHaveProperty('province');
    expect(promoter.address).toHaveProperty('country');
    expect(promoter.address).toHaveProperty('postalCode');
    expect(promoter.address).toHaveProperty('displayAddress');
    expect(promoter.displayName).toBe('Pippo De Peppis');
  });
});
