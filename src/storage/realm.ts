import Realm from "realm";
import { IChatBox, IMessage } from "../types/chat";
import { createRealmContext } from "@realm/react";

// Models
class ChatBox extends Realm.Object<IChatBox> {
  id!: string;
  name!: string;
  engineId!: string;
  collectionId!: string;
  lastMessage!: string;
  lastMessageAt!: number; // unix timestamp
  createAt!: number; // unix timestamp
  updateAt!: number; // unix timestamp

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
    },
  };
};

class MessageCollection extends Realm.Object<MessageCollection> {
  id!: string;
  chatBox!: ChatBox;
  messages!: Realm.List<Message>;
  createAt!: number; // unix timestamp
  updateAt!: number; // unix timestamp

  static schema: Realm.ObjectSchema = {
    name: "MessageCollection",
    primaryKey: "id",
    properties: {
      id: "string",
      chatBox: "ChatBox",
      messages: "Message[]",
      createAt: "int",
      updateAt: "int",
    },
  };
};

const realmConfig = {
  schema: [ChatBox, Message, MessageCollection],
  schemaVersion: 14,
  deleteRealmIfMigrationNeeded: true
};

export const { RealmProvider, useRealm, useObject, useQuery } = createRealmContext(realmConfig);