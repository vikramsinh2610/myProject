const { trigger, initState } = require('./invoicing-fsm');
const { statuses } = require('./invoicing-statuses');
const { events } = require('./invoicing-events');

describe('Invoicing FSM', () => {
  test('should stay to "opened" state on "confirm-invoice" or "unconfirm-invoice" events from "opened" state', () => {
    const invoiceId = 'ID1';
    const invoice = { _id: invoiceId, confirmed: false };

    let state = trigger(
      events.CONFIRM_INVOICE,
      // @ts-ignore
      { status: statuses.OPENED, invoices: [invoice] },
      { invoiceId },
    );
    expect(state.status).toBe(statuses.OPENED);
    expect(state.invoices).toEqual([{ _id: invoiceId, confirmed: true }]);

    invoice.confirmed = false;
    state = trigger(
      events.UNCONFIRM_INVOICE,
      // @ts-ignore
      { status: statuses.OPENED, invoices: [invoice] },
      { invoiceId },
    );
    expect(state.status).toBe(statuses.OPENED);
    expect(state.invoices).toEqual([{ _id: invoiceId, confirmed: false }]);
  });

  test('should move to "closed" state on "close" event from "opened" state', () => {
    const state = trigger(
      events.CLOSE,
      // @ts-ignore
      { status: statuses.CLOSE_PROCESSING },
      {},
    );
    expect(state.status).toBe(statuses.CLOSED);
  });

  test('should init state', () => {
    // @ts-ignore
    const state = initState({
      productivePeriodYear: 2018,
      productivePeriodMonth: 7,
      invoices: [{ _id: 'ID', confirmed: false }],
    });
    expect(state.status).toBe(statuses.PROCESSING);
  });

  test('should error on invalid initial state', () => {
    const msg = 'Operazione non valida';
    expect(() =>
      trigger(
        events.CLOSE,
        // @ts-ignore
        { status: 'fake-state' },
        {},
      ),
    ).toThrow(msg);
  });

  test('should error on invalid event', () => {
    const event = 'fake-event';
    const msg = 'Evento non valido fake-event';
    expect(() =>
      trigger(
        event,
        // @ts-ignore
        { status: statuses.OPENED },
        {},
      ),
    ).toThrow(msg);
  });
});
