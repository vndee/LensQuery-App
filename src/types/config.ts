import {TGetModelPropertiesResponse} from './openrouter';

export type IAppConfig = {
  userToken: string;
  apiKey: string;
  defaultModel: string;
};

export type ISubscriptionConfig = {
  name: string;
  TextOCRSnap: number;
  EquationOCRSnap: number;
  FullChatExperience: boolean;
  CustomLLMProvider: boolean;
};

export type CreditDetails = {
  ID: string;
  UpdateAt: string;
  DeleteAt: string;
  user_id: string;
  credit_amount: number;
};

export type IPackageConfig = {
  amount: {
    rc_bronze: number;
    rc_gold: number;
    rc_silver: number;
  };
  cost: {
    'gpt-3.5': number;
    'gpt-4': number;
    'llama-13b': number;
    snap_free_text: number;
    snap_equation_text: number;
  };
};
