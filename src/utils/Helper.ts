import Strings from '../localization'
import { IMessage } from '../types/chat';

export const checkEmailValid = (email: string) => {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
}

export const formatTimeDiff = (time: number) => {
  const now = Date.now();
  const diff = now - time;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) {
    return Strings.timeDiff.now;
  } else if (minutes < 60) {
    return `${minutes} ${Strings.timeDiff.minutesAgo}`;
  } else if (hours < 24) {
    return `${hours} ${Strings.timeDiff.hoursAgo}`;
  } else {
    return new Date(time).toLocaleDateString();
  }
}

export const unixToTime = (unix: number) => {
  const options = { hour: 'numeric', minute: 'numeric' };
  // @ts-ignore
  return new Date(unix).toLocaleTimeString(undefined, options);
};

export const constructMessage = (chatCollectionId: string, content: string, type: 'bot' | 'user' | 'image', isInterupted: boolean, engineId: string): IMessage => {
  return {
    id: new Realm.BSON.ObjectId().toHexString(),
    collectionId: chatCollectionId,
    content: content,
    type: type,
    isInterupted: isInterupted,
    engineId: engineId,
    createAt: new Date().getTime(),
    updateAt: new Date().getTime(),
  }
};