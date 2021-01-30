import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import {
  takeLatest, select, all, put,
} from 'redux-saga/effects';
import { hook, reducer } from './analyticsStore';
import { createEndpoint } from './createEndpoint';

export const todoIdsStore = createEndpoint('todoIds', '/todos');
export const todoStore = createEndpoint(
  'todos',
  '/todos',
  undefined,
  (id) => id,
);

function* loadTodos() {
  const ids = yield select(todoIdsStore.selectors.data);
  yield all(
    ids.map((id) => put(todoStore.actions.request(id))),
  );
}

function* hookLoadTodos() {
  yield takeLatest(todoIdsStore.sagaActionTypes.DONE, loadTodos);
}

const sagaMiddleware = createSagaMiddleware();
const endpointsReducer = combineReducers({
  ...todoIdsStore.reducer,
  ...todoStore.reducer,
});

const rootReducer = combineReducers({
  endpoints: endpointsReducer,
  analytics: reducer,
});

export const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(sagaMiddleware),
  ),
);

sagaMiddleware.run(todoIdsStore.hook);
sagaMiddleware.run(todoStore.hook);
sagaMiddleware.run(hookLoadTodos);
sagaMiddleware.run(function* runOnStart() {
  yield put(todoIdsStore.actions.request());
});
console.log(hook);
// sagaMiddleware.run(hook);
