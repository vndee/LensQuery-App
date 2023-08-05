import { SLICE_NAME } from '../sliceNames';
import { createSlice } from '@reduxjs/toolkit';


const initialStateAuth = {
  isLogin: false,
};

const authSlice = createSlice({
  name: SLICE_NAME.AUTH,
  initialState: initialStateAuth,
  reducers: {
    setLogin: (state, action) => {
      state.isLogin = action.payload;
    },
  }
});

export const { setLogin } = authSlice.actions;

export default authSlice.reducer;