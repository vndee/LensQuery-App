/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import store from './src/redux/store';
import { Provider } from 'react-redux';
import MainApplication from './src/MainApplication';

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <MainApplication />
    </Provider>
  );
}

export default App;
