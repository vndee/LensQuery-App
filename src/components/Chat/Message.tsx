import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Layout, Typography, Spacing, Colors } from '../../styles';
import { IMessage } from '../../types/chat';
import { unixToTime } from '../../utils/Helper';
import { TypingAnimation } from 'react-native-typing-animation';

type Props = {
  item: IMessage,
  onLongPress?: () => void,
}

const Message = ({ item, onLongPress }: Props) => {
  const isUser = item.type === 'user';
  const isTyping = item.content === '...' && !isUser;
  const [timeVisible, setTimeVisible] = useState<boolean>(false);

  if (item.type === 'image') {
    return (
      <TouchableOpacity style={[styles.messageContainer, styles.userBubble]}>
        <Image source={{ uri: item.content }} style={{ width: Spacing.WINDOW_WIDTH * 0.5, height: Spacing.WINDOW_HEIGHT * 0.5 }} />
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      style={[styles.messageContainer, isUser ? styles.userBubble : styles.botBubble, isTyping && styles.typingContainer]}
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
    </TouchableOpacity>
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  messageContainer: {
    padding: Spacing.M,
    marginBottom: Spacing.M,
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