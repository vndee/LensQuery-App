import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import 'react-native-get-random-values'
import Realm from 'realm';
import Strings from '../../localization';
import { Routes } from '../../types/navigation'; 123456
import Animated from 'react-native-reanimated';
import EventSource from '../../services/sse';
import { FlashList } from '@shopify/flash-list';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator } from 'react-native';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import { StackScreenProps } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import LabelSwitch from '../../components/Switch/LabelSwitch';
import { useRealm, useQuery, useObject } from '../../storage/realm';
import Message from '../../components/Chat/Message';
import { constructMessage } from '../../utils/Helper';
import { getOCRResult } from '../../services/api'
import { useKeyboardVisible } from '../../hooks/useKeyboard';
import { IChatEngine, IMessage, IChatBox, IMessageCollection } from '../../types/chat';
import { CHAT_HISTORY_CACHE_LENGTH, CHAT_HISTORY_LOAD_LENGTH, OPENAI_HOST, CHAT_WINDOW_SIZE } from '../../utils/Constants';
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

const ChatBox = ({ navigation, route }: StackScreenProps<Routes, 'ChatBox'>) => {
  const realm = useRealm();
  let es: EventSource | null = null;
  const isKeyboardVisible = useKeyboardVisible();
  const { chatBoxId, imageUri } = route.params;
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const listRef = useRef<FlashList<string> | null>(null);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<Array<IMessage>>([]);
  const [engine, setEngine] = useState<IChatEngine>(chatEngine[0]);
  const [chatBoxIdCopy, setChatBoxIdCopy] = useState<string>(chatBoxId ? chatBoxId : '');
  const chatBox = useObject<IChatBox>('ChatBox', chatBoxIdCopy);
  const [isFetchingHistory, setIsFetchingHistory] = useState<boolean>(false);
  const chatCollection = useObject<IMessageCollection>('MessageCollection', chatBox?.collectionId ? chatBox.collectionId : '');

  const [searchText, setSearchText] = useState<string>('');
  const [failedCount, setFailedCount] = useState<number>(0);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState<boolean>(false);

  const handleGetOCRResult = async (imageUri: string): Promise<string> => {
    const { status, data } = await getOCRResult(imageUri);
    if (status === 200) {
      return data;
    }
    return '';
  };

  const pushMessage = useCallback((text: string, type: 'user' | 'bot', engineId: string, isInterupted: boolean = false) => {
    if (!chatCollection?.id || !chatBox) return;

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

    console.log('checkpoint 2');
    setMessages((messages) => [message, ...messages]);
    if (messages.length > CHAT_HISTORY_LOAD_LENGTH) {
      setMessages((messages) => messages.slice(0, CHAT_HISTORY_CACHE_LENGTH));
    }
  }, [chatCollection]);

  const setFirstMessageState = useCallback((message: IMessage) => {
    setMessages((messages) => {
      const newMessages = [...messages];
      newMessages[0] = message;
      return newMessages;
    });
  }, []);

  const handleEvensourceEvent = (event: any) => {
    if (event.type === 'open') {
      console.log('open sse:', event)
    } else if (event.type === 'message') {
      if (!event.data || !chatCollection?.id) return;
      const message = constructMessage(chatCollection?.id, event.data, 'bot', true, engine.id);
      setFirstMessageState(message);
    } else if (event.type === 'error') {
      console.log('error', failedCount + 1, event);
      if (failedCount + 1 > 3) {
        es?.close();
        return;
      }
      setFailedCount((failedCount) => failedCount + 1);
      es?.open();
    } else if (event.type === 'done') {
      if (!chatCollection?.id || !chatBox) return;
      const message = constructMessage(chatCollection?.id, event.data, 'bot', false, engine.id);
      setFirstMessageState(message);
      realm.write(() => {
        if (chatCollection?.messages?.length > 0) {
          chatCollection.messages[chatCollection?.messages?.length - 1] = message;
        }
        chatBox.lastMessage! = message.content;
        chatBox.lastMessageAt! = message.createAt;
      });
      es?.close();
    }
  };

  const sendMessage = (text: string) => {
    Keyboard.dismiss();
    setFailedCount(0);
    if (text.length > 0) {
      // copy last message with CHAT_WINDOW_SIZE
      let context: Array<IMessage> = [];
      const L = messages.length;
      if (L > CHAT_WINDOW_SIZE) {
        context = messages.slice(0, CHAT_WINDOW_SIZE);
      } else {
        context = messages;
      }

      pushMessage(text, 'user', engine.id);
      pushMessage('...', 'bot', engine.id, true);

      // filter out image message
      context = context.filter((message) => message.type !== 'image');

      const requestBody = {
        model: engine.id,
        messages: [...context.reverse().map((message) => {
          return {
            role: message.type === 'bot' ? 'assistant' : 'user',
            content: message.content,
          }
        }), { role: 'user', content: text }],
        stream: true
      };

      setInputMessage('');
      es = new EventSource(OPENAI_HOST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(requestBody),
        debug: false,
      })
      es.addEventListener('open', handleEvensourceEvent);
      es.addEventListener('message', handleEvensourceEvent);
      es.addEventListener('error', handleEvensourceEvent);
      es.addEventListener('done', handleEvensourceEvent);
    }
  };

  useEffect(() => {
    if (!chatCollection?.messages?.length) return;

    if (messages.length === 0 && chatCollection?.messages?.length > 0) {
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
    const initData = async () => {
      if (chatBoxId === undefined) {
        let text: string = '';
        const boxId = new Realm.BSON.ObjectId().toHexString();
        const collectionId = new Realm.BSON.ObjectId().toHexString();

        if (imageUri !== undefined) {
          const message = constructMessage(collectionId, imageUri, 'image', false, engine.id);
          setMessages((messages) => [message, ...messages]);
          text = await handleGetOCRResult(imageUri)
        }

        // create new chat box in realm
        const ocrMessage = constructMessage(collectionId, text, 'bot', false, engine.id);
        setMessages((messages) => [ocrMessage, ...messages]);
        const updatedTime = new Date().getTime();
        realm.write(() => {
          const chatBox = realm.create('ChatBox', {
            id: boxId,
            name: '',
            engineId: engine.id,
            collectionId: collectionId,
            lastMessage: text,
            lastMessageAt: updatedTime,
            createAt: updatedTime,
            updateAt: updatedTime,
          });

          // create new collection for this chat box
          realm.create('MessageCollection', {
            id: collectionId,
            chatBox: chatBox,
            messages: [ocrMessage],
            createAt: updatedTime,
            updateAt: updatedTime,
          });
        });
        setChatBoxIdCopy(boxId);
      }
    };

    console.log('chatBoxId', chatBoxId);
    console.log('imageUri', imageUri);
    initData();
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
    if (!chatCollection?.messages?.length) return;

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
              <TouchableOpacity onPress={() => navigation.navigate('ChatList')} style={styles.backIcon}>
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