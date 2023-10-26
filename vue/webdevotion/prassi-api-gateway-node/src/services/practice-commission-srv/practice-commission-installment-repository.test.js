const dbConnector = require('../../utils/mongo-tests');
const dbConnectorSql = require('../../utils/postgres-tests');

const {
  updateMany,
  getByPracticeIdAndInstallment,
  getByPracticeIdAndInstallmentAll,
  insertPractice,
} = require('./practice-commission-installment-repository');

describe('Practice Fee Repository', () => {
  it('should save practice fee entries as sql', async () => {
    const { db, client } = await dbConnector();
    const sql = await dbConnectorSql();

    expect.assertions(1);

    const entryObject = {
      dossierId: 'DossierId',
      practiceType: 'subscription',
      practiceBaseType: 'subscription',
      practiceId: 'AJCM2134r2',
      commissionType: 'purchase',
      productId: 'AHJDKCSX234',
      productName: 'Product Name',
      companyId: 'ContractId',
      companyName: 'Sample Company',
      customerId: '1',
      confirmed: false,
      contractId: 'ContractId',
      reminder: 0,
      productivePeriod: 201808,
      commissioningProductivePeriod: 201808,
      paymentDate: null,
      dueDate: new Date(Date.now()),
      effectDate: new Date(Date.now()),
      termDate: new Date(Date.now()),
      insurerId: 'ZZAA2134',
      premiumNet: 1000,
      premiumGross: 2000,
      optionId: 'A',
      createDate: new Date(Date.now()),
      installment: 2,
      productivePeriodYear: 2018,
      productivePeriodMonth: 8,
      commissioningProductivePeriodYear: 2018,
      commissioningProductivePeriodMonth: 8,
      payin: 100,
      margin: 20,
      payout: 80,
      advance: true,
      forecast: false,
      paidToNetwork: false,
      _id: 'asbdcda',
      insuredName: 'asbdcda',
      installmentsPerYear: 2,
      iv: 0,
      legacyPraticaIncassoId: null,
      commissioningId: null,
      postForce: null,
    };

    await insertPractice(sql, entryObject);
    const response = await getByPracticeIdAndInstallment(db, sql, 'AJCM2134r2', 2);

    expect(response.insurerId).toBe('ZZAA2134');
    client.close();
  });

  it('should update practice fee entries as sql', async () => {
    const { db, client } = await dbConnector();
    const sql = await dbConnectorSql();

    expect.assertions(2);

    const entryObject = {
      dossierId: 'DossierId',
      practiceType: 'subscription',
      practiceBaseType: 'subscription',
      practiceId: 'AJCM2134r2',
      commissionType: 'purchase',
      productId: 'AHJDKCSX234',
      productName: 'Product Name',
      companyId: 'ContractId',
      companyName: 'Sample Company',
      customerId: '1',
      confirmed: false,
      contractId: 'ContractId',
      reminder: 0,
      productivePeriod: 201808,
      commissioningProductivePeriod: 201808,
      paymentDate: null,
      dueDate: new Date(Date.now()),
      effectDate: new Date(Date.now()),
      termDate: new Date(Date.now()),
      insurerId: 'ZZAA2134',
      premiumNet: 1000,
      premiumGross: 2000,
      optionId: 'A',
      createDate: new Date(Date.now()),
      installment: 2,
      productivePeriodYear: 2018,
      productivePeriodMonth: 8,
      commissioningProductivePeriodYear: 2018,
      commissioningProductivePeriodMonth: 8,
      payin: 100,
      margin: 20,
      payout: 80,
      advance: true,
      forecast: false,
      paidToNetwork: false,
      _id: 'asbdcda',
      insuredName: 'asbdcda',
      installmentsPerYear: 2,
      iv: 0,
      legacyPraticaIncassoId: null,
      commissioningId: null,
      postForce: null,
    };

    await insertPractice(sql, entryObject);
    await updateMany(db, sql, ['asbdcda'], {
      reminder: 1,
      payout: 1000,
      paidToNetwork: true,
      forecast: false,
    });
    const response = await getByPracticeIdAndInstallmentAll(db, sql, 'AJCM2134r2', 2);

    expect(response.insurerId).toBe('ZZAA2134');
    expect(response.paidToNetwork).toBe(true);
    client.close();
  });
});
