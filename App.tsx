/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { iphoneXSeries } from './src/utils/Device';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// screens
import Lens from './src/screens/Lens/Lens';

function App(): JSX.Element {
  return (
    <GestureHandlerRootView style={iphoneXSeries}>
      <Lens />
    </GestureHandlerRootView>
  );
}

export default App;
