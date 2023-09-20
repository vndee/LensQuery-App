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

export type CreditDetails = {
  ID: string;
  UpdateAt: string;
  DeleteAt: string;
  user_id: string;
  purchased_timestamp_ms: number;
  expired_timestamp_ms: number;
  ammount_equation_snap: number;
  remain_equation_snap: number;
  ammount_text_snap: number;
  remain_text_snap: number;
}