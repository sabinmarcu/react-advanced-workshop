import { rest } from 'msw';
import type { MockedRequest, ResponseResolver, RestContext } from 'msw';
import type { DefaultRequestBodyType, RequestParams } from 'msw/lib/types/utils/handlers/requestHandler';

import jwt, { TokenExpiredError } from 'jsonwebtoken';

import { nanoid } from 'nanoid';
import type { SanitizedUser, User, UserData } from '../types';
import { UserPrivateMembers } from '../types';

import {
  getJWTFromHeader,
  wrapError,
  wrapSuccess,
} from './utils';
import {
  accounts,
  config,
  refreshTokens,
} from './cache';

/** Base Config */
config.set('jwtSecret', 'super-secret-key');
config.set('expiry', localStorage.getItem('config:token:expiry') || '10s');

/** Seed Data */
accounts.set(
  'a@b.com',
  { password: 'test' },
);

const stripUserKeys = Object.keys(UserPrivateMembers);
const stripUser = (user: User): SanitizedUser => (
  Object.entries(user)
    .filter(([key]) => !stripUserKeys.includes(key))
    .reduce((
      prev: Partial<SanitizedUser>,
      [key, value]: [string, string],
    ) => ({
      ...prev,
      [key]: value,
    }),
    {} as Partial<SanitizedUser>) as SanitizedUser
);

// eslint-disable-next-line max-len
type HandlerType<T extends any = {}> = ResponseResolver<MockedRequest<DefaultRequestBodyType, RequestParams & T>, RestContext, any>;
export const withValidation = (
  handler: HandlerType,
): HandlerType => (req, res, ctx) => {
  let token;
  let data;
  try {
    token = getJWTFromHeader(req);
  } catch (e) {
    return res(
      ...wrapError(
        ctx,
        e,
        401,
      ),
    );
  }
  try {
    data = jwt.verify(token, config.get('jwtSecret')!);
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      return res(
        ...wrapError(
          ctx,
          e,
          412,
        ),
      );
    }
    return res(
      ...wrapError(
        ctx,
        e,
        403,
      ),
    );
  }

  // @ts-ignore;
  req.jwt = data;
  return handler(req, res, ctx);
};

export const decodeJWT = (
  req: MockedRequest<DefaultRequestBodyType, RequestParams>,
) => {
  // @ts-ignore
  const { jwt: data } = req as { jwt?: any };
  if (!data) {
    throw new Error('JWT not present (must validate before access)');
  }
  return data;
};

const createToken = (
  email: string,
  user: UserData,
) => {
  const refreshToken = nanoid();
  refreshTokens.set(refreshToken, email);
  const token = jwt.sign(
    {
      refreshToken,
      user: stripUser({
        email,
        ...user,
      }),
    },
    config.get('jwtSecret')!,
    { expiresIn: config.get('expiry')! },
  );
  return token;
};

export const handlers = [

  rest.post('/login', (req, res, ctx) => {
    const { email, password } = (
      typeof req.body === 'string'
        ? JSON.parse(req.body)
        : req.body
    );
    const user = accounts.get(email);
    if (!user) {
      return res(
        ...wrapError(
          ctx,
          new Error('User not found'),
          404,
        ),
      );
    }
    if (user.password !== password) {
      return res(
        ...wrapError(
          ctx,
          new Error('Password invalid'),
          403,
        ),
      );
    }
    return res(
      ...wrapSuccess(ctx, createToken(email, user)),
    );
  }),

  rest.post('/token', async (req, res, ctx) => {
    let token;
    try {
      token = getJWTFromHeader(req);
    } catch (e) {
      return res(
        ...wrapError(
          ctx,
          e,
          401,
        ),
      );
    }

    try {
      await jwt.verify(token, config.get('jwtSecret')!);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        const { refreshToken } = jwt.decode(token) as Record<string, any>;
        const email = refreshTokens.get(refreshToken);
        if (!email) {
          return res(
            ...wrapError(
              ctx,
              new Error('Refresh token not found'),
              404,
            ),
          );
        }
        refreshTokens.remove(refreshToken);
        const user = accounts.get(email);
        if (!user) {
          return res(
            ...wrapError(
              ctx,
              new Error('User not found'),
              404,
            ),
          );
        }
        return res(
          ...wrapSuccess(ctx, createToken(email, user)),
        );
      }
      return res(
        ...wrapError(
          ctx,
          e,
          403,
        ),
      );
    }

    return res(
      ...wrapSuccess(ctx, token),
    );
  }),

];
