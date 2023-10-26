const InvoicingState = require('./invoicing-state');
const dbConnector = require('../../utils/mongo-tests');

const { getById, update, exists } = require('./invoicing-repository');

describe('Invoicing Repository', () => {
  it('should save invoicing state', async () => {
    const { db, client } = await dbConnector();

    const invoicingState = new InvoicingState({
      productivePeriodYear: 2018,
      productivePeriodMonth: 5,
      status: 'OPENED',
      invoices: [],
      dueDate: "2018-07-20T12:15:48.320Z",
      issueDate: "2018-07-20T12:15:48.320Z",
    });
    await db.collection('invoicing').insertOne(invoicingState);

    invoicingState.status = 'CLOSED';
    await update(db, invoicingState);

    const resp = await db.collection('invoicing').findOne({ _id: '201805' });
    expect(resp).toMatchObject({
      _id: '201805',
      invoices: [],
      productivePeriodMonth: 5,
      productivePeriodYear: 2018,
      status: 'CLOSED',
      dueDate: "2018-07-20T12:15:48.320Z",
      issueDate: "2018-07-20T12:15:48.320Z",
    });
    client.close();
  });

  it('should get invoicing state by Id', async () => {
    const { db, client } = await dbConnector();

    const invoicingState = new InvoicingState({
      productivePeriodYear: 2018,
      productivePeriodMonth: 5,
      invoices: [],
      didClosedDate: null,
      didOpenedDate: null,
      dueDate: "2018-07-20T12:15:48.320Z",
      issueDate: "2018-07-20T12:15:48.320Z",
    });
    await db.collection('invoicing').insertOne(invoicingState);

    const resp = await getById(db, '201805');
    expect(resp).toMatchObject(invoicingState);
    client.close();
  });

  it('should check if invoicing state exists by Id', async () => {
    const { db, client } = await dbConnector();
    const invoicingState = new InvoicingState({
      productivePeriodYear: 2018,
      productivePeriodMonth: 5,
      invoices: [],
    });
    await db.collection('invoicing').insertOne(invoicingState);

    const resp = await exists(db, '201805');
    expect(resp).toBeTruthy();
    client.close();
  });
});
