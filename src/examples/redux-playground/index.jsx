import { useMemo } from 'react';
import { Provider, useSelector } from 'react-redux';
import { todoIdsStore, store, todoStore } from './redux/testStore';

const TodoItem = ({ id }) => {
  const selector = useMemo(
    () => todoStore.selectors.data(id),
    [id],
  );
  const todo = useSelector(selector);
  return (
    todo ? <h1>{todo.text}</h1> : null
  );
};

const ReduxComponent = () => {
  const ids = useSelector(todoIdsStore.selectors.data);
  return (
    <>
      <h1>Stuffs</h1>
      {ids && ids.map((id) => (
        <TodoItem key={id} id={id} />
      ))}
    </>
  );
};

export default () => (
  <Provider store={store}>
    <ReduxComponent />
  </Provider>
);
