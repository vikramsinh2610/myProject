const InvoicingState = require('./invoicing-state');

describe('InvoicingState', () => {
  test('should have these properties', () => {
    const invoicingState = new InvoicingState({
      productivePeriodYear: 2018,
      productivePeriodMonth: 8,
      invoices: [],
    });
    expect(invoicingState).toHaveProperty('_id');
    expect(invoicingState).toHaveProperty('productivePeriodYear');
    expect(invoicingState).toHaveProperty('productivePeriodMonth');
    expect(invoicingState).toHaveProperty('status');
    expect(invoicingState).toHaveProperty('invoices');
    expect(invoicingState).toHaveProperty('didOpenedDate');
    expect(invoicingState).toHaveProperty('didClosedDate');
    expect(invoicingState).toHaveProperty('documentIds');
    expect(invoicingState).toHaveProperty('stats');
  });

  test('should init empty _id', () => {
    const invoicingState = new InvoicingState({
      productivePeriodYear: 2018,
      productivePeriodMonth: 7,
      invoices: [],
    });
    expect(invoicingState._id).toEqual('201807');
  });
});
