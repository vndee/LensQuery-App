import Strings from '../localization'
import { IMessage } from '../types/chat';
import ImageSize from 'react-native-image-size';

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

export const getImageSize = async (uri: string): Promise<{ width: number; height: number; }> => {
  const size = await ImageSize.getSize(uri);

  let width = size.width;
  let height = size.height;

  // some android devices returns the image with rotation applied.
  // If the image is rotated switch width with height
  if (size.rotation === 90 || size.rotation === 270) {
    width = size.height;
    height = size.width;
  }

  return {
    width,
    height
  }
}

export const maskApiKey = (text: string) => {
  const parts = text.split('-');

  if (parts.length !== 2) {
    return text;
  }

  return `${parts[0]}-${'*'.repeat(parts[1].length)}`;
}
