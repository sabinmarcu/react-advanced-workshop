import { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { echoStore, store } from './redux/testStore';

const ReduxComponent = () => {
  const dispatch = useDispatch();
  const ids = useSelector(echoStore.selectors.data);
  useEffect(
    () => {
      dispatch(echoStore.actions.request());
    },
    [],
  );
  return (
    <>
      <h1>Stuffs</h1>
      <code>{JSON.stringify(ids)}</code>
    </>
  );
};

export default () => (
  <Provider store={store}>
    <ReduxComponent />
  </Provider>
);
