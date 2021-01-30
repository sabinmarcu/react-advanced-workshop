import type { MockedRequest, RestContext } from 'msw/lib/types';
import type { DefaultRequestBodyType, RequestParams } from 'msw/lib/types/utils/handlers/requestHandler';
import type { CacheType } from '../types';

export const wrapError = (
  ctx: RestContext,
  error: Error,
  statusCode: number,
) => [
  ctx.status(statusCode),
  ctx.json({
    success: false,
    statusCode,
    stack: error.stack || 'unknown',
    message: error.message || `${error}`,
    _raw: error,
  }),
];

export const wrapSuccess = (
  ctx: RestContext,
  data: any,
  statusCode = 200,
) => [
  ctx.status(statusCode),
  ctx.json({
    success: true,
    statusCode,
    data,
  }),
];

export const getJWTFromHeader = (
  req: MockedRequest<DefaultRequestBodyType, RequestParams>,
) => {
  const authorization = req.headers.get('authorization');
  if (!authorization) {
    throw new Error('No authorization provided');
  }
  const match = authorization.match(
    /Bearer (.+)/,
  );
  if (!match) {
    throw new Error('Authorization malformed');
  }
  return match[1];
};

export const mergeKey = (
  prefix: string,
  key: string,
) => `${prefix}:${key}`;

export const makeCacheObject = <T>(prefix: string): CacheType<T> => {
  const get = (key: string): T | undefined => {
    const val = localStorage.getItem(
      mergeKey(prefix, key),
    );
    if (val) {
      return JSON.parse(val) as T;
    }
    return undefined;
  };
  const set = (key: string, value: T) => {
    localStorage.setItem(
      mergeKey(prefix, key),
      JSON.stringify(value),
    );
  };
  const remove = (key: string) => {
    localStorage.removeItem(
      mergeKey(prefix, key),
    );
  };
  const keys = () => Object.keys(localStorage)
    .filter((it) => it.startsWith(prefix))
    .map((it) => it.replace(`${prefix}:`, ''));

  return {
    get,
    set,
    remove,
    keys,
  };
};

export const makeCache = <T extends any = string>(
  name: string,
) => makeCacheObject<T>(mergeKey('cache', name));
