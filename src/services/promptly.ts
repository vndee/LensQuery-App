import axios, { AxiosError } from 'axios';
import { PROMPTLY_HOST, PROMPTLY_TOKEN } from '../utils/Constants';

const promptly = axios.create({
  baseURL: PROMPTLY_HOST,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Token ${PROMPTLY_TOKEN}`,
  },
});

const getPromptlyResponse = async (prompt: string, callback: (text: string) => void): Promise<any> => {
  const payload = {
    input: {
      question: prompt
    },
    stream: true
  }

  promptly.post('', payload, { responseType: 'stream' }).then(response => {
    console.log('data resp:', response.data);
    response.data.on('data', (line: any) => {
      // callback(line.toString());
      if (line) {
        console.log(line.toString());
      }
    })
  }).catch(error => {
    console.log(error);
  })
};

export { getPromptlyResponse };