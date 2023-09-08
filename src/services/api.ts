import qs from 'querystring';
import firebaseAuth from './firebase'
import axios, { AxiosError } from 'axios';
import { MATHPIX_HOST } from '../utils/Constants'
import { healthCheckResponse, GetOCRAccessTokenResponse, OCRResultResponse, OCRResponse } from '../types/api';

const queryBackend = axios.create({
  baseURL: 'https://brain.lensquery.com',
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: params => qs.stringify(params),
});

queryBackend.interceptors.request.use(
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

queryBackend.interceptors.response.use(
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
    const resp = await queryBackend.get('/healthcheck');
    return { status: resp?.status, data: resp?.data }
  } catch (error: any) {
    return { status: error?.response?.status, data: error?.response?.data }
  }
};

const getOCRAccessToken = async (): Promise<GetOCRAccessTokenResponse> => {
  try {
    const resp = await queryBackend.get('/api/v1/ocr/token');
    return { status: resp?.status, data: resp?.data }
  } catch (error: any) {
    return { status: error?.response?.status, data: { app_id: '', app_token: '', app_token_expires_at: 0 } }
  }
}

const getOCRResult = async (image: string): Promise<OCRResultResponse> => {
  try {
    const { data, status } = await getOCRAccessToken();
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
          'app_id': data.app_id,
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

const getTermsOfUse = async (): Promise<string> => {
  try {
    const resp = await queryBackend.get('/terms');
    return resp.data;
  } catch (error: any) {
    console.error('getTermsOfUse error:', error?.response?.data);
    return '';
  }
};

const getPrivacyPolicy = async (): Promise<string> => {
  try {
    const resp = await queryBackend.get('/privacy');
    return resp.data;
  } catch (error: any) {
    console.error('getPrivacyPolicy error:', error?.response?.data);
    return '';
  }
}

const getFreeText = async (image: string): Promise<OCRResponse> => {
  try {
    const payload = new FormData();
    payload.append('image', {
      uri: image,
      type: 'image/jpeg',
      name: 'image.jpg',
    });

    const resp = await queryBackend.post('/api/v1/ocr/get_free_text', payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    let returned = '';
    if (resp.status === 200) {
      // get returned by join 
      returned = resp.data.join('\n');
    }
    return { status: resp.status, data: returned };
  } catch (error: any) {
    console.error('getFreeText error:', error?.response?.data);
    return { status: error?.response?.status, data: '' }
  }
};

const getDocumentText = async (image: string): Promise<OCRResponse> => {
  try {
    const payload = new FormData();
    payload.append('image', {
      uri: image,
      type: 'image/jpeg',
      name: 'image.jpg',
    });

    const resp = await queryBackend.post('/api/v1/ocr/get_document_text', payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return { status: resp.status, data: resp.data?.data };
  } catch (error: any) {
    console.error('getDocumentText error:', error?.response?.data);
    return { status: error?.response?.status, data: '' }
  }
};

const getEquationText = async (image: string): Promise<OCRResponse> => {
  try {
    const payload = new FormData();
    payload.append('image', {
      uri: image,
      type: 'image/jpeg',
      name: 'image.jpg',
    });
    const resp = await queryBackend.post('/api/v1/ocr/get_equation_text', payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return { status: resp.status, data: resp.data.text };
  } catch (error: any) {
    console.error('getEquationText error:', error?.response?.data);
    return { status: error?.response?.status, data: '' }
  }
};

const getOCRText = async (image: string, type: string) => {
  let resp: OCRResponse = { status: 500, data: '' };

  switch (type) {
    case 'FREE_TEXT':
      resp = await getFreeText(image);
      break;
    case 'DOCUMENT_TEXT':
      resp = await getDocumentText(image);
      break;
    case 'EQUATION_TEXT':
      resp = await getEquationText(image);
      break;
    default:
      break;
  };

  return resp;
}

export { healthCheck, getOCRAccessToken, getOCRResult, getTermsOfUse, getPrivacyPolicy, getOCRText };