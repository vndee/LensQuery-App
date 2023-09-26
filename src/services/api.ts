import qs from 'querystring';
import firebaseAuth from './firebase'
import axios, { AxiosError } from 'axios';
import { MATHPIX_HOST } from '../utils/Constants'
import { getOcrResponseText } from '../utils/Helper';
import { healthCheckResponse, GetOCRAccessTokenResponse, OCRResultResponse, OCRResponse, CreditDetailsResponse, RequestResetPasswordResponse } from '../types/api';
import { CreditDetails } from '../types/config';

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
      // console.log('token:', token);
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
      returned = getOcrResponseText(resp.data?.labels, resp.data?.text);
    }
    return { status: resp.status, data: returned, title: resp.data?.text };
  } catch (error: any) {
    console.error('getFreeText error:', error?.response?.data);
    return { status: error?.response?.status, data: '', title: '' }
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

    let returned = '';
    if (resp.status === 200) {
      returned = getOcrResponseText(resp.data?.labels, resp.data?.text);
    }
    return { status: resp.status, data: returned, title: resp.data?.text };
  } catch (error: any) {
    console.error('getDocumentText error:', error?.response?.data);
    return { status: error?.response?.status, data: '', title: '' }
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
    return { status: resp.status, data: resp.data.text, title: resp.data?.text };
  } catch (error: any) {
    console.error('getEquationText error:', error?.response?.data);
    return { status: error?.response?.status, data: '', title: '' }
  }
};

const getOCRText = async (image: string, type: string) => {
  let resp: OCRResponse = { status: 500, data: '', title: '' };

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
};

const getSubscriptionDetails = async (): Promise<CreditDetailsResponse> => {
  try {
    const resp = await queryBackend.get('/api/v1/credit/details');
    return { status: resp.status, data: resp.data as CreditDetails };
  } catch (error: any) {
    console.error('getSubscriptionDetails error:', error?.response?.data);
    return { status: error?.response?.status, data: {} as CreditDetails }
  };
};

const requestResetPassword = async (email: string): Promise<RequestResetPasswordResponse> => {
  try {
    const body = JSON.stringify({
      recipient: email
    });
    const resp = await queryBackend.post(`/api/v1/account/reset_password`, body);
    console.log('requestResetPassword resp:', resp.status, resp.data)
    return { status: resp.status, data: resp.data?.exp ?? 0 };
  } catch (error: any) {
    console.error('requestResetPassword error:', error?.response?.data);
    return { status: error?.response?.status, data: 0 }
  }
};

const verifyResetPasswordCode = async (email: string, code: string): Promise<number> => {
  try {
    const body = JSON.stringify({
      type: "RESET_PASSWORD",
      email: email,
      code: code
    });
    const resp = await queryBackend.post(`/api/v1/account/verify_code`, body);
    return resp.status;
  } catch (error: any) {
    console.error('verifyResetPasswordCode error:', error?.response?.data);
    return 400;
  }
};

const changePassword = async (email: string, code: string, password: string): Promise<number> => {
  try {
    const body = JSON.stringify({
      email: email,
      code: code,
      new_password: password
    });
    const resp = await queryBackend.post('/api/v1/account/update_password', body);
    return resp.status;
  } catch (error: any) {
    console.error('changePassword error:', error?.response?.data);
    return 400;
  }
};

const deleteAccount = async (user_id: string): Promise<number> => {
  try {
    const body = JSON.stringify({
      user_id: user_id
    });
    const resp = await queryBackend.delete('/api/v1/account', { data: body });
    return resp.status;
  } catch (error: any) {
    console.error('deleteAccount error:', error?.response?.data);
    return 400;
  }
};

const activateFreeTrial = async (user_id: string, email: string): Promise<number> => {
  try {
    const body = JSON.stringify({
      user_id: user_id,
      email: email
    });
    const resp = await queryBackend.post('/api/v1/account/activate_free_trial', body);
    return resp.status;
  } catch (error: any) {
    console.error('activateFreeTrial error:', error?.response?.data);
    return 400;
  }
};

const checkFreeTrialStatus = async (user_id: string, email: string): Promise<number> => {
  try {
    const body = JSON.stringify({
      user_id: user_id,
      email: email
    });
    const resp = await queryBackend.post('/api/v1/account/check_free_trial', body);
    return resp.status;
  } catch (error: any) {
    console.error('checkFreeTrialStatus error:', error?.response?.data);
    return 400;
  }
}

export {
  getOCRText,
  healthCheck,
  getOCRAccessToken,
  getOCRResult,
  getTermsOfUse,
  getPrivacyPolicy,
  getSubscriptionDetails,
  requestResetPassword,
  verifyResetPasswordCode,
  changePassword,
  deleteAccount,
  activateFreeTrial,
  checkFreeTrialStatus
};
