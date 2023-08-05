import { SLICE_NAME } from '../sliceNames';
import { createSlice } from '@reduxjs/toolkit';


const initialStateAuth = {
  isLogin: false,
};

const authSlice = createSlice({
  name: SLICE_NAME.AUTH,
  initialState: initialStateAuth,
  reducers: {
    setLogin: (state) => {
      state.isLogin = true;
    },
    setLogout: (state) => {
      state.isLogin = false;
    }
  }
});

export const { setLogin, setLogout } = authSlice.actions;

export default authSlice.reducer;