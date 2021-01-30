import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { hook, reducer } from './analyticsStore';
import { createEndpoint } from './createEndpoint';

export const echoStore = createEndpoint('todoIds', '/todos');

const sagaMiddleware = createSagaMiddleware();
const endpointsReducer = combineReducers({
  ...echoStore.reducer,
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

sagaMiddleware.run(echoStore.hook);
sagaMiddleware.run(hook);
