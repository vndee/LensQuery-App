import { SLICE_NAME } from '../sliceNames';
import { createSlice } from '@reduxjs/toolkit';
import Storage from '../../storage';

const initialStateAuth = {
  isLogin: Storage.getBoolean('state.isLogin') || false,
  language: Storage.getString('auth.language') || 'en',
};

const authSlice = createSlice({
  name: SLICE_NAME.AUTH,
  initialState: initialStateAuth,
  reducers: {
    setLogin: (state, action) => {
      state.isLogin = action.payload;
      Storage.set('state.isLogin', action.payload);
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      Storage.set('auth.language', action.payload);
    }
  }
});

export const { setLogin, setLanguage } = authSlice.actions;

export default authSlice.reducer;