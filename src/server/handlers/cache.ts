import type { UserData } from '../types';
import { makeCache } from './utils';

export const accounts = makeCache<UserData>('accounts');
export const refreshTokens = makeCache('refreshTokens');
export const config = makeCache('config');
