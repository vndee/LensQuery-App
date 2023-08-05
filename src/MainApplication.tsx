import React, { useEffect } from 'react';
import { iphoneXSeries } from '../src/utils/Device';
import { useDispatch, useSelector } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Storage from './storage';
import { setLogin } from './redux/slice/auth';
import MainStack from './navigations/MainStack';
import AuthStack from './navigations/AuthStack';

const MainApplication = (): JSX.Element => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state: any) => state.auth);

  const handleCheckLogin = async () => {
    try {
      const loginState = Storage.getBoolean('isLogin');
      if (loginState) {
        dispatch(setLogin(true));
      }
    } catch (error) {
      console.debug('[Application] error:', error)
    }
  };

  console.log('~ isLogin:', isLogin);

  useEffect(() => {
    handleCheckLogin();
  }, []);

  return (
    <GestureHandlerRootView style={iphoneXSeries}>
      {isLogin ? <MainStack /> : <AuthStack />}
    </GestureHandlerRootView>
  );
}

export default MainApplication;
