import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
} from '@material-ui/core';
import { isEmail, useField, isRequired } from '../hooks/useField';
import { useForm } from '../hooks/useForm';

export const LoginForm = ({
  onSubmit: submitHandler,
}) => {
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
      </CardActions>
    </Card>
  );
};
