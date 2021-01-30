// /todos
// /todos/:id

import {
  takeLatest,
  put,
  call,
} from 'redux-saga/effects';
import { fetch } from '../../../services/api';
import { makeActions, makeActionTypes, makeKey } from './utils';

const initialState = {
  loading: false,
  loaded: false,
  data: undefined,
  error: undefined,
};

export const basePrefix = 'endpoint';
export const createEndpoint = (
  name,
  endpoint,
  fetchOpts,
) => {
  const prefix = makeKey(basePrefix, name);

  // Public Interface
  const actionTypes = makeActionTypes(
    ['REQUEST'],
    prefix,
  );
  console.log(actionTypes);
  const actions = makeActions(actionTypes);

  // Private Interface
  const sagaActionTypes = makeActionTypes([
    'INIT',
    'PENDING',
    'DONE',
    'ERROR',
  ], prefix);
  const sagaActions = makeActions(sagaActionTypes);

  const reducer = (
    state = initialState,
    { type, payload },
  ) => {
    switch (type) {
      case sagaActionTypes.INIT: return initialState;
      case sagaActionTypes.PENDING: return {
        loading: true,
        loaded: false,
      };
      case sagaActionTypes.DONE: return {
        loading: false,
        loaded: true,
        data: payload,
      };
      case sagaActionTypes.ERROR: return {
        loading: false,
        loaded: true,
        error: payload,
      };
      default: return state;
    }
  };

  function* doFetch({ payload }) {
    yield put(sagaActions.init());
    try {
      yield put(sagaActions.pending());
      const result = yield call(
        fetch,
        endpoint,
        {
          ...fetchOpts,
          body: payload,
        },
      );
      yield put(sagaActions.done(result));
    } catch (error) {
      yield put(sagaActions.error(error));
    }
  }

  function* hook() {
    yield takeLatest(actionTypes.REQUEST, doFetch);
  }

  return {
    reducer: { [name]: reducer },
    hook,
    actions,
  };
};
