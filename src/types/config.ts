import { TGetModelPropertiesResponse } from './openrouter';

export type IAppConfig = {
  userToken: string;
  apiKey: string;
  defaultModel: string;
}

export type ISubscriptionConfig = {
  name: string;
  TextOCRSnap: number;
  EquationOCRSnap: number;
  FullChatExperience: boolean;
  CustomLLMProvider: boolean;
}