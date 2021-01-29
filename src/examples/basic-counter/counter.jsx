import {
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
  useDebugValue,
} from 'react';

export const useCounterProvider = (defaultValue = 0) => {
  const [counter, setCounter] = useState(defaultValue);
  const increment = useCallback(
    (value) => setCounter((cnt) => cnt + value),
    [setCounter],
  );
  const decrement = useCallback(
    (value) => setCounter((cnt) => cnt - value),
    [setCounter],
  );
  const reset = useCallback(
    () => setCounter(defaultValue),
    [setCounter, defaultValue],
  );
  useEffect(
    () => {
      // eslint-disable-next-line no-undef
      document.title = `Counter: ${counter}`;
    },
    [counter],
  );
  useDebugValue(counter);
  return {
    counter,
    increment,
    decrement,
    reset,
  };
};

const CounterContext = createContext({
  counter: 0,
  increment: () => { throw new Error('No value provided to context'); },
  decrement: () => { throw new Error('No value provided to context'); },
  reset: () => { throw new Error('No value provided to context'); },
});

export const CounterProvider = ({ children }) => {
  const value = useCounterProvider();
  return (
    <CounterContext.Provider value={value}>
      {children}
    </CounterContext.Provider>
  );
};

export const useCounter = () => useContext(CounterContext);

export const useCounterValue = () => useCounter().counter;

export const useCounterIncrement = () => useCounter().increment;
export const useCounterDecrement = () => useCounter().decrement;
export const useCounterReset = () => useCounter().reset;

export const withCounter = (ComposedComponent) => (props) => {
  const { counter, ...functions } = useCounter();
  return (
    <ComposedComponent {...{ ...props, counter, functions }} />
  );
};

// export const withCounterWithConsumer = (ComposedComponent) => (props) => (
//   <CounterContext.Consumer>
//     {({ counter, ...functions }) => (
//       <ComposedComponent {...{ ...props, counter, functions }} />
//     )}
//   </CounterContext.Consumer>
// );

// export const withCounterWithClass = (ComposedComponent) =>
//   class CounterWrapper extends Component {
//     static contextType = CounterContext;
//     render() {
//       const { counter, ...functions } = this.context;
//       return (
//         <ComposedComponent {...{...this.props, counter, functions }} />
//       )
//     }
//   };
