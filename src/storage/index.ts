import { MMKV } from 'react-native-mmkv';

const Storage = new MMKV();

export const clearStorageKeepAuth = () => {
  const keys = Storage.getAllKeys();
  for (const key of keys) {
    if (key.startsWith('auth.')) continue;
    Storage.delete(key);
  }
};

export const clearAuthInformation = () => {
  const keys = Storage.getAllKeys();
  for (const key of keys) {
    if (key.startsWith('auth.')) Storage.delete(key);
  }
};

export default Storage;