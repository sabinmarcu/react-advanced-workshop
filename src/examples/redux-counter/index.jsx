import {
  Button, ButtonGroup, Card, CardActions, CardContent, CardHeader, Typography,
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

  return { Component, Context, useSelector };
};

const Counter1 = createCounterRender('First');
const Counter2 = createCounterRender('Second');

const makeAllCounterValues = (
  C1,
  C2,
) => {
  const useFirstCounter = C1.useSelector;
  const useSecondCounter = C2.useSelector;
  const AllCounterValues = () => {
    const counter1 = useFirstCounter(valueSelector);
    const counter2 = useSecondCounter(valueSelector);
    return (
      <Card>
        <CardContent>
          <Typography>{`First: ${counter1}`}</Typography>
          <Typography>{`Second: ${counter2}`}</Typography>
        </CardContent>
      </Card>
    );
  };
  return AllCounterValues;
};

const Debug = makeAllCounterValues(Counter1, Counter2);

export default () => (
  <Counter1.Component>
    <Counter2.Component>
      <Counter1.Context.Consumer>
        {({ store: { dispatch } }) => (
          <>
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
            <Debug />
          </>
        )}
      </Counter1.Context.Consumer>
    </Counter2.Component>
  </Counter1.Component>
);
