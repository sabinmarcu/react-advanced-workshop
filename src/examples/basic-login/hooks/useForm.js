import { useCallback, useMemo } from 'react';

export const useForm = (
  onSubmit,
  fields,
) => {
  const isDirty = useMemo(
    () => fields.some(({
      isDirty: fieldIsDirty,
    }) => fieldIsDirty),
    [fields],
  );
  const isValid = useMemo(
    () => fields.every(({
      isValid: fieldIsValid,
    }) => fieldIsValid),
    [fields],
  );
  const reset = useCallback(
    () => {
      if (isDirty) {
        fields.forEach(({ reset: resetField }) => resetField());
      }
    },
    [fields],
  );
  const submitHandler = useCallback(
    () => {
      if (isValid) {
        return onSubmit(
          fields.reduce(
            (prev, { name, value }) => ({
              ...prev,
              [name]: value,
            }),
            {},
          ),
        );
      }
      return undefined;
    },
    [isValid, fields],
  );
  return {
    isValid,
    isDirty,
    reset,
    onSubmit: submitHandler,
  };
};
