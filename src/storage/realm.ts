import Realm from "realm";
import { IAppConfig } from "../types/chat";
import { createRealmContext } from "@realm/react";
import { IChatBox, IMessage } from "../types/chat";
import { TGetModelPropertiesResponse } from "../types/openrouter";

// Models
class AppConfig extends Realm.Object<IAppConfig> {
  userToken!: string;
  apiKey!: string;
  llmProvider!: string;
  defaultModel!: string;

  static schema: Realm.ObjectSchema = {
    name: "AppConfig",
    primaryKey: "userToken",
    properties: {
      userToken: "string",
      apiKey: "string",
      llmProvider: "string",
      defaultModel: "string"
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
  schema: [AppConfig, ChatBox, Message, MessageCollection],
  schemaVersion: 14,
  encryptionKey: new Int8Array(64),
  deleteRealmIfMigrationNeeded: true,
};

export const { RealmProvider, useRealm, useObject, useQuery } = createRealmContext(realmConfig);