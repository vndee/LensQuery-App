import { SLICE_NAME } from '../sliceNames';
import { createSlice } from '@reduxjs/toolkit';
import Storage from '../../storage';

const initialStateAccount = {
  openaiKey: Storage.getString('account.openaiKey') || '',
  accountCreds: Storage.getString('account.accountCreds') || '',
};

const accountSlice = createSlice({
  name: SLICE_NAME.ACCOUNT,
  initialState: initialStateAccount,
  reducers: {
    setOpenaiKey: (state, action) => {
      state.openaiKey = action.payload;
      Storage.set('account.openaiKey', action.payload);
    },
    setAccountCreds: (state, action) => {
      state.accountCreds = action.payload;
      Storage.set('account.accountCreds', action.payload);
    }
  }
});

export const { setOpenaiKey, setAccountCreds } = accountSlice.actions;

export default accountSlice.reducer;