const { trigger, initState } = require('./commissioning-fsm');
const { statuses } = require('./commissioning-statuses');
const { events } = require('./commissioning-events');

describe('Commissioning FSM', () => {
  test(
    'should stay to "opened" state on "add-practice-installment" or "remove-practice-installment" events ' +
      'from "opened" state',
    () => {
      const installment = { practiceId: 'ID1', dossierId: 'DossierId', installment: 1 };

      let state = trigger(
        events.ADD_DOSSIER_INSTALLMENT,
        // @ts-ignore
        { status: statuses.OPENED, installments: [] },
        [installment],
      );
      expect(state.status).toBe(statuses.OPENED);
      expect(state.installments).toEqual([installment]);

      state = trigger(events.ADD_DOSSIER_INSTALLMENT, state, [installment]);

      expect(state.status).toBe(statuses.OPENED);
      expect(state.installments).toEqual([installment]);

      state = trigger(
        events.REMOVE_DOSSIER_INSTALLMENT,
        // @ts-ignore
        { status: statuses.OPENED, installments: [installment] },
        [installment],
      );
      expect(state.status).toBe(statuses.OPENED);
      expect(state.installments).toEqual([]);
    },
  );

  test('should move to "confirmed" state on "confirm" event from "opened" state', () => {
    const state = trigger(
      events.CONFIRM,
      // @ts-ignore
      { status: statuses.PROCESSING },
      {},
    );
    expect(state.status).toBe(statuses.CONFIRMED);
  });

  test('should move to "processing" state on "process" event from "opened" state', () => {
    const state = trigger(
      events.PROCESS,
      // @ts-ignore
      { status: statuses.OPENED },
      {},
    );
    expect(state.status).toBe(statuses.PROCESSING);
  });

  test('should move to "opened" state on "rollback" event from "opened-error" state', () => {
    const state = trigger(
      events.ROLLBACK,
      // @ts-ignore
      { status: statuses.OPENED_ERROR },
      {},
    );
    expect(state.status).toBe(statuses.ROLLBACKING);
  });

  test('should move to "rollbacking" state on "rollback-error" event from "processing" state', () => {
    const state = trigger(
      events.ROLLBACK_ERROR,
      // @ts-ignore
      { status: statuses.PROCESSING },
      {},
    );
    expect(state.status).toBe(statuses.ROLLBACKING_ERROR);
  });

  test('should move to "opened" state on "completed-rollback" event from "rollbacking" state', () => {
    const state = trigger(
      events.COMPLETED_ROLLBACK,
      // @ts-ignore
      { status: statuses.ROLLBACKING },
      {},
    );
    expect(state.status).toBe(statuses.OPENED);
  });

  test('should move to "closed" state on "close" event from "confirmed" state', () => {
    const state = trigger(
      events.CLOSE,
      // @ts-ignore
      { status: statuses.CONFIRMED },
      {},
    );
    expect(state.status).toBe(statuses.CLOSED);
  });

  test('should init state', () => {
    // @ts-ignore
    const state = initState({
      productivePeriodMonth: 9,
      productivePeriodYear: 2018,
    });
    expect(state.status).toBe(statuses.OPENED);
  });

  test('should error on invalid initial state', () => {
    const msg = 'Operazione non permessa';
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
        { status: statuses.CONFIRMED },
        {},
      ),
    ).toThrow(msg);
  });
});
