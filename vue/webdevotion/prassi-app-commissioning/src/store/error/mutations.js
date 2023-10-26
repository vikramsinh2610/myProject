import * as types from '../const';

export const startRequest = (state) => {
  state.error = false;
  state.errorType = types.NO_ERROR;
  state.errorMessage = '';
  state.isFetching = true;
  state.errorNotFound = false;
};

export const resetError = (state) => {
  state.error = false;
  state.errorType = types.NO_ERROR;
  state.errorMessage = '';
  state.isFetching = false;
  state.errorNotFound = false;
};

export const errorConnection = (state) => {
  state.error = true;
  state.isFetching = false;
  state.errorType = types.ERROR_CONNECTION;
  state.errorMessage = '';
  state.errorNotFound = false;
};

export const errorInternal = (state, { message, status }) => {
  state.error = true;
  state.isFetching = false;
  state.errorType = types.ERROR_INTERNAL;
  state.errorMessage = message;
  state.errorNotFound = status === 404;
};

export const setNetwork = (state, connection) => {
  state.network = connection;
};
