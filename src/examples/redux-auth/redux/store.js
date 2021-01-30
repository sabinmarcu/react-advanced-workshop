import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { hook, reducer } from './auth';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = composeWithDevTools({
  name: 'Auth Example',
});

export const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(sagaMiddleware),
  ),
);

sagaMiddleware.run(hook);
