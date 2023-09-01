import Strings from './localization';
import auth from '@react-native-firebase/auth';
import { setLogin } from './redux/slice/auth';
import MainStack from './navigations/MainStack';
import AuthStack from './navigations/AuthStack';
import { RealmProvider } from './storage/realm';
import { clearStorageAuthCreds } from './storage';
import { setUserToken } from './redux/slice/auth';
import React, { useState, useEffect } from 'react';
import { iphoneXSeries } from '../src/utils/Device';
import { useDispatch, useSelector } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const MainApplication = (): JSX.Element => {
  const dispatch = useDispatch();
  const { isLogin, language } = useSelector((state: any) => state.auth);
  const [initializing, setInitializing] = useState(true);

  Strings.setLanguage(language ? language : 'en');

  console.log('~ isLogin:', isLogin);
  console.log('~ language:', language);

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    console.log('onAuthStateChanged', user?.uid)
    console.log('onAuthStateChanged', user);
    if (user) {
      dispatch(setLogin(true));
      dispatch(setUserToken(user?.uid));
    } else {
      dispatch(setLogin(false));
      clearStorageAuthCreds();
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
