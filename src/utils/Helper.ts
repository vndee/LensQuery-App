import {isEmpty} from 'lodash';
import Strings from '../localization';
import {IMessage} from '../types/chat';
import ImageSize from 'react-native-image-size';

export const checkEmailValid = (email: string) => {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
};

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
};

export const unixToTime = (unix: number) => {
  const options = {hour: 'numeric', minute: 'numeric'};
  // @ts-ignore
  return new Date(unix).toLocaleTimeString(undefined, options);
};

export const unixToTimeWithSeconds = (unix: number) => {
  const options = {hour: 'numeric', minute: 'numeric', second: 'numeric'};
  // @ts-ignore
  return new Date(unix).toLocaleTimeString(undefined, options);
};

export const formatTime = (time: string) => {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  // @ts-ignore
  return new Date(time).toLocaleDateString(undefined, options);
};

export const unixToDate = (unix: number) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  // @ts-ignore
  return new Date(unix).toLocaleDateString(undefined, options);
};

export const constructMessage = (
  chatCollectionId: string,
  content: string,
  type: 'bot' | 'user' | 'image',
  isInterupted: boolean,
  engineId: string,
  userToken: string,
  provider: string,
): IMessage => {
  return {
    id: new Realm.BSON.ObjectId().toHexString(),
    collectionId: chatCollectionId,
    content: content,
    type: type,
    isInterupted: isInterupted,
    engineId: engineId,
    createAt: new Date().getTime(),
    updateAt: new Date().getTime(),
    userToken: userToken,
    provider: provider,
  };
};

export const getImageSize = async (
  uri: string,
): Promise<{width: number; height: number}> => {
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
    height,
  };
};

export const maskApiKey = (text: string) => {
  if (isEmpty(text)) return '';

  const parts = text.split('-');

  // join part[1..n] with '-'
  const latter = parts.slice(1).join('-');

  return `${parts[0]}-${'*'.repeat(latter.length)}`;
};

export const getOcrResponseText = (labels: string[], text: string) => {
  if (labels.length === 0 && isEmpty(text)) return '';
  if (labels.length === 0)
    return `This is the text that was extracted from your given image:\n${text}`;

  const labelStr = labels.join(', ');
  const answer = `Detected label(s) from your given image (sorted in descending order by confidence score):\n${labelStr}\n\nThis is the text that was extracted from your given image:\n${text}`;
  return answer;
};

export const formatNumber = (d: number): string => {
  return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
