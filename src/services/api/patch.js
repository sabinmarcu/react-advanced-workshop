export class ResponseError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}

export const patchedFetch = async (
  url,
  {
    method,
    body,
    jwt,
    ...rest
  } = {},
) => {
  const actualMethod = method || 'GET';
  const response = await fetch(
    url,
    {
      method: actualMethod,
      ...(actualMethod.toUpperCase() === 'GET'
        ? {}
        : { body: JSON.stringify(body) }
      ),
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(jwt
          ? { Authorization: `Bearer ${jwt}` }
          : {}
        ),
      },
    },
  );
  if (!response.ok) {
    const json = await response.json();
    throw new ResponseError(json.message, json.statusCode);
  }
  return response.json();
};

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-underscore-dangle
  window._fetch = patchedFetch;
}
