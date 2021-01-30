import { Provider } from 'react-redux';
import { store } from './redux/testStore';

export default () => (
  <Provider store={store}>
    <h1>Stuffs</h1>
  </Provider>
);
