import axios, { AxiosError } from 'axios';
import { OPENAI_HOST } from '../utils/Constants';
import { isEmpty } from 'lodash';

const openai = axios.create({
  baseURL: OPENAI_HOST,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getOpenAIResponse = async (payload: any, callback: (text: string) => void): Promise<any> => {
  openai.post('', payload, { responseType: 'stream' }).then(response => {
    console.log('data resp:', response.data);
    response.data.on('data', (line: any) => {
      // callback(line.toString());
      if (line) {
        console.log(line.toString());
      }
    })
  }).catch(error => {
    console.log(error);
    const err = error as AxiosError;
    console.log(err.response?.data);
  })
};

const checkValidApiKey = async (apiKey: string): Promise<boolean> => {
  if (isEmpty(apiKey)) return false;

  try {
    const response = await openai.get('/models', { headers: { Authorization: `Bearer ${apiKey}` } });
    console.log(response.data);
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export { getOpenAIResponse, checkValidApiKey };