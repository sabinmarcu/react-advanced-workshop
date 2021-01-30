import { handlers as authHandlers } from './auth';
import { handlers as accountHandlers } from './account';
import { handlers as todosHandlers } from './todos';

export const handlers = [
  ...authHandlers,
  ...accountHandlers,
  ...todosHandlers,
];
