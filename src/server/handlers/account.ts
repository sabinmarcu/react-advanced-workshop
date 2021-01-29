import { rest } from 'msw';
import { decodeJWT, withValidation } from './auth';
import { wrapSuccess } from './utils';

export const handlers = [
  rest.get('/me', withValidation((req, res, ctx) => res(
    ...wrapSuccess(ctx, decodeJWT(req)),
  ))),
];
