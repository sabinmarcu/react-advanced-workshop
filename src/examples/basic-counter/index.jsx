import {
  Button, ButtonGroup, Card, CardActions, CardHeader,
} from '@material-ui/core';
import { CounterProvider, useCounterValue, withCounter } from './counter';

const CounterButtons = withCounter(
  ({ functions: { increment, decrement, reset } }) => (
    <ButtonGroup>
      <Button onClick={() => decrement(1)}>-1</Button>
      <Button onClick={() => decrement(5)}>-5</Button>
      <Button onClick={() => reset()}>Reset</Button>
      <Button onClick={() => increment(1)}>+1</Button>
      <Button onClick={() => increment(5)}>+5</Button>
    </ButtonGroup>
  ),
);

const Counter = () => {
  const counter = useCounterValue();
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
  <CounterProvider>
    <Counter />
  </CounterProvider>
);
