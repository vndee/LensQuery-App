import { isEmpty } from 'lodash';
import Strings from './localization';
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import auth from '@react-native-firebase/auth';
import { setLogin } from './redux/slice/auth';
import WallStack from './navigations/WallStack';
import MainStack from './navigations/MainStack';
import AuthStack from './navigations/AuthStack';
import { RealmProvider } from './storage/realm';
import { clearStorageAuthCreds } from './storage';
import { setUserToken } from './redux/slice/auth';
import { useDispatch, useSelector } from 'react-redux';
import { iphoneXSeries } from '../src/utils/Device';
import React, { useState, useEffect, useCallback } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setSubscriptionPlan } from './redux/slice/auth';
import { REVENUECAT_API_KEY_IOS, REVENUECAT_API_KEY_ANDROID } from './utils/Constants';
import { unixToDate } from './utils/Helper';

const MainApplication = (): JSX.Element => {
  const dispatch = useDispatch();
  const { isLogin, language, userToken } = useSelector((state: any) => state.auth);
  const [initializing, setInitializing] = useState(true);

  Strings.setLanguage(language ? language : 'en');

  console.log('~ isLogin:', isLogin);
  console.log('~ language:', language);

  // Handle user state changes
  const onAuthStateChanged = async (user: any) => {
    // console.log('onAuthStateChanged', user?.uid)
    // console.log('onAuthStateChanged', user);
    if (user) {
      dispatch(setLogin(true));
      dispatch(setUserToken(user?.uid));
      setUpRevenueCat(user?.uid);
      // const { customerInfo, created } = await Purchases.logIn(user?.uid);
      // console.log('customerInfo', customerInfo?.entitlements, created)
      // if (!isEmpty(customerInfo?.entitlements?.active)) {
      //   const entitlements = Object.values(customerInfo?.entitlements?.active)[0];
      //   const { isActive, identifier, expirationDateMillis } = entitlements;

      //   if (isActive) {
      //     dispatch(setSubscriptionPlan(identifier));
      //     // dispatch(setSubscriptionExpire(unixToDate(expirationDateMillis)));
      //   } else {
      //     dispatch(setSubscriptionPlan(''));
      //   }
      // }
    } else {
      dispatch(setLogin(false));
      clearStorageAuthCreds();
    }
  };

  const setUpRevenueCat = async (user_id: string) => {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

    if (Platform.OS === 'ios') {
      Purchases.configure({ apiKey: REVENUECAT_API_KEY_IOS, appUserID: user_id });
    } else if (Platform.OS === 'android') {
      Purchases.configure({ apiKey: REVENUECAT_API_KEY_ANDROID, appUserID: user_id });
    }

    // Purchases.addCustomerInfoUpdateListener(async (purchaserInfo) => {
    //   console.log('purchaserInfo', purchaserInfo?.entitlements);
    //   if (!isEmpty(purchaserInfo?.entitlements?.active)) {
    //     const entitlements = Object.values(purchaserInfo?.entitlements?.active)[0];
    //     const { isActive, identifier, expirationDate } = entitlements;

    //     if (isActive) {
    //       dispatch(setSubscriptionPlan(identifier));
    //     } else {
    //       dispatch(setSubscriptionPlan(''));
    //     }
    //   } else {
    //     dispatch(setSubscriptionPlan(''));
    //   }
    // });
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <GestureHandlerRootView style={iphoneXSeries}>
      <RealmProvider>
        <MainStack />
      </RealmProvider>
    </GestureHandlerRootView>
  );
}

export default MainApplication;
