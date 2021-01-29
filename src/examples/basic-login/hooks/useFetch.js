import { useCallback, useReducer } from 'react';
import { fetch } from '../../../services/api';

const actions = [
  'init',
  'pending',
  'done',
  'error',
].reduce(
  (prev, key) => ({
    ...prev,
    [key]: key,
  }),
  {},
);

export const useFetch = (
  url,
  fetchOpts = {},
) => {
  const [state, dispatch] = useReducer(
    (_, action) => {
      const { type, payload } = action;
      switch (type) {
        case actions.init: return {
          isLoading: false,
          isLoaded: false,
        };
        case actions.pending: return {
          isLoading: true,
          isLoaded: false,
        };
        case actions.done: return {
          isLoading: false,
          isLoaded: true,
          data: payload,
        };
        case actions.error: return {
          isLoading: false,
          isLoaded: true,
          error: payload,
        };
        default: throw new Error('unknown action');
      }
    },
    {
      isLoading: false,
      isLoaded: false,
    },
  );
  const fetchHandler = useCallback(
    (body) => new Promise((accept, reject) => {
      dispatch({ type: actions.init });
      fetch(
        url,
        {
          ...fetchOpts,
          body,
        },
      ).then(async (data) => {
        await new Promise((acc) => setTimeout(acc, 1000));
        dispatch({ type: actions.done, payload: data });
        accept(data);
      }).catch((error) => {
        dispatch({ type: actions.error, payload: error });
        reject(error);
      });
      dispatch({ type: actions.pending });
    }),
    [url, fetchOpts],
  );
  return [state, fetchHandler];
};
