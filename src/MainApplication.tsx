import React, { useEffect } from 'react';
import { iphoneXSeries } from '../src/utils/Device';
import { useDispatch, useSelector } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Storage from './storage';
import Strings from './localization';
import { setLogin } from './redux/slice/auth';
import MainStack from './navigations/MainStack';
import AuthStack from './navigations/AuthStack';

const MainApplication = (): JSX.Element => {
  const { isLogin, language } = useSelector((state: any) => state.auth);

  Strings.setLanguage(language ? language : 'en');

  console.log('~ isLogin:', isLogin);
  console.log('~ language:', language);

  // useEffect(() => {
  // }, []);

  return (
    <GestureHandlerRootView style={iphoneXSeries}>
      {isLogin ? <MainStack /> : <AuthStack />}
    </GestureHandlerRootView>
  );
}

export default MainApplication;
