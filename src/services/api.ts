import qs from 'querystring';
import axios, { AxiosError } from 'axios';
import firebaseAuth from './firebase'
import { MATHPIX_HOST, MATHPIX_APP_ID } from '../utils/Constants'
import { healthCheckResponse, GetOCRAccessTokenResponse, OCRResultResponse } from '../types/api';

const brainBackend = axios.create({
  baseURL: 'https://brain.lensquery.com',
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: params => qs.stringify(params),
});

brainBackend.interceptors.request.use(
  async config => {
    const token = await firebaseAuth.currentUser?.getIdToken();
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
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized');
    }
    return Promise.reject(error);
  }
);

const healthCheck = async (): Promise<healthCheckResponse> => {
  try {
    const resp = await brainBackend.get('/healthcheck');
    return { status: resp?.status, data: resp?.data }
  } catch (error: any) {
    return { status: error?.response?.status, data: error?.response?.data }
  }
};

const getOCRAccessToken = async (): Promise<GetOCRAccessTokenResponse> => {
  try {
    const resp = await brainBackend.get('/api/v1/ocr/token');
    return { status: resp?.status, data: resp?.data }
  } catch (error: any) {
    return { status: error?.response?.status, data: { app_token: '', app_token_expires_at: 0 } }
  }
}

const getOCRResult = async (image: string): Promise<OCRResultResponse> => {
  try {
    const { data, status } = await getOCRAccessToken();
    console.log('data:', data);
    if (status === 200) {
      const formData = new FormData();
      formData.append('file', {
        uri: image,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
      formData.append('options_json', JSON.stringify({
        math_inline_delimiters: ['$', '$'],
        rm_spaces: true
      }));

      const resp = await axios.post(MATHPIX_HOST, formData, {
        headers: {
          'app_id': MATHPIX_APP_ID,
          'app_token': data.app_token,
          'Content-Type': 'multipart/form-data',
        },
      });

      return { status: resp.status, data: resp.data.text };
    } else {
      console.debug('OCR token expired, get new token')
      return { status: status, data: '' }
    }
  } catch (error: any) {
    console.error('OCR error:', error?.response?.data);
    return { status: 500, data: '' }
  };
};

export { healthCheck, getOCRAccessToken, getOCRResult };