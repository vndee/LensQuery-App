import Realm from 'realm';

export type IChatEngine = {
  id: string;
  name: string;
};

export type IProvider = {
  defaultModel: string;
  apiKey: string;
}

export type IChatBox = {
  id: string;
  name: string;
  engineId: string;
  collectionId: string;
  lastMessage: string;
  lastMessageAt: number; // unix timestamp
  createAt: number; // unix timestamp
  updateAt: number; // unix timestamp
  userToken: string; // specific user token
}

export type IMessage = {
  id: string;
  collectionId: string;
  type: 'user' | 'bot' | 'image';
  content: string;
  isInterupted: boolean;
  engineId: string;
  createAt: number; // unix timestamp
  updateAt: number; // unix timestamp
  userToken: string; // specific user token
  provider: string;
}

export type IMessageCollection = {
  id: string;
  name: string;
  messages: Realm.List<IMessage>;
  engineId: string;
  createAt: number; // unix timestamp
  updateAt: number; // unix timestamp
  userToken: string; // specific user token
}

export type IAppConfig = {
  userToken: string;
  openAI: IProvider;
  openRouter: IProvider;
  defaultProvider: string;
}