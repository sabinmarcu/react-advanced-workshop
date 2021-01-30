import {
  createContext, useCallback, useContext, useEffect, useState,
} from 'react';
import { login, verify } from '../../../services/api';
import { useFetch } from '../hooks/useFetch';
import { useForbiddenHandler } from './forbiddenHandler';

export const useAuthStore = () => {
  const [, setForbiddenHandler] = useForbiddenHandler();
  const [user, setUser] = useState();
  const [error, setError] = useState();
  const [userState, fetchUser] = useFetch(
    '/me',
  );

  const reset = useCallback(
    () => {
      setUser(undefined);
      setError(undefined);
    },
    [setUser, setError],
  );

  useEffect(
    () => {
      console.log('Setting forbidden handler', { setForbiddenHandler, reset });
      setForbiddenHandler(() => reset);
    },
    [setForbiddenHandler, reset],
  );

  const onLogin = useCallback(
    async ({ email, password }) => {
      setUser(undefined);
      setError(undefined);
      try {
        await login(email, password);
        await fetchUser();
      } catch (e) {
        setError(e);
      }
    },
    [setUser, setError, fetchUser],
  );

  useEffect(
    () => {
      const { data, isLoaded } = userState;
      if (isLoaded && data) {
        setUser(data.data.user);
      }
    },
    [userState, setUser],
  );

  const [hasInit, setHasInit] = useState(false);
  useEffect(
    () => {
      if (!hasInit) {
        setHasInit(true);
        verify()
          .then(() => {
            fetchUser();
          })
          .catch(() => {
            // don't care
          });
      }
    },
    [fetchUser, hasInit, setHasInit],
  );

  return {
    onLogin,
    user,
    error,
  };
};

const AuthContext = createContext({
  onLogin: () => {
    throw new Error('No provider');
  },
  user: undefined,
  error: undefined,
});

export const AuthProvider = ({ children }) => {
  const store = useAuthStore();
  return (
    <AuthContext.Provider value={store}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const useUser = () => useAuth().user;
export const useAuthError = () => useAuth().error;
export const useLogin = () => useAuth().onLogin;
