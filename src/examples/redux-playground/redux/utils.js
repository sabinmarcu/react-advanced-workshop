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

export const makeActions = (
  actionTypes,
) => Object.entries(actionTypes)
  .reduce((prev, [key, action]) => ({
    ...prev,
    [key.toLowerCase()]: (payload) => ({ type: action, payload }),
  }),
  {});
