import { Switch, Route, Link } from 'react-router-dom';
import { LoginScreen } from './screens/login';
import { PreviewScreen } from './screens/preview';
import { AuthProvider } from './store/auth';

const Home = () => (
  <>
    <h1>Fake app home</h1>
    <Link to="/basic-login/login">Login Form</Link>
    <Link to="/basic-login/preview">Preview Thing</Link>
  </>
);

export default () => (
  <AuthProvider>
    <Switch>
      <Route exact path="/basic-login/login" component={LoginScreen} />
      <Route exact path="/basic-login/preview" component={PreviewScreen} />
      <Route path="/basic-login" component={Home} />
    </Switch>
  </AuthProvider>
);
