import { startRequest, errorConnection, errorInternal, resetError } from './mutations';
import * as types from '../const';

test('startRequest change isFetching to true', () => {
  const state = {
    error: false,
    errorType: types.NO_ERROR,
    errorMessage: '',
    errorNotFound: false,
    isFetching: false,
  };

  startRequest(state);
  expect(state.isFetching).toBe(true);
});

test('resetError change isFetching to false', () => {
  const state = {
    error: true,
    errorType: types.NO_ERROR,
    errorMessage: '',
    errorNotFound: false,
    isFetching: true,
  };

  resetError(state);
  expect(state.isFetching).toBe(false);
  expect(state.error).toBe(false);
});

test('errorConnection change error to true', () => {
  const state = {
    error: false,
    errorType: types.NO_ERROR,
    errorMessage: '',
    errorNotFound: false,
    isFetching: false,
  };

  errorConnection(state);
  expect(state.error).toBe(true);
  expect(state.errorType).toEqual(types.ERROR_CONNECTION);
});

test('errorInternal change error to true', () => {
  const state = {
    error: false,
    errorType: types.NO_ERROR,
    errorMessage: '',
    errorNotFound: false,
    isFetching: false,
  };

  errorInternal(state, { message: 'custom error', status: 404 });
  expect(state.error).toBe(true);
  expect(state.errorType).toEqual(types.ERROR_INTERNAL);
  expect(state.errorMessage).toEqual('custom error');
});
