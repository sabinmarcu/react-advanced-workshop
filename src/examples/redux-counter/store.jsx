import {
  createStore,
} from 'redux';
import {
  Provider as ReduxProvider,
  createDispatchHook,
  createSelectorHook,
} from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createContext } from 'react';
import { reducer } from './reducer';

export const createCounter = () => {
  const Context = createContext();
  const store = createStore(
    reducer,
    composeWithDevTools(),
  );

  const Provider = ({ children }) => (
    <ReduxProvider store={store} context={Context}>
      {children}
    </ReduxProvider>
  );

  const useDispatch = createDispatchHook(Context);
  const useSelector = createSelectorHook(Context);

  return {
    Provider,
    Context,
    useDispatch,
    useSelector,
  };
};
