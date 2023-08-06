import { MMKV } from 'react-native-mmkv';

const Storage = new MMKV();

export const clearStorageKeepAuth = () => {
  const keys = Storage.getAllKeys();
  for (const key of keys) {
    if (key === 'auth.email' || key === 'auth.password') continue;
    Storage.delete(key);
  }
};

export const clearAuthInformation = () => {
  if (Storage.contains('auth.email')) Storage.delete('auth.email');
  if (Storage.contains('auth.password')) Storage.delete('auth.password');
};

export default Storage;