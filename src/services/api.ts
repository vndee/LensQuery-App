import qs from 'querystring';
import axios, { AxiosError } from 'axios';
import auth from '@react-native-firebase/auth';
import { GetOCRAccessTokenResponse } from '../types/api';

const brainBackend = axios.create({
  baseURL: 'https://brain.lensquery.com',
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: params => qs.stringify(params),
});

brainBackend.interceptors.request.use(
  async config => {
    const token = await auth().currentUser?.getIdToken();
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

brainBackend.interceptors.response.use(
  response => {
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized');
    }
    return Promise.reject(error);
  }
);

const healthCheck = async () => {
  try {
    const response = await brainBackend.get('/healthcheck');
    return response;
  } catch (error) {
    console.log('~[api /healthcheck]', error);
  }
};

const getOCRAccessToken = async (): Promise<GetOCRAccessTokenResponse> => {
  try {
    return await brainBackend.get('/api/v1/ocr/get_access_token') as GetOCRAccessTokenResponse;
  } catch (error) {
    console.log('~[api /api/v1/ocr/get_access_token]', error);
    return { app_token: '', app_token_expires_at: 0 }
  }
}

export { healthCheck, getOCRAccessToken };