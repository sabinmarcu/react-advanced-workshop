import { Redirect } from 'react-router-dom';
import { LoginForm } from '../components/login';
import { useLogin, useUser } from '../store/auth';

export const LoginScreen = () => {
  const login = useLogin();
  const user = useUser();
  return user
    ? (
      <Redirect to="/basic-login" />
    )
    : (
      <LoginForm onSubmit={login} />
    );
};
