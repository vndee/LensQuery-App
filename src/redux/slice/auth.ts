import appStorage from '../../storage';
import { SLICE_NAME } from '../sliceNames';
import { createSlice } from '@reduxjs/toolkit';

const initialStateAuth = {
  isLogin: appStorage.getBoolean('auth.isLogin') || false,
  language: appStorage.getString('auth.language') || 'en',
  userToken: appStorage.getString('auth.userToken') || '',
  subscriptionPlan: '',
  freeTrialExp: appStorage.getString('auth.freeTrialExp') || '',
};

const authSlice = createSlice({
  name: SLICE_NAME.AUTH,
  initialState: initialStateAuth,
  reducers: {
    setLogin: (state, action) => {
      state.isLogin = action.payload;
      appStorage.set('auth.isLogin', action.payload);
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      appStorage.set('auth.language', action.payload);
    },
    setUserToken: (state, action) => {
      state.userToken = action.payload;
      appStorage.set('auth.userToken', action.payload);
    },
    setSubscriptionPlan: (state, action) => {
      state.subscriptionPlan = action.payload;
      appStorage.set('auth.subscriptionPlan', action.payload);
    },
    setFreeTrialExp: (state, action) => {
      state.freeTrialExp = action.payload;
      appStorage.set('auth.freeTrialExp', action.payload);
    }
  }
});

export const { setLogin, setLanguage, setUserToken, setSubscriptionPlan, setFreeTrialExp } = authSlice.actions;

export default authSlice.reducer;