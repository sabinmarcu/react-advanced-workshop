import { Provider } from 'react-redux';
import { store } from './redux/store';

export default () => (
  <Provider store={store}>
    <h1>Redux Auth</h1>
  </Provider>
);
