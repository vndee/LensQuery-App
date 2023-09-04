import axios, { AxiosError } from 'axios';
import { get } from 'lodash';
import { OPENROUTER_HOST } from '../utils/Constants';
import { TGetKeyLimitResponse, TGetModelPropertiesResponse } from '../types/openrouter';

const openrouterApi = axios.create({
  baseURL: OPENROUTER_HOST,
});

const getKeyLimit = async (key: string): Promise<{ status: number, data: TGetKeyLimitResponse | null }> => {
  try {
    const response = await openrouterApi.get('/auth/key', { headers: { 'Authorization': `Bearer ${key}` } });
    const status = get(response, 'status', 0);
    const data = get(response, 'data', {});
    return { status, data };
  } catch (error) {
    console.log(error);
    const err = error as AxiosError
    const status = err.response?.status || 0;
    const data = null;

    return { status, data };
  }
};

const getOpenRouterModelProperties = async (): Promise<{ status: number, data: Array<TGetModelPropertiesResponse> | null }> => {
  try {
    const response = await openrouterApi.get('/models');
    const status = get(response, 'status', 0);
    const data = get(response, 'data.data', []);
    return { status, data };
  } catch (error) {
    console.log(error);
    const err = error as AxiosError;
    const status = err.response?.status || 0;
    const data = null;

    return { status, data };
  }
};

export { getKeyLimit, getOpenRouterModelProperties };