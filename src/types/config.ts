import { TGetModelPropertiesResponse } from './openrouter';

export type IAppConfig = {
  userToken: string;
  apiKey: string;
  llmProvider: string;
  defaultModel: string;
}