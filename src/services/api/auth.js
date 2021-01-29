import { ResponseError, patchedFetch } from './patch';

const queuedRequests = [];
let isRefreshing = false;

const queueFetch = (
  fetcher,
) => {
  let acceptHandler;
  let rejectHandler;

  const toResolve = new Promise(
    (accept, reject) => {
      acceptHandler = accept;
      rejectHandler = reject;
    },
  ).then(fetcher);

  return {
    toResolve,
    resolver: {
      accept: acceptHandler,
      reject: rejectHandler,
    },
  };
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

export const refresh = async () => {
  const oldJwt = localStorage.getItem('auth:token');
  localStorage.removeItem('auth:token');
  const { data: jwt } = await patchedFetch(
    '/token',
    {
      method: 'POST',
      jwt: oldJwt,
    },
  );
  localStorage.setItem('auth:token', jwt);
};

export const authFetch = async (
  url,
  {
    method,
    body,
  } = {},
) => {
  const fetcher = () => {
    const jwt = localStorage.getItem('auth:token');
    return patchedFetch(url, { method, body, jwt });
  };
  try {
    if (isRefreshing) {
      const { toResolve, resolver } = queueFetch(fetcher);
      queuedRequests.push(resolver);
      return toResolve;
    }
    return await fetcher();
  } catch (e) {
    if (e instanceof ResponseError && e.statusCode === 412) {
      isRefreshing = true;

      const { toResolve, resolver } = queueFetch(fetcher);
      queuedRequests.push(resolver);

      try {
        await refresh();
        queuedRequests.forEach(({ accept }) => accept());
      } catch (err) {
        queuedRequests.forEach(({ reject }) => reject(err));
      } finally {
        queuedRequests.length = 0;
        isRefreshing = false;
      }

      return toResolve;
    }
  }
  return undefined;
};

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-underscore-dangle
  window._auth = {
    fetch: authFetch,
    login,
    refresh,
  };
}
