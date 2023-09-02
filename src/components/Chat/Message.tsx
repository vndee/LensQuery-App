import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import { IMessage } from '../../types/chat';
import { unixToTime } from '../../utils/Helper';
import { getImageSize } from '../../utils/Helper';
import { getPressableStyle } from '../../styles/Touchable';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Typography, Spacing, Colors, Layout } from '../../styles';
import { TypingAnimation } from 'react-native-typing-animation';

type Props = {
  item: IMessage,
  onLongPress?: () => void,
}

const Message = ({ item, onLongPress }: Props) => {
  const isUser = item.type === 'user';
  const isTyping = item.content === '...' && !isUser;
  const [timeVisible, setTimeVisible] = useState<boolean>(false);

  const [imageWidth, setImageWidth] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number>(0);

  if (item.type === 'image' && !isEmpty(item.content)) {
    (async () => {
      const size = await getImageSize(item.content);
      const { width, height } = size;
      const ratio = width / height;
      setImageWidth(Spacing.WINDOW_WIDTH * 0.7);
      setImageHeight((Spacing.WINDOW_WIDTH * 0.7) / ratio);
    })();

    return (
      <Pressable style={(pressed) => [styles.messageContainer, styles.userBubble, getPressableStyle(pressed)]}>
        <Image source={{ uri: item.content }} style={{ width: imageWidth, height: imageHeight }} resizeMode="contain" />
      </Pressable>
    )
  }

  return (
    <Pressable
      style={(pressed) => [styles.messageContainer, isUser ? styles.userBubble : styles.botBubble, isTyping && styles.typingContainer, getPressableStyle(pressed)]}
      onPress={setTimeVisible.bind(null, !timeVisible)}
      onLongPress={onLongPress}
    >
      <View>
        {!isTyping ?
          <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>{item.content}</Text> :
          <TypingAnimation
            dotColor={Colors.white}
            dotMargin={3}
            dotAmplitude={3}
            dotSpeed={0.15}
            dotRadius={2.5}
            dotX={12}
            dotY={6}
          />}
        {timeVisible && (
          <Text style={[styles.time, { color: isUser ? Colors.second_text_color : Colors.white }]}>
            {unixToTime(item.createAt)}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  messageContainer: {
    padding: Spacing.M,
    marginBottom: Spacing.M,
    ...Layout.shadow
  },
  userBubble: {
    alignSelf: 'flex-end',
    marginLeft: Spacing.L,
    backgroundColor: Colors.white,
    borderTopRightRadius: Spacing.S,
    borderTopLeftRadius: Spacing.S,
    borderBottomLeftRadius: Spacing.S,
  },
  botBubble: {
    alignSelf: 'flex-start',
    marginRight: Spacing.L,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: Spacing.S,
    borderTopRightRadius: Spacing.S,
    borderBottomRightRadius: Spacing.S,
  },
  messageText: {
    ...Typography.body,
  },
  userText: {
    color: Colors.black_two,
  },
  botText: {
    color: Colors.white,
  },
  time: {
    ...Typography.description,
    alignSelf: 'flex-end',
  },
  typingContainer: {
    padding: Spacing.S,
    width: 50,
    height: 36,
  }
});

export default Message;