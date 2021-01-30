const prefix = 'counter';

// counter/INCREMENT counter/DECREMENT

const makeKey = (pf, key) => [pf, key].join('/');

export const actionTypes = [
  'INCREMENT',
  'DECREMENT',
  'RESET',
].reduce(
  (prev, key) => ({
    ...prev,
    [key]: makeKey(prefix, key),
  }),
  {},
);

export const actions = Object.entries(actionTypes)
  .reduce(
    (prev, [key, action]) => ({
      ...prev,
      [key.toLowerCase()]: (payload) => ({ type: action, payload }),
    }),
    {},
  );

export const initialState = { value: 0 };
export const reducer = (
  state = initialState,
  { type, payload },
) => {
  switch (type) {
    case actionTypes.INCREMENT: return { value: state.value + payload };
    case actionTypes.DECREMENT: return { value: state.value - payload };
    case actionTypes.RESET: return initialState;
    default: return state;
  }
};

export const valueSelector = ({ value }) => value;
