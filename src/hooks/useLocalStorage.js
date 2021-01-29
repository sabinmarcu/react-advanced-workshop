import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { usePrevious } from './usePrevious';

export const useLocalStorage = (
  prefix,
  key,
  defaultValue,
) => {
  const oldKey = usePrevious(key);
  const [value, setValue] = useState();
  const lsKey = useMemo(
    () => (prefix
      ? `${prefix}:${key}`
      : key
    ),
    [prefix, key],
  );
  useEffect(
    () => {
      if (oldKey !== key) {
        const strVal = localStorage.getItem(lsKey);
        try {
          setValue(JSON.parse(strVal));
        } catch (e) {
          setValue(defaultValue);
        }
      }
    },
    [key, oldKey, lsKey, setValue, defaultValue],
  );
  useEffect(
    () => {
      const handler = ({
        storageArea,
        key: k,
        oldValue,
        newValue,
      }) => {
        const isLocalStorage = storageArea === localStorage;
        const isOwnKey = k === lsKey;
        const isEqual = oldValue === newValue;
        if (!(isOwnKey && isLocalStorage) || isEqual) {
          return;
        }
        try {
          setValue(JSON.parse(newValue));
        } catch (e) {
          console.error('Nope');
        }
      };
      window.addEventListener('storage', handler);
      return () => window.removeEventListener('storage', handler);
    },
    [lsKey, setValue],
  );
  const pushValue = useCallback(
    (val) => {
      const newValue = typeof val === 'function'
        ? val(value)
        : val;
      setValue(newValue);
      localStorage.setItem(lsKey, newValue);
    },
    [lsKey, value, setValue],
  );
  return [value, pushValue];
};

/**
 * useLocalStorage('token', undefined, 'auth')
 * useLocalStorage('token')(undefined)('auth')
 *
 * const useAuthLocalStorage = useLocalStorage.bind({}, 'auth')
 * useAuthLocalStorage('token')
 */
