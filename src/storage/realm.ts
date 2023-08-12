import Realm from "realm";
import { createRealmContext } from "@realm/react";

// Models
class ChatBox extends Realm.Object<ChatBox> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  engineId!: string;
  lastMessage!: string;
  lastMessageAt!: number; // unix timestamp
  messages!: Realm.List<Messages>;
  createAt!: number; // unix timestamp
  updateAt!: number; // unix timestamp

  static schema: Realm.ObjectSchema = {
    name: "ChatBox",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      name: "string",
      engineId: "string",
      lastMessage: "string",
      lastMessageAt: "int",
      messages: "Messages[]",
      createAt: "int",
      updateAt: "int",
    },
  };
};

class Messages extends Realm.Object<Messages> {
  _id!: Realm.BSON.ObjectId;
  chatBox!: ChatBox;
  message!: string;
  sentAt!: number; // unix timestamp
  isInterupted!: boolean;
  createAt!: number; // unix timestamp
  updateAt!: number; // unix timestamp

  static schema: Realm.ObjectSchema = {
    name: "Messages",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      chatBox: "ChatBox",
      message: "string",
      sentAt: "int",
      isInterupted: "bool",
      createAt: "int",
      updateAt: "int",
    },
  };
};

const realmConfig = {
  schema: [ChatBox, Messages],
  schemaVersion: 3,
};

export const { RealmProvider, useRealm, useObject, useQuery } = createRealmContext(realmConfig);