import * as types from '../const';

export default {
  logged: false,
  error: false,
  errorType: types.NO_ERROR,
  errorMessage: '',
  isFetching: false,
  _id: '',
  roleID: 0,
  username: '',
  token: '',
  token2fact: '',
  secret: '',
  qrcode: '',
  step: 'login',
};
