import Realm from "realm";
import { IAppConfig } from "../types/chat";
import { createRealmContext } from "@realm/react";
import { IChatBox, IMessage, IProvider } from "../types/chat";
import { TGetModelPropertiesResponse } from "../types/openrouter";

// Models
class Provider extends Realm.Object<IProvider> {
  defaultModel!: string;
  apiKey!: string;

  static schema: Realm.ObjectSchema = {
    name: "Provider",
    embedded: true,
    properties: {
      defaultModel: "string",
      apiKey: "string",
    },
  };
};

class AppConfig extends Realm.Object<IAppConfig> {
  userToken!: string;
  openAI!: Provider;
  openRouter!: Provider;
  defaultProvider!: string;

  static schema: Realm.ObjectSchema = {
    name: "AppConfig",
    primaryKey: "userToken",
    properties: {
      userToken: "string",
      defaultProvider: "string",
      openAI: "Provider",
      openRouter: "Provider",
    }
  }
}

class ChatBox extends Realm.Object<IChatBox> {
  id!: string;
  name!: string;
  engineId!: string;
  collectionId!: string;
  lastMessage!: string;
  lastMessageAt!: number; // unix timestamp
  createAt!: number; // unix timestamp
  updateAt!: number; // unix timestamp
  userToken!: string; // specific user token

  static schema: Realm.ObjectSchema = {
    name: "ChatBox",
    primaryKey: "id",
    properties: {
      id: "string",
      name: "string",
      engineId: "string",
      collectionId: "string",
      lastMessage: "string",
      lastMessageAt: "int",
      createAt: "int",
      updateAt: "int",
      userToken: "string",
    },
  };
};

class Message extends Realm.Object<IMessage> {
  id!: string;
  collectionId!: string;
  type!: string;
  content!: string;
  isInterupted!: boolean;
  engineId!: string;
  createAt!: number; // unix timestamp
  updateAt!: number; // unix timestamp
  userToken!: string; // specific user token
  provider!: string;

  static schema: Realm.ObjectSchema = {
    name: "Message",
    primaryKey: "id",
    properties: {
      id: "string",
      collectionId: "string",
      type: "string",
      content: "string",
      isInterupted: "bool",
      engineId: "string",
      createAt: "int",
      updateAt: "int",
      userToken: "string",
      provider: "string",
    },
  };
};

class MessageCollection extends Realm.Object<MessageCollection> {
  id!: string;
  chatBox!: ChatBox;
  messages!: Realm.List<Message>;
  createAt!: number; // unix timestamp
  updateAt!: number; // unix timestamp
  userToken!: string; // specific user token

  static schema: Realm.ObjectSchema = {
    name: "MessageCollection",
    primaryKey: "id",
    properties: {
      id: "string",
      chatBox: "ChatBox",
      messages: "Message[]",
      createAt: "int",
      updateAt: "int",
      userToken: "string",
    },
  };
};

const realmConfig = {
  path: "lensquery.realm",
  schema: [Provider, AppConfig, ChatBox, Message, MessageCollection],
  schemaVersion: 18,
  encryptionKey: new Int8Array(64),
  // deleteRealmIfMigrationNeeded: true,
};

export const { RealmProvider, useRealm, useObject, useQuery } = createRealmContext(realmConfig);