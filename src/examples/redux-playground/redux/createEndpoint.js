// /todos
// /todos/:id

import {
  takeLatest,
  takeEvery,
  put,
  call,
} from 'redux-saga/effects';
import { fetch } from '../../../services/api';
import {
  makeActions, makeActionTypes, makeKey, makeScopedActions, makeScopedActionTypes,
} from './utils';

const baseInitialState = {
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
  extractKey,
) => {
  const prefix = makeKey(basePrefix, name);
  const initialState = extractKey ? {} : baseInitialState;

  // Public Interface
  const actionTypes = makeActionTypes(
    ['REQUEST'],
    prefix,
  );
  const actions = makeActions(actionTypes);

  // Private Interface
  const sagaActionTypes = makeActionTypes([
    'INIT',
    'PENDING',
    'DONE',
    'ERROR',
  ], prefix);
  const sagaActions = extractKey
    ? makeScopedActions(sagaActionTypes)
    : makeActions(sagaActionTypes);

  const normalReducer = (
    state = initialState,
    { type, payload },
  ) => {
    switch (type) {
      case sagaActionTypes.INIT: return baseInitialState;
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

  const extractReducer = (
    state = initialState,
    { type, payload },
  ) => {
    if (!type.startsWith(prefix)) {
      return state;
    }
    const key = type.substr(type.lastIndexOf('/') + 1);
    const scopedActionTypes = makeScopedActionTypes(
      sagaActionTypes,
      key,
    );
    switch (type) {
      case scopedActionTypes.INIT: return {
        ...state,
        [key]: baseInitialState,
      };
      case scopedActionTypes.PENDING: return {
        ...state,
        [key]: {
          loading: true,
          loaded: false,
        },
      };
      case scopedActionTypes.DONE: return {
        ...state,
        [key]: {
          loading: false,
          loaded: true,
          data: payload,
        },
      };
      case scopedActionTypes.ERROR: return {
        ...state,
        [key]: {
          loading: false,
          loaded: true,
          error: payload,
        },
      };
      default: return state;
    }
  };

  const reducer = (extractKey
    ? extractReducer
    : normalReducer);

  function* doFetch({ payload }) {
    if (extractKey && !payload) {
      return;
    }
    const key = extractKey ? extractKey(payload) : undefined;
    const scopedSagaActions = key ? sagaActions(key) : sagaActions;
    yield put(scopedSagaActions.init());
    try {
      yield put(scopedSagaActions.pending());
      const result = yield call(
        fetch,
        extractKey ? `${endpoint}/${key}` : endpoint,
        {
          ...fetchOpts,
          body: payload,
        },
      );
      yield put(scopedSagaActions.done(result.data));
    } catch (error) {
      yield put(scopedSagaActions.error(error));
    }
  }

  function* hook() {
    if (extractKey) {
      yield takeEvery(
        ({ type }) => type.startsWith(actionTypes.REQUEST),
        doFetch,
      );
    } else {
      yield takeLatest(
        ({ type }) => type.startsWith(actionTypes.REQUEST),
        doFetch,
      );
    }
  }

  const selectData = extractKey
    ? (id) => ({ endpoints: { [name]: state } }) => (state[id]
      ? state[id].data
      : undefined
    )
    : ({ endpoints: { [name]: { data } } }) => data;

  return {
    reducer: { [name]: reducer },
    hook,
    actions,
    sagaActionTypes,
    selectors: {
      data: selectData,
    },
  };
};
