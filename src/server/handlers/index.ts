import { handlers as authHandlers } from './auth';
import { handlers as accountHandlers } from './account';

export const handlers = [
  ...authHandlers,
  ...accountHandlers,
];
