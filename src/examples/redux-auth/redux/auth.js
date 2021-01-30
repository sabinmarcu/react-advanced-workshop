import { put, call, takeLatest } from 'redux-saga/effects';
import { makeActions, makeActionTypes } from './utils';
import { login, verify, fetch } from '../../../services/api';

const initState = {
  user: undefined,
  error: undefined,
  stage: 'init',
};

const actionTypes = makeActionTypes([
  'LOGIN',
  'LOGOUT',
  'REQUEST_VERIFY',
], 'auth');
export const actions = makeActions(actionTypes);
export const sagaActionTypes = makeActionTypes([
  'RESET',
  'LOGIN_SUCCESS',
  'FETCHING_USER',
  'ERROR',
  'SAVE_USER',
  'VERIFYING',
  'VERIFY_SUCCESS',
], 'auth');
export const sagaActions = makeActions(sagaActionTypes);

export const reducer = (
  state = { initState },
  { type, payload },
) => {
  switch (type) {
    case sagaActionTypes.RESET: return initState;
    case sagaActionTypes.FETCHING_USER: return {
      ...state,
      stage: 'fetchingUser',
    };
    case sagaActionTypes.VERIFYING: return {
      ...state,
      stage: 'verifying',
    };
    case sagaActionTypes.ERROR: return {
      ...state,
      stage: 'error',
      error: payload,
    };
    case sagaActionTypes.SAVE_USER: return {
      ...state,
      stage: 'done',
      user: payload,
    };
    default: return state;
  }
};

function* loginSaga({ payload: { email, password } }) {
  yield put(sagaActions.reset());
  try {
    yield call(login, email, password);
    yield put(sagaActions.login_success());
  } catch (error) {
    yield put(sagaActions.error(error.message));
  }
}

function* fetchUserSaga() {
  yield put(sagaActions.fetching_user());
  try {
    const data = yield call(fetch, '/me');
    yield put(sagaActions.save_user(data.data.user));
  } catch (error) {
    yield put(sagaActions.error(error.message));
  }
}

function* verifyLoginSaga() {
  yield put(sagaActions.verifying());
  try {
    yield call(verify);
    yield put(sagaActions.verify_success());
  } catch (e) {
    yield put(sagaActions.verify_fail());
  }
}

function* resetSaga() {
  yield put(sagaActions.reset());
}

export function* hook() {
  yield takeLatest(actionTypes.LOGIN, loginSaga);
  yield takeLatest(actionTypes.REQUEST_VERIFY, verifyLoginSaga);
  yield takeLatest(sagaActionTypes.LOGIN_SUCCESS, fetchUserSaga);
  yield takeLatest(sagaActionTypes.VERIFY_SUCCESS, fetchUserSaga);
  yield takeLatest(actionTypes.LOGOUT, resetSaga);
}
