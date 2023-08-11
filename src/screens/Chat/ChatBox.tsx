import React, { useState, useEffect, useRef } from 'react';
import { Routes } from '../../types/navigation';
import { IChatEngine } from '../../types/chat';
import Animated from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, LayoutAnimation } from 'react-native';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import LabelSwitch from '../../components/Switch/LabelSwitch';

const chatEngine: IChatEngine[] = [
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5',
  },
  {
    id: 'gpt-4',
    name: 'GPT-4'
  }
]

const ChatBox = ({ navigation, route }: NativeStackScreenProps<Routes, 'ChatBox'>) => {
  const listRef = useRef<FlashList<string> | null>(null);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Array<string>>([]);
  const [engine, setEngine] = useState<IChatEngine>(chatEngine[0]);

  const sendMessage = () => {
    Keyboard.dismiss();
    if (message.length > 0) {
      // add message to the front of the array
      setMessages([message, ...messages]);
      setMessage('');

      // listRef.current?.prepareForLayoutAnimationRender();
      // LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    }
  };

  useEffect(() => {
    console.debug('messages', messages);
  }, [messages]);

  useEffect(() => {
    console.debug('engine', engine);
  }, [engine]);

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{item}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={Layout.header}>
        <View style={styles.row}>
          <Ionicons name="arrow-back" size={20} color={Colors.text_color} onPress={navigation.goBack} />
          <Text style={Typography.H3}>Chat</Text>
        </View>
        <LabelSwitch
          data={chatEngine}
          value={engine}
          onChange={setEngine}
          bgInActiveColor={Colors.primary}
          bgActiveColor={Colors.white}
          labelActiveColor={Colors.primary}
          labelInActiveColor={Colors.white}
        />
      </View>
      <View style={styles.container}>
        <FlashList
          inverted
          ref={listRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          // style={styles.messagesContainer}
          // @ts-ignore
          contentContainerStyle={styles.messagesContentContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            console.debug('content size changed');
          }}
          estimatedItemSize={100}
        />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            placeholderTextColor={Colors.borders}
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendIcon}>
            <Feather name="send" size={28} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    ...Layout.content,
    backgroundColor: Colors.white_two,
  },
  row: {
    gap: Spacing.XS,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    ...Typography.H3,
    marginLeft: Spacing.M,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContentContainer: {
    paddingVertical: Spacing.XL,
    paddingHorizontal: Spacing.horizontalPadding,
  },
  messageContainer: {
    borderRadius: 8,
    padding: Spacing.M,
    alignSelf: 'flex-end',
    marginBottom: Spacing.M,
    backgroundColor: Colors.primary,
  },
  messageText: {
    ...Typography.body,
    color: Colors.white_two,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.S,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.horizontalPadding,
  },
  messageInput: {
    ...Typography.body,
    flex: 1,
    backgroundColor: Colors.white_two,
    paddingVertical: Spacing.M,
    paddingHorizontal: Spacing.M,
    borderRadius: 8,
  },
  sendIcon: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatBox;