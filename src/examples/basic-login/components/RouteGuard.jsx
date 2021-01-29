import { Redirect } from 'react-router-dom';
import { useUser } from '../store/auth';

export const withAuth = (ComposedComponent) => (props) => {
  const user = useUser();
  return user
    ? <ComposedComponent {...props} />
    : <Redirect to="/basic-login/login" />;
};
