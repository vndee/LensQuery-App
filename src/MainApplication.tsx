import React, { useState, useEffect } from 'react';
import { iphoneXSeries } from '../src/utils/Device';
import { useDispatch, useSelector } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';

import Storage from './storage';
import Strings from './localization';
import { setLogin } from './redux/slice/auth';
import MainStack from './navigations/MainStack';
import AuthStack from './navigations/AuthStack';
import { setAccountCreds } from './redux/slice/account';
import { RealmProvider } from './storage/realm';

const MainApplication = (): JSX.Element => {
  const dispatch = useDispatch();
  const { isLogin, language } = useSelector((state: any) => state.auth);
  const [initializing, setInitializing] = useState(true);

  Strings.setLanguage(language ? language : 'en');

  console.log('~ isLogin:', isLogin);
  console.log('~ language:', language);

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    setAccountCreds(user);
    console.log('onAuthStateChanged', user);
    if (user) {
      dispatch(setLogin(true));
    } else {
      dispatch(setLogin(false));
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <GestureHandlerRootView style={iphoneXSeries}>
      <RealmProvider>
        {isLogin ? <MainStack /> : <AuthStack />}
      </RealmProvider>
    </GestureHandlerRootView>
  );
}

export default MainApplication;
