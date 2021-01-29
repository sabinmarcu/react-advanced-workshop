import { FC } from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  styled,
} from '@material-ui/core';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { RouterLink } from './components/RouterLink';

const ctx = require.context(
  './examples',
  true,
  /\.\/([^/]+)\/index\.(ts|js|tsx|jsx)/,
);

const routes = ctx.keys().reduce(
  (prev, path) => ({
    ...prev,
    [path.split('/')[1]]: ctx(path).default,
  }),
  {},
) as Record<string, FC<any>>;

const StyledContainer = styled(Container)({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  justifyContent: 'flex-start',
  '& > *': {
    margin: '0 5px',
  },
});

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <StyledContainer>
            <RouterLink to="/">
              <Typography>Home</Typography>
            </RouterLink>
            {Object.keys(routes).map((path) => (
              <RouterLink to={`/${path}`} key={path}>
                <Typography>{path}</Typography>
              </RouterLink>
            ))}
          </StyledContainer>
        </Toolbar>
      </AppBar>
      <Container>
        <Switch>
          {Object.entries(routes).map(([path, component]) => (
            <Route key={path} path={`/${path}`} component={component} />
          ))}
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
