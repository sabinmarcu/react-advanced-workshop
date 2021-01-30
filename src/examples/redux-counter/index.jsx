import {
  Button, ButtonGroup, Card, CardActions, CardHeader,
} from '@material-ui/core';
import { useCallback } from 'react';
import { valueSelector, actions } from './reducer';
import { createCounter } from './store';

const createCounterRender = (name) => {
  const {
    Provider,
    Context,
    useSelector,
    useDispatch,
  } = createCounter();

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

  const Counter = ({ children }) => {
    const counter = useSelector(valueSelector);
    return (
      <>
        <Card>
          <CardHeader
            title={counter}
            subheader={`${name}: Counter Value`}
          />
          <CardActions>
            <CounterButtons />
          </CardActions>
        </Card>
        {children}
      </>
    );
  };

  const Component = (props) => (
    <Provider>
      <Counter {...props} />
    </Provider>
  );

  return { Component, Context };
};

const Counter1 = createCounterRender('First');
const Counter2 = createCounterRender('Second');

export default () => (
  <Counter1.Component>
    <Counter2.Component>
      <Counter1.Context.Consumer>
        {({ store: { dispatch } }) => (
          <Card>
            <CardHeader title="Modify First Counter:" />
            <CardActions>
              <ButtonGroup>
                <Button onClick={() => dispatch(actions.decrement(5))}>-5</Button>
                <Button onClick={() => dispatch(actions.decrement(1))}>-1</Button>
                <Button onClick={() => dispatch(actions.reset())}>Reset</Button>
                <Button onClick={() => dispatch(actions.increment(1))}>+1</Button>
                <Button onClick={() => dispatch(actions.increment(5))}>+5</Button>
              </ButtonGroup>
            </CardActions>
          </Card>
        )}
      </Counter1.Context.Consumer>
    </Counter2.Component>
  </Counter1.Component>
);
