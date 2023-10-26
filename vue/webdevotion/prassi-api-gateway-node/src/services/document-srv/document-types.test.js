const mockdate = require('mockdate');
const DocumentObject = require('./document');
const { types, documentToPath } = require('./document-types');

describe('Document Types', () => {
  beforeAll(() => {
    // @ts-ignore
    mockdate.set('2018-05-11T22:23:12.000Z');
  });

  test('should generate path for LETTER_ATTACHMENT document type', () => {
    const doc = new DocumentObject({
      _id: 'pippo',
      type: types.LETTER_ATTACHMENT,
      createDate: new Date(),
      bucket: 'mybucket',
      ownerId: 'topolino',
      displayName: 'I am a file',
      additionalData: { letterId: 'LetterID' },
    });
    expect(documentToPath(doc)).toEqual('letters/LetterID/pippo');
  });

  test('should generate path for COMPANY_ACQUITTANCE document type', () => {
    const doc = new DocumentObject({
      _id: 'pippo',
      type: types.COMPANY_ACQUITTANCE,
      createDate: new Date(),
      bucket: 'mybucket',
      displayName: 'I am a file',
      ownerId: 'topolino',
      additionalData: { companyId: 'CompanyID', companyName: 'Zurich' },
    });
    expect(documentToPath(doc)).toEqual('company-acquittances/Zurich-CompanyID/pippo');
  });

  test('should generate path for COMPANY_ACQUITTANCE_REPORT document type', () => {
    const doc = new DocumentObject({
      _id: 'pippo',
      type: types.COMPANY_ACQUITTANCE_REPORT,
      createDate: new Date(Date.now()),
      bucket: 'mybucket',
      ownerId: 'topolino',
      displayName: 'I am a file',
      additionalData: { acquittanceId: 'AcqId' },
    });
    expect(documentToPath(doc)).toEqual('company-acquittance-reports/AcqId-2018-05-11T22:23:12.000Z.xlsx');
  });

  test('should generate path for INVOICE document type', () => {
    const doc = new DocumentObject({
      _id: 'pippo',
      type: types.INVOICE,
      createDate: new Date(),
      bucket: 'mybucket',
      ownerId: 'topolino',
      displayName: 'I am a file',
      additionalData: { productivePeriod: 201701 },
    });
    expect(documentToPath(doc)).toEqual('invoices/topolino/pippo.pdf');
  });

  test('should generate path for unknown document type', () => {
    const doc = new DocumentObject({
      _id: 'pippo',
      type: 'AAAAAA',
      createDate: new Date(),
      bucket: 'mybucket',
      ownerId: 'topolino',
      displayName: 'I am a file',
      additionalData: {},
    });
    expect(documentToPath(doc)).toEqual('generals/pippo');
  });
});
