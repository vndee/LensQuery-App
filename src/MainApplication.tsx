import React from 'react';
import { useSelector } from 'react-redux';
import { iphoneXSeries } from '../src/utils/Device';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import MainStack from './navigations/MainStack';
import AuthStack from './navigations/AuthStack';

function MainApplication(): JSX.Element {
  const { isLogin } = useSelector((state: any) => state.auth);

  console.log('isLogin:', isLogin);

  return (
    <GestureHandlerRootView style={iphoneXSeries}>
      {isLogin ? <MainStack /> : <AuthStack />}
    </GestureHandlerRootView>
  );
}

export default MainApplication;
