export const makeKey = (pf, key) => [pf, key].join('/');

export const makeActionTypes = (
  actionTypes,
  prefix,
) => actionTypes
  .reduce(
    (prev, key) => ({
      ...prev,
      [key]: makeKey(prefix, key),
    }),
    {},
  );

export const makeScopedActionTypes = (
  actionTypes,
  key,
) => Object.entries(actionTypes)
  .reduce(
    (prev, [actionKey, action]) => ({
      ...prev,
      [actionKey]: makeKey(action, key),
    }),
    {},
  );

export const makeActions = (
  actionTypes,
) => Object.entries(actionTypes)
  .reduce((prev, [key, action]) => ({
    ...prev,
    [key.toLowerCase()]: (payload) => ({ type: action, payload }),
  }),
  {});

export const makeScopedActions = (actionTypes) => (
  (key) => Object.entries(actionTypes)
    .reduce((prev, [actionKey, action]) => ({
      ...prev,
      [actionKey.toLowerCase()]: (payload) => ({
        type: makeKey(action, key),
        payload,
      }),
    }),
    {}));
