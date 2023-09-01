import { MMKV } from 'react-native-mmkv';

const appStorage = new MMKV();

const clearStorageAuthCreds = () => {
  appStorage.delete('auth.userToken');
};

export { clearStorageAuthCreds };

export default appStorage;
