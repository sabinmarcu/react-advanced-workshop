export type User = {
  email: string,
  password: string
};

export type UserData = Omit<User, 'email'>;

export const UserPrivateMembers = {
  password: true,
};

export type SanitizedUser = Omit<User, keyof typeof UserPrivateMembers>;

export type CacheType<T> = {
  get: (key: string) => T | undefined
  set: (key: string, value: T) => void
  remove: (key: string) => void
  keys: () => string[]
};

export type Todo = {
  text: string,
  done: boolean,
};
