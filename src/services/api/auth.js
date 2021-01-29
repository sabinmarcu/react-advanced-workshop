import { patchedFetch } from './patch';

export const authFetch = (
  url,
  {
    method,
    body,
  } = {},
) => {
  const jwt = localStorage.getItem('auth:token');
  return patchedFetch(url, { method, body, jwt });
};

export const login = async (
  email,
  password,
) => {
  localStorage.removeItem('auth:token');
  const { data: jwt } = await patchedFetch(
    '/login',
    {
      method: 'POST',
      body: { email, password },
    },
  );
  localStorage.setItem('auth:token', jwt);
};

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-underscore-dangle
  window._auth = {
    fetch: authFetch,
    login,
  };
}
