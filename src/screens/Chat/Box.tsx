import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import 'react-native-get-random-values'
import Realm from 'realm';
import Strings from '../../localization';
import { Routes } from '../../types/navigation';
import Animated from 'react-native-reanimated';
import { IChatEngine, IMessage } from '../../types/chat';
import { FlashList } from '@shopify/flash-list';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import LabelSwitch from '../../components/Switch/LabelSwitch';
import { useRealm, useQuery, useObject } from '../../storage/realm';
import Message from '../../components/Chat/Message';
// import { useKeyboard } from '../../hooks/useKeyboard';
import { useKeyboardVisible } from '../../hooks/useKeyboard';
import { CHAT_HISTORY_CACHE_LENGTH, CHAT_HISTORY_LOAD_LENGTH } from '../../utils/Constants';
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { FlatList } from 'react-native-gesture-handler';

const chatEngine: IChatEngine[] = [
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5',
  },
  {
    id: 'gpt-4',
    name: 'GPT-4'
  }
];

const ChatBox = ({ navigation, route }: NativeStackScreenProps<Routes, 'ChatBox'>) => {
  const realm = useRealm();
  const isKeyboardVisible = useKeyboardVisible();
  const { chatBoxId } = route.params;
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const listRef = useRef<FlashList<string> | null>(null);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<Array<IMessage>>([]);
  const [engine, setEngine] = useState<IChatEngine>(chatEngine[0]);
  const chatBox = useObject('ChatBox', new Realm.BSON.ObjectId(chatBoxId));
  const chatCollection = useObject('MessageCollection', new Realm.BSON.ObjectId(chatBox?.collectionId));

  const pushMessage = useCallback((text: string, type: 'user' | 'bot', engineId: string, isInterupted: boolean = false) => {
    const message: IMessage = {
      _id: new Realm.BSON.ObjectId(),
      collectionId: chatCollection?._id,
      content: text,
      type: type,
      isInterupted: isInterupted,
      engineId: engineId,
      createAt: new Date().getTime(),
      updateAt: new Date().getTime(),
    };

    realm.write(() => {
      chatCollection.messages.push(message);
      chatBox.lastMessage! = message.content;
      chatBox.lastMessageAt! = message.createAt;
    });

    // add new message to the end of the array
    if (messages.length >= CHAT_HISTORY_CACHE_LENGTH) {
      setMessages((messages) => [message, ...messages.splice(0, messages.length - 1)]);
    } else {
      setMessages((messages) => [message, ...messages]);
    }
  }, [chatCollection]);

  const sendMessage = (text: string) => {
    Keyboard.dismiss();
    if (text.length > 0) {
      // add message to the front of the array
      pushMessage(text, 'user', engine.id);
      setInputMessage('');

      pushMessage('Loading... This is the markup text lorem ipsum dolor sit amet', 'bot', engine.id, false);
    }
  };

  useEffect(() => {
    console.debug('engine', engine);
  }, [engine]);

  useEffect(() => {
    console.debug('chatBox', chatBox);
  }, [chatBox]);

  useEffect(() => {
    if (messages.length === 0 && chatCollection?.messages.length > 0) {
      let history: Array<IMessage> = [];
      const L = chatCollection?.messages.length;
      for (let i = 0; i < Math.min(L, CHAT_HISTORY_LOAD_LENGTH); i++) {
        history.push(chatCollection?.messages[L - i - 1]);
      };
      setMessages(history);
    }
  }, [chatCollection]);

  const deleteAllData = () => {
    realm.write(() => {
      realm.deleteAll();
    });
  };

  useEffect(() => {
    console.debug('chatBoxId', chatBoxId);
    if (!chatBoxId) {
      // create new chat box in realm
      const collectionId = new Realm.BSON.ObjectId();
      realm.write(() => {
        const chatBox = realm.create('ChatBox', {
          _id: new Realm.BSON.ObjectId(),
          name: '',
          engineId: engine.id,
          collectionId: collectionId,
          lastMessage: '',
          lastMessageAt: new Date().getTime(),
          messages: [],
          createAt: new Date().getTime(),
          updateAt: new Date().getTime(),
        });

        // create new collection for this chat box
        realm.create('MessageCollection', {
          _id: collectionId,
          chatBox: chatBox,
          messages: [],
          createAt: new Date().getTime(),
          updateAt: new Date().getTime(),
        });
      });
    }
  }, [chatBoxId]);

  const actionItem = [
    { icon: 'search-outline', color: Colors.text_color, label: Strings.chatBox.optionSearch, onPress: () => { actionSheetRef.current?.hide() } },
    { icon: 'trash-outline', color: Colors.danger, label: Strings.chatBox.optionClear, onPress: () => { actionSheetRef.current?.hide() } },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={Layout.header}>
        <View style={styles.row}>
          <TouchableOpacity onPress={navigation.goBack} style={styles.backIcon}>
            <Ionicons name="chevron-back" size={20} color={Colors.text_color} />
          </TouchableOpacity>
          <Text style={Typography.H3}>Chat</Text>
        </View>
        <View style={styles.headerRight}>
          <LabelSwitch
            data={chatEngine}
            value={engine}
            onChange={setEngine}
            bgInActiveColor={Colors.primary}
            bgActiveColor={Colors.white}
            labelActiveColor={Colors.primary}
            labelInActiveColor={Colors.white}
          />

          <TouchableOpacity style={styles.moreIcon} onPress={() => actionSheetRef.current?.show()}>
            <Feather name="more-vertical" size={20} color={Colors.text_color} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <FlashList
          inverted
          data={messages}
          renderItem={({ item }: { item: IMessage }) => <Message item={item} />}
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
        <View style={[styles.messageInputContainer, { paddingBottom: isKeyboardVisible ? Spacing.S : Spacing.SAFE_BOTTOM - Spacing.S }]}>
          <TextInput
            style={styles.messageInput}
            placeholder={Strings.chatBox.placeholder}
            placeholderTextColor={Colors.borders}
            value={inputMessage}
            onChangeText={setInputMessage}
            onSubmitEditing={() => sendMessage(inputMessage)}
          />
          <TouchableOpacity onPress={() => sendMessage(inputMessage)} style={styles.sendIcon}>
            <Feather name="send" size={28} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <ActionSheet ref={actionSheetRef}>
        <View style={styles.draggleBar} />
        <FlatList
          data={actionItem}
          renderItem={({ item }: { item: any }) => (
            <TouchableOpacity onPress={item.onPress} style={styles.actionItem}>
              <Ionicons name={item.icon} size={20} color={item.color} />
              <Text style={[Typography.body, { color: item.color }]}>{item.label}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </ActionSheet>
    </View >
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    ...Layout.content,
    backgroundColor: Colors.white_two,
  },
  row: {
    flex: 1,
    gap: Spacing.XS,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    gap: Spacing.XS,
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreIcon: {
    width: 24,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  backIcon: {
    width: 24,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.S,
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
  actionItem: {
    ...Layout.row,
    gap: Spacing.S,
    paddingVertical: Spacing.S,
    paddingHorizontal: Spacing.horizontalPadding,
  },
  draggleBar: {
    height: Spacing.XS,
    borderRadius: Spacing.XXS,
    marginVertical: Spacing.XS,
  }
});

export default ChatBox;