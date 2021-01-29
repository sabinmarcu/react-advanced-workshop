import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  CircularProgress,
} from '@material-ui/core';
import { useCallback, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { isEmail, useField, isRequired } from '../hooks/useField';
import { useForm } from '../hooks/useForm';

export const LoginForm = () => {
  const {
    textField: emailField,
    formData: emailFormData,
  } = useField(
    'email',
    [
      isRequired,
      isEmail,
    ],
  );

  const {
    textField: passwordField,
    formData: passwordFormData,
  } = useField(
    'password',
    [
      isRequired,
    ],
  );

  const {
    state: {
      isLoading,
      isLoaded,
      data,
    },
    fetch,
  } = useFetch(
    '/echo',
    {
      method: 'POST',
      mode: 'no-cors',
    },
  );

  const submitHandler = useCallback(
    (body) => fetch(body),
    [fetch],
  );

  useEffect(
    () => {
      if (isLoaded && data) {
        console.log('SUCCESS', data);
      }
    },
    [isLoaded, data],
  );

  const {
    isDirty,
    isValid,
    reset,
    onSubmit,
  } = useForm(submitHandler, [emailFormData, passwordFormData]);

  return (
    <Card>
      <CardHeader title="Login" />
      <CardContent>
        <TextField
          placeholder="a@b.com"
          label="Email Address"
          fullWidth
          {...emailField}
        />
        <TextField
          placeholder="test"
          label="Password"
          fullWidth
          {...passwordField}
        />
      </CardContent>
      <CardActions>
        <Button
          variant="outlined"
          color="secondary"
          disabled={!isDirty}
          onClick={reset}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!isValid}
          onClick={onSubmit}
        >
          Submit
        </Button>
        {isLoading && <CircularProgress />}
      </CardActions>
    </Card>
  );
};
