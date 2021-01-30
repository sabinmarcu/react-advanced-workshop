import { rest } from 'msw';
import { Todo } from '../types';
import { makeCache, wrapError, wrapSuccess } from './utils';

const todos = makeCache<Todo>('todos');
todos.set('1', { text: 'This is awesome', done: false });
todos.set('2', { text: 'This is not really awesome', done: true });

export const handlers = [
  rest.get('/todos', (_, res, ctx) => res(
    ...wrapSuccess(ctx, todos.keys()),
  )),
  rest.get('/todos/:id', (req, res, ctx) => {
    const todo = todos.get(req.params.id);
    if (todo) {
      return res(
        ...wrapSuccess(ctx, todo),
      );
    }
    return res(
      ...wrapError(
        ctx,
        new Error('Todo not found!'),
        404,
      ),
    );
  }),
];
