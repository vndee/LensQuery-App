import Realm from 'realm';

export type IChatEngine = {
  id: string;
  name: string;
};

export type IChatBox = {
  id: string;
  name: string;
  engineId: string;
  lastMessage: string;
  lastMessageAt: number; // unix timestamp
  createAt: number; // unix timestamp
  updateAt: number; // unix timestamp
}

export type IMessage = {
  id: string;
  collectionId: string;
  type: 'user' | 'bot';
  content: string;
  isInterupted: boolean;
  engineId: string;
  createAt: number; // unix timestamp
  updateAt: number; // unix timestamp
}
