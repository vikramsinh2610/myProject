const { trigger, initState } = require('./acquittance-fsm');
const { statuses } = require('./acquittance-statuses');
const { events } = require('./acquittance-events');
const Acquittance = require('./acquittance');

describe('Acquittance FSM', () => {
  test('should stay to "created" state on "refresh" event', () => {
    const acquittance = new Acquittance({
      companyId: 'CompanyId',
      companyName: 'Zurich',
      documentId: 'DocumentId',
      didCreatedDate: new Date(Date.now()),
      payments: [],
      status: statuses.CREATED,
    });

    const state = trigger(events.REFRESH, acquittance);
    expect(state.status).toBe(statuses.CREATED);
  });

  test('should move to "confirmed" state on "confirm" event from "opened" state', () => {
    const acquittance = new Acquittance({
      companyId: 'CompanyId',
      companyName: 'Zurich',
      documentId: 'DocumentId',
      didCreatedDate: new Date(Date.now()),
      payments: [],
      status: statuses.CREATED,
    });

    const state = trigger(events.CONFIRM, acquittance);
    expect(state.status).toBe(statuses.CONFIRMED);
  });

  test('should init state', () => {
    const acquittance = new Acquittance({
      companyId: 'CompanyId',
      companyName: 'Zurich',
      documentId: 'DocumentId',
      didCreatedDate: new Date(Date.now()),
      payments: [],
    });

    const state = initState(acquittance);
    expect(state.status).toBe(statuses.CREATED);
  });

  test('should error on invalid initial state', () => {
    const msg = 'Operazione non valida';
    expect(() =>
      trigger(
        events.REFRESH,
        new Acquittance({
          companyId: 'CompanyId',
          companyName: 'Zurich',
          documentId: 'DocumentId',
          didCreatedDate: new Date(Date.now()),
          payments: [],
          status: 'fake-status',
        }),
      ),
    ).toThrow(msg);
  });

  test('should error on invalid event', () => {
    const event = 'fake-event';
    const msg = 'Invalid event fake-event';
    expect(() =>
      trigger(
        event,
        new Acquittance({
          companyId: 'CompanyId',
          companyName: 'Zurich',
          documentId: 'DocumentId',
          didCreatedDate: new Date(Date.now()),
          payments: [],
          status: statuses.CONFIRMED,
        }),
      ),
    ).toThrow(msg);
  });
});
