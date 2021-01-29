import { useCallback, useMemo, useState } from 'react';

const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

export const isRequired = (value) => (!value
  ? 'required'
  : undefined
);

export const isEmail = (value) => (!emailRegex.test(value)
  ? 'should be a valid email'
  : undefined
);

export const useField = (
  name,
  validators = [],
  defaultValue = '',
) => {
  const [value, setValue] = useState(defaultValue);
  const [isDirty, setIsDirty] = useState(false);

  const onChange = useCallback(
    ({ target: { value: newValue } }) => {
      if (!isDirty) {
        setIsDirty(true);
      }
      setValue(newValue);
    },
    [setValue, setIsDirty, isDirty],
  );

  const errors = useMemo(
    () => (isDirty
      ? validators.map(
        (validator) => validator(value),
      ).filter(Boolean)
      : []),
    [validators, value, isDirty],
  );

  const isValid = useMemo(
    () => (isDirty ? errors.length === 0 : false),
    [errors],
  );

  const reset = useCallback(
    () => {
      setIsDirty(false);
      setValue(defaultValue);
    },
    [setIsDirty, setValue, defaultValue],
  );

  return {
    value,
    isDirty,
    isValid,
    formData: {
      name,
      value,
      isDirty,
      isValid,
      reset,
    },
    textField: {
      value,
      onChange,
      error: isDirty && !isValid,
    },
  };
};
