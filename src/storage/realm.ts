import Realm from "realm";
import { IChatBox, IMessage } from "../types/chat";
import { createRealmContext } from "@realm/react";

// Models
class ChatBox extends Realm.Object<IChatBox> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  engineId!: string;
  collectionId!: Realm.BSON.ObjectId;
  lastMessage!: string;
  lastMessageAt!: number; // unix timestamp
  createAt!: number; // unix timestamp
  updateAt!: number; // unix timestamp

  static schema: Realm.ObjectSchema = {
    name: "ChatBox",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      name: "string",
      engineId: "string",
      collectionId: "objectId",
      lastMessage: "string",
      lastMessageAt: "int",
      createAt: "int",
      updateAt: "int",
    },
  };
};

class Message extends Realm.Object<IMessage> {
  _id!: Realm.BSON.ObjectId;
  collectionId!: Realm.BSON.ObjectId;
  type!: string;
  content!: string;
  isInterupted!: boolean;
  engineId!: string;
  createAt!: number; // unix timestamp
  updateAt!: number; // unix timestamp

  static schema: Realm.ObjectSchema = {
    name: "Message",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      collectionId: "objectId",
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
  _id!: Realm.BSON.ObjectId;
  chatBox!: ChatBox;
  messages!: Realm.List<Message>;
  createAt!: number; // unix timestamp
  updateAt!: number; // unix timestamp

  static schema: Realm.ObjectSchema = {
    name: "MessageCollection",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      chatBox: "ChatBox",
      messages: "Message[]",
      createAt: "int",
      updateAt: "int",
    },
  };
};

const realmConfig = {
  schema: [ChatBox, Message, MessageCollection],
  schemaVersion: 8,
};

export const { RealmProvider, useRealm, useObject, useQuery } = createRealmContext(realmConfig);