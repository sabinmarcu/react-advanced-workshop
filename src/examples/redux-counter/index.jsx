import {
  Button, ButtonGroup, Card, CardActions, CardHeader,
} from '@material-ui/core';
import { useCallback } from 'react';

import { Provider, useSelector, useDispatch } from 'react-redux';
import { valueSelector, actions } from './reducer';
import { store } from './store';

const CounterButtons = () => {
  const dispatch = useDispatch();
  const increment = useCallback(
    (value) => dispatch(actions.increment(value)),
    [dispatch],
  );
  const decrement = useCallback(
    (value) => dispatch(actions.decrement(value)),
    [dispatch],
  );
  const reset = useCallback(
    () => dispatch(actions.reset()),
    [dispatch],
  );
  return (
    <ButtonGroup>
      <Button onClick={() => decrement(5)}>-5</Button>
      <Button onClick={() => decrement(1)}>-1</Button>
      <Button onClick={() => reset()}>Reset</Button>
      <Button onClick={() => increment(1)}>+1</Button>
      <Button onClick={() => increment(5)}>+5</Button>
    </ButtonGroup>
  );
};

const Counter = () => {
  const counter = useSelector(valueSelector);
  return (
    <Card>
      <CardHeader
        title={counter}
        subheader="Counter Value"
      />
      <CardActions>
        <CounterButtons />
      </CardActions>
    </Card>
  );
};

export default () => (
  <Provider store={store}>
    <Counter />
  </Provider>
);
