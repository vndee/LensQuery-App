import { TGetModelPropertiesResponse } from './openrouter';

export type IAppConfig = {
  userToken: string;
  apiKey: string;
  defaultModel: string;
}

export type ISubscriptionConfig = {
  TextOCRSnap: number;
  EquationOCRSnap: number;
  FullChatExperience: boolean;
  CustomLLMProvider: boolean;
}