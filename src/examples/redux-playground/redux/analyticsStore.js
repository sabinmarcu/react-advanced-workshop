import { takeEvery, put } from 'redux-saga/effects';
import { makeActions, makeActionTypes } from './utils';
import { basePrefix } from './createEndpoint';

const initialState = { done: 0, error: 0, request: 0 };

const sagaActionTypes = makeActionTypes(
  [
    'COUNT',
    'RESET',
  ],
  'analytics',
);
export const sagaActions = makeActions(sagaActionTypes);

export const reducer = (
  state = initialState,
  { type, payload },
) => {
  switch (type) {
    case sagaActionTypes.COUNT:
      if (payload.done) {
        return { ...state, done: state.done + 1 };
      }
      if (payload.error) {
        return { ...state, error: state.error + 1 };
      }
      if (payload.request) {
        return { ...state, request: state.request + 1 };
      }
      return state;
    case sagaActionTypes.RESET: return initialState;
    default: return state;
  }
};

function* count(place) {
  yield put(sagaActions.count(place));
}

export function* hook() {
  yield takeEvery(
    (action) => action.type.startsWith(basePrefix)
      && action.type.endsWith('DONE'),
    count,
    { done: true },
  );
  yield takeEvery(
    (action) => action.type.startsWith(basePrefix)
      && action.type.endsWith('ERROR'),
    count,
    { error: true },
  );
  yield takeEvery(
    (action) => action.type.startsWith(basePrefix)
      && action.type.endsWith('REQUEST'),
    count,
    { request: true },
  );
}
