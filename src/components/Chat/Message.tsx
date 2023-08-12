import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Layout, Typography, Spacing, Colors } from '../../styles';
import { IMessage } from '../../types/chat';
import { unixToTime } from '../../utils/Helper';

type Props = {
  item: IMessage,
  onLongPress?: () => void,
}

const Message = ({ item, onLongPress }: Props) => {
  const isUser = item.type === 'user';
  const [timeVisible, setTimeVisible] = useState<boolean>(false);

  return (
    <TouchableOpacity
      style={[styles.messageContainer, isUser ? styles.userBubble : styles.botBubble]}
      onPress={setTimeVisible.bind(null, !timeVisible)}
      onLongPress={onLongPress}
    >
      <View>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>{item.content}</Text>
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
  }
});

export default Message;