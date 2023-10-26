const { trigger, initState } = require('./letter-fsm');
const { statuses } = require('./letter-statuses');
const { events } = require('./letter-events');

describe('Letter FSM', () => {
  test('should move to "active" state on "activate" event from "wip" state', () => {
    const state = {
      status: statuses.WIP,
    };
    // @ts-ignore
    const nextState = trigger(events.ACTIVATE, state);
    expect(nextState.status).toBe(statuses.ACTIVE);
  });

  test('should move to "inactive" state on "inactivate" event from "active" state', () => {
    const state = {
      status: statuses.ACTIVE,
    };
    // @ts-ignore
    const nextState = trigger(events.INACTIVATE, state);
    expect(nextState.status).toBe(statuses.INACTIVE);
  });
  test('should move to "deleted" state on "delete" event from "wip" state', () => {
    const state = {
      status: statuses.WIP,
    };
    // @ts-ignore
    const nextState = trigger(events.DELETE, state);
    expect(nextState.status).toBe(statuses.DELETED);
  });

  test('should move to "expired" state on "expires" event from "active" state', () => {
    const state = {
      status: statuses.ACTIVE,
    };
    // @ts-ignore
    const nextState = trigger(events.EXPIRES, state);
    expect(nextState.status).toBe(statuses.EXPIRED);
  });

  test('should init state', () => {
    // @ts-ignore
    const state = initState({});
    expect(state.status).toBe(statuses.WIP);
  });

  test('should error on invalid initial state', () => {
    const msg = 'Invalid transaction';
    // @ts-ignore
    expect(() => trigger(events.ACTIVATE, { status: 'fake-state' })).toThrow(msg);
  });

  test('should error on invalid event', () => {
    const event = 'fake-event';
    const msg = 'Invalid event fake-event';
    // @ts-ignore
    expect(() => trigger(event, { status: statuses.WIP })).toThrow(msg);
  });
});
