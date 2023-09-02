/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import store from './src/redux/store';
import { Provider } from 'react-redux';
import { LogBox } from 'react-native';
import MainApplication from './src/MainApplication';

function App(): JSX.Element {
  LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews \
    with the same orientation because it can break windowing and other \
    functionality - use another VirtualizedList-backed container instead.'
  ]);

  return (
    <Provider store={store}>
      <MainApplication />
    </Provider>
  );
}

export default App;
