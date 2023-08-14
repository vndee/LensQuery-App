import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import 'react-native-get-random-values'
import Realm from 'realm';
import Strings from '../../localization';
import { Routes } from '../../types/navigation';
import Animated from 'react-native-reanimated';
import EventSource from '../../services/sse';
import { IChatEngine, IMessage } from '../../types/chat';
import { FlashList } from '@shopify/flash-list';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator } from 'react-native';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import LabelSwitch from '../../components/Switch/LabelSwitch';
import { useRealm, useQuery, useObject } from '../../storage/realm';
import Message from '../../components/Chat/Message';
import { useKeyboardVisible } from '../../hooks/useKeyboard';
import { CHAT_HISTORY_CACHE_LENGTH, CHAT_HISTORY_LOAD_LENGTH, OPENAI_HOST } from '../../utils/Constants';
import BottomActionSheet, { ActionItemProps, ActionSheetRef } from '../../components/ActionSheet/BottomSheet';

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

const API_KEY = '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'

const ChatBox = ({ navigation, route }: NativeStackScreenProps<Routes, 'ChatBox'>) => {
  const realm = useRealm();
  let es: EventSource | null = null;
  const isKeyboardVisible = useKeyboardVisible();
  const { chatBoxId } = route.params;
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const listRef = useRef<FlashList<string> | null>(null);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<Array<IMessage>>([]);
  const [engine, setEngine] = useState<IChatEngine>(chatEngine[0]);
  const [chatBoxIdCopy, setChatBoxIdCopy] = useState<string>(chatBoxId ? chatBoxId : '');
  const chatBox = useObject('ChatBox', chatBoxIdCopy);
  const [isFetchingHistory, setIsFetchingHistory] = useState<boolean>(false);
  const chatCollection = useObject('MessageCollection', chatBox?.collectionId ? chatBox.collectionId : '');

  const [searchText, setSearchText] = useState<string>('');
  const [isSearchBarVisible, setIsSearchBarVisible] = useState<boolean>(false);

  const pushMessage = useCallback((text: string, type: 'user' | 'bot', engineId: string, isInterupted: boolean = false) => {
    const message: IMessage = {
      id: new Realm.BSON.ObjectId().toHexString(),
      collectionId: chatCollection?.id,
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
    }
  };

  const handleEvensourceEvent = (event: any) => {
    if (event.type === 'open') {
      console.log('open sse:', event)
    } else if (event.type === 'message') {
      console.log('message sse:', event.data);
    } else if (event.type === 'error') {
      console.log(event);
    } else if (event.type === 'done') {
      console.log(event);
      es?.close();
    }
  };

  useEffect(() => {
    if (messages.length > 0 && messages[0].type === 'user') {
      let failedCnt = 0;

      const requestBody = {
        model: engine.id,
        messages: [...messages].reverse().map((message) => {
          return {
            role: message.type,
            content: message.content,
          }
        }),
        stream: true
      };
      console.log('requestBody', requestBody);
      es = new EventSource(OPENAI_HOST, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}`, body: JSON.stringify(requestBody) } })
      es.addEventListener('open', handleEvensourceEvent);
      es.addEventListener('message', handleEvensourceEvent);
      es.addEventListener('error', handleEvensourceEvent);
      es.addEventListener('done', handleEvensourceEvent);
      console.log('[EventSource]:', es);
    }
  }, [messages]);

  // useEffect(() => {
  //   console.debug('engine', engine);
  // }, [engine]);

  // useEffect(() => {
  //   console.debug('chatBox', chatBox);
  // }, [chatBox]);

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

  const handleDeleteChatBox = () => {
    realm.write(() => {
      realm.delete(chatBox);
      realm.delete(chatCollection);
    });
    navigation.goBack();
  };

  const handleSearchInChatBox = (text: string) => {
    console.debug('search', text);
    const results = realm.objects('Message').filtered(`collectionId == "${chatCollection?.id}" && content CONTAINS[c] "${text}"`);
    console.debug('results', results);
  }

  useEffect(() => {
    if (chatBoxId === undefined) {
      // create new chat box in realm
      const boxId = new Realm.BSON.ObjectId().toHexString();
      const collectionId = new Realm.BSON.ObjectId().toHexString();
      realm.write(() => {
        const chatBox = realm.create('ChatBox', {
          id: boxId,
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
          id: collectionId,
          chatBox: chatBox,
          messages: [],
          createAt: new Date().getTime(),
          updateAt: new Date().getTime(),
        });
      });
      setChatBoxIdCopy(boxId);
    }
  }, [chatBoxId]);

  const actionItem: Array<ActionItemProps> = [
    {
      icon: 'search-outline',
      color: Colors.text_color,
      label: Strings.chatBox.optionSearch,
      onPress: () => {
        actionSheetRef.current?.hide();
        setIsSearchBarVisible(true);
      }
    },
    {
      icon: 'trash-outline',
      color: Colors.danger,
      label: Strings.chatBox.optionClear,
      onPress: () => {
        actionSheetRef.current?.hide();
        handleDeleteChatBox();
      }
    },
  ];

  const handleFetchMore = () => {
    const M = messages.length;
    const N = chatCollection?.messages.length;

    if (M < N) {
      setIsFetchingHistory(true);
      let history: Array<IMessage> = [];
      for (let i = 0; i < Math.min(N - M, CHAT_HISTORY_LOAD_LENGTH); i++) {
        history.push(chatCollection?.messages[N - M - i - 1]);
      }
      setMessages((messages) => [...messages, ...history]);
      setIsFetchingHistory(false);
    };
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={Layout.header}>
        {!isSearchBarVisible ? (
          <>
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
          </>) : (
          <>
            <TouchableOpacity onPress={() => setIsSearchBarVisible(false)} style={styles.backIcon}>
              <Ionicons name="chevron-back" size={20} color={Colors.text_color} />
            </TouchableOpacity>
            <View style={styles.searchContainer}>
              <TextInput
                autoFocus
                style={styles.searchBar}
                placeholder={Strings.chatBox.searchPlaceholder}
                placeholderTextColor={Colors.text_color}
                onChangeText={setSearchText}
              />
              <TouchableOpacity onPress={() => {
                setIsSearchBarVisible(false);
                handleSearchInChatBox(searchText);
              }}>
                <Ionicons name="search" size={20} color={Colors.text_color} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <View style={styles.container}>
        <FlashList
          inverted
          data={messages}
          renderItem={({ item }: { item: IMessage }) => <Message item={item} />}
          keyExtractor={(item, index) => index.toString()}
          // @ts-ignore
          contentContainerStyle={styles.messagesContentContainer}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={100}
          onEndReached={handleFetchMore}
          onEndReachedThreshold={0}
          ListFooterComponent={isFetchingHistory ? <ActivityIndicator size="small" color={Colors.primary} /> : null}
        />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={[styles.messageInputContainer, { paddingBottom: isKeyboardVisible ? Spacing.S : Spacing.SAFE_BOTTOM }]}>
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

      <BottomActionSheet actionRef={actionSheetRef} actions={actionItem} />
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
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white_two,
    borderRadius: 8,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.S,
  },
  searchBar: {
    ...Typography.body,
    flex: 1,
  }
});

export default ChatBox;