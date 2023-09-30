import Realm from 'realm';
import 'react-native-get-random-values'
import Strings from '../../localization';
import { useSelector } from 'react-redux';
import EventSource from '../../services/sse';
import { Routes } from '../../types/navigation';
import { FlashList } from '@shopify/flash-list';
import { IAppConfig } from '../../types/chat';
import Toast from 'react-native-simple-toast';
import { getOCRText } from '../../services/api';
import Message from '../../components/Chat/Message';
import { constructMessage } from '../../utils/Helper';
import { checkValidApiKey } from '../../services/openai';
import { getKeyLimit } from '../../services/openrouter';
import Clipboard from '@react-native-clipboard/clipboard';
import { getPressableStyle } from '../../styles/Touchable';
import { StackScreenProps } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { useRealm, useObject } from '../../storage/realm';
import { useKeyboardVisible } from '../../hooks/useKeyboard';
import ProgressCircle from 'react-native-progress/CircleSnail';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import { TGetModelPropertiesResponse } from '../../types/openrouter';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IMessage, IChatBox, IMessageCollection } from '../../types/chat';
import BottomActionSheet, { ActionItemProps, ActionSheetRef } from '../../components/ActionSheet/BottomSheet';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Alert, Platform, Keyboard, Modal, Pressable } from 'react-native';
import { CHAT_HISTORY_CACHE_LENGTH, CHAT_HISTORY_LOAD_LENGTH, OPENAI_HOST, CHAT_WINDOW_SIZE, OPENROUTER_HOST } from '../../utils/Constants';

const ChatBox = ({ navigation, route }: StackScreenProps<Routes, 'ChatBox'>) => {
  let failedCount: number = 0;
  const realm = useRealm();
  let es: EventSource | null = null;
  const { userToken } = useSelector((state: any) => state.auth);
  const isKeyboardVisible = useKeyboardVisible();
  const { chatBoxId, imageUri, type } = route.params;
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const messageActionSheetRef = useRef<ActionSheetRef>(null);
  const appConf = useObject<IAppConfig>('AppConfig', userToken);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<Array<IMessage>>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [chatBoxIdCopy, setChatBoxIdCopy] = useState<string>(chatBoxId ? chatBoxId : '');
  const chatBox = useObject<IChatBox>('ChatBox', chatBoxIdCopy);
  const [apiKey, setApiKey] = useState<string>('');
  const [isFetchingHistory, setIsFetchingHistory] = useState<boolean>(false);
  const chatCollection = useObject<IMessageCollection>('MessageCollection', chatBox?.collectionId ? chatBox.collectionId : '');

  const [searchText, setSearchText] = useState<string>('');
  const [isSearchBarVisible, setIsSearchBarVisible] = useState<boolean>(false);
  const [isNotFoundKeyModalVisible, setIsNotFoundKeyModalVisible] = useState<boolean>(false);

  const [selectedMessageID, setSelectedMessageID] = useState<string>('');
  const [selectedMessageContent, setSelectedMessageContent] = useState<string>('');

  const handleUnknowError = useCallback(() => {
    if (!chatCollection?.id) return;
    realm.write(() => {
      setMessages((messages) => messages.slice(1));
    });

    Toast.showWithGravityAndOffset(
      Strings.common.unknownError,
      Toast.LONG,
      Toast.TOP,
      0,
      70
    )
  }, []);

  const pushMessage = useCallback((text: string, type: 'user' | 'bot', engineId: string, isInterupted: boolean = false, provider: string) => {
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
      userToken: userToken,
      provider: provider,
    };
    setMessages((messages) => [message, ...messages]);
    if (messages.length > CHAT_HISTORY_LOAD_LENGTH) {
      setMessages((messages) => messages.slice(0, CHAT_HISTORY_CACHE_LENGTH));
    }

    if (type === 'bot' && text === '...') {
      return;
    }
    realm.write(() => {
      chatCollection.messages.push(message);
      chatBox.lastMessage! = message.content;
      chatBox.lastMessageAt! = message.createAt;
    });
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
      console.log('open sse:', event);
    } else if (event.type === 'message') {
      if (!event.data || !chatCollection?.id) return;
      const message = constructMessage(chatCollection?.id, event.data, 'bot', true, selectedModel, userToken, selectedProvider);
      setFirstMessageState(message);
    } else if (event.type === 'error') {
      try {
        if (event.xhrStatus === 429) {
          es?.close();
          Alert.alert(
            Strings.common.alertTitle,
            Strings.chatBox.insufficientQuota,
            [
              {
                text: Strings.common.ok,
                onPress: handleUnknowError,
              }
            ]
          )
          return;
        }
      } catch (error) {
        console.log('error', error);
      }

      console.log('error', failedCount + 1, event);
      if (failedCount + 1 > 3) {
        es?.close();
        handleUnknowError();
        return;
      }
      failedCount++;
      es?.open();
    } else if (event.type === 'done') {
      if (!chatCollection?.id || !chatBox) return;
      const message: IMessage = constructMessage(chatCollection?.id, event.data, 'bot', false, selectedModel, userToken, selectedProvider);
      setFirstMessageState(message);
      realm.write(() => {
        if (chatCollection?.messages) {
          chatCollection.messages.push(message);
          chatBox.lastMessage! = message.content;
          chatBox.lastMessageAt! = message.createAt;
        }
      });
      es?.close();
    }
  };

  const sendMessage = (text: string) => {
    Keyboard.dismiss();

    failedCount = 0;
    if (text.length > 0) {
      // copy last message with CHAT_WINDOW_SIZE
      let context: Array<IMessage> = [];
      const L = messages.length;
      if (L > CHAT_WINDOW_SIZE) {
        context = messages.slice(0, CHAT_WINDOW_SIZE);
      } else {
        context = messages;
      }

      pushMessage(text, 'user', selectedModel, false, selectedProvider);
      pushMessage('...', 'bot', selectedModel, true, selectedProvider);

      // filter out image message
      context = context.filter((message) => message.type !== 'image');

      const requestBody = {
        model: selectedModel,
        messages: [...context.reverse().map((message) => {
          return {
            role: message.type === 'bot' ? 'assistant' : 'user',
            content: message.content,
          }
        }), { role: 'user', content: text }],
        stream: true
      };
      setInputMessage('');
      console.log(`using model ${selectedModel} from ${selectedProvider}`)

      es = new EventSource(`${selectedProvider === 'OpenAI' ? OPENAI_HOST : OPENROUTER_HOST}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://lensquery.com',
          'X-Title': 'LensQuery'
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
    Keyboard.dismiss();
    setSearchText('');
    console.debug('results', results);
  };

  const handleShowMessageOption = (id: string, content: string) => {
    setSelectedMessageID(id);
    setSelectedMessageContent(content);
    messageActionSheetRef.current?.show();
  };

  const handleCopyToClipboard = (text: string) => {
    Clipboard.setString(text);
  };

  const handleDeleteMessage = (id: string) => {
    if (!chatCollection?.id) return;
    setMessages((messages) => messages.filter((message) => message.id !== id));
    realm.write(() => {
      const message = realm.objectForPrimaryKey('Message', id);
      realm.delete(message);
    });
  };

  const alertCannotRecognizeText = (_chatBox: Realm.Object<IChatBox>, _messageCollection: Realm.Object<IMessageCollection>) => {
    Alert.alert(
      Strings.common.alertTitle,
      Strings.chatBox.cannotRecognizeMessage,
      [
        {
          text: Strings.common.ok,
          onPress: () => {
            realm.write(() => {
              if (_chatBox) realm.delete(_chatBox);
              if (_messageCollection) realm.delete(_messageCollection);
            })
            navigation.goBack()
          },
          style: 'default'
        },
      ]
    );
  };

  const alertNotEnoughCredit = (_chatBox: Realm.Object<IChatBox>, _messageCollection: Realm.Object<IMessageCollection>) => {
    Alert.alert(
      Strings.common.alertTitle,
      Strings.chatBox.notEnoughCredit,
      [
        {
          text: Strings.common.ok,
          onPress: () => {
            realm.write(() => {
              if (_chatBox) realm.delete(_chatBox);
              if (_messageCollection) realm.delete(_messageCollection);
            })
            navigation.navigate('Paywall')
          },
          style: 'default'
        },
      ]
    );
  };

  const checkValidKey = async (): Promise<{ status: boolean, key: string, model: string, provider: string }> => {
    if (appConf?.defaultProvider === 'OpenAI') {
      const key = appConf?.openAI?.apiKey;
      const isValid = await checkValidApiKey(key);
      if (isValid) {
        const defaultModel = JSON.parse(appConf?.openAI.defaultModel) as TGetModelPropertiesResponse;
        return { status: true, key: key, model: defaultModel?.id, provider: appConf?.defaultProvider }
      } else {
        return { status: false, key: '', model: '', provider: '' }
      }
    } else if (appConf?.defaultProvider === 'OpenRouter') {
      const key = appConf?.openRouter?.apiKey;
      const { status, data } = await getKeyLimit(key);
      if (status === 200) {
        const defaultModel = JSON.parse(appConf?.openRouter.defaultModel) as TGetModelPropertiesResponse;
        return { status: true, key: key, model: defaultModel?.id, provider: appConf?.defaultProvider }
      } else {
        return { status: false, key: '', model: '', provider: '' }
      }
    }

    return { status: false, key: '', model: '', provider: '' }
  };

  useEffect(() => {
    const initData = async () => {
      console.log(`[Image Uri]: ${imageUri} ~ [OCR Type]: ${type} ~ [ChatBoxID]: ${chatBoxId}`);
      if (chatBoxId === undefined) {
        let text: string = '';
        const boxId = new Realm.BSON.ObjectId().toHexString();
        const collectionId = new Realm.BSON.ObjectId().toHexString();
        const { _chatBox, _messageCollection } = realm.write(() => {
          const _chatBox: Realm.Object<IChatBox> = realm.create('ChatBox', {
            id: boxId,
            name: '',
            engineId: selectedModel,
            collectionId: collectionId,
            lastMessage: '',
            lastMessageAt: new Date().getTime(),
            createAt: new Date().getTime(),
            updateAt: new Date().getTime(),
            userToken: userToken,
          });

          // create new collection for this chat box
          const _messageCollection: Realm.Object<IMessageCollection> = realm.create('MessageCollection', {
            id: collectionId,
            chatBox: chatBox,
            messages: [],
            createAt: new Date().getTime(),
            updateAt: new Date().getTime(),
            userToken: userToken,
          });
          setChatBoxIdCopy(boxId);
          return { _chatBox, _messageCollection }
        })

        if (imageUri !== undefined) {
          const message = constructMessage(collectionId, imageUri, 'image', false, selectedModel, userToken, selectedProvider);
          const typingMessage = constructMessage(collectionId, '...', 'bot', true, selectedModel, userToken, selectedProvider);
          setMessages((messages) => [typingMessage, message, ...messages]);
          realm.write(() => {
            // @ts-ignore
            _messageCollection.messages = [message];
            // @ts-ignore
            _messageCollection.updateAt = new Date().getTime();
          });

          const { status, data, title } = await getOCRText(imageUri, type);
          if (status === 200) {
            text = data;
          } else if (status === 402) {
            alertNotEnoughCredit(_chatBox, _messageCollection);
            return;
          }

          if (text === undefined || text === '') {
            alertCannotRecognizeText(_chatBox, _messageCollection);
            return;
          }

          // create new chat box in realm
          const ocrMessage = constructMessage(collectionId, text, 'bot', false, selectedModel, userToken, selectedProvider);
          setFirstMessageState(ocrMessage);

          const updatedTime = new Date().getTime();
          realm.write(() => {
            // @ts-ignore
            _messageCollection.messages = [message, ocrMessage];
            // @ts-ignore
            _messageCollection.updateAt = updatedTime;

            let _chatName = title.length > 50 ? title.slice(0, 50) + '...' : title;
            _chatName = _chatName.replace(/\n/g, ' ');

            // @ts-ignore
            _chatBox.name = _chatName;
            // @ts-ignore
            _chatBox.lastMessage = ocrMessage.content;
            // @ts-ignore
            _chatBox.lastMessageAt = updatedTime;
            // @ts-ignore
            _chatBox.updateAt = updatedTime;
          });
          setChatBoxIdCopy(boxId);
        }
      }
    };

    const initApiKey = async () => {
      const { status, key, model, provider } = await checkValidKey();
      if (status) {
        setApiKey(key);
        setSelectedModel(model);
        setSelectedProvider(provider);
      } else {
        setIsNotFoundKeyModalVisible(true);
      }
    };

    initData();
    initApiKey();
  }, [chatBoxId]);

  useEffect(() => {
    const initApiKey = async () => {
      const { status, key, model, provider } = await checkValidKey();
      if (status) {
        setApiKey(key);
        setSelectedModel(model);
        setSelectedProvider(provider);
      } else {
        setIsNotFoundKeyModalVisible(true);
      }
    };

    initApiKey();
  }, [appConf]);

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

  const messageActionItem: Array<ActionItemProps> = [
    {
      icon: 'copy-outline',
      color: Colors.text_color,
      label: Strings.chatBox.messageOptionCopy,
      onPress: () => {
        handleCopyToClipboard(selectedMessageContent);
        messageActionSheetRef.current?.hide();
      }
    },
    {
      icon: 'trash-outline',
      color: Colors.danger,
      label: Strings.chatBox.messageOptionDelete,
      onPress: () => {
        handleDeleteMessage(selectedMessageID);
        messageActionSheetRef.current?.hide();
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
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={Layout.header}>
        {!isSearchBarVisible ? (
          <>
            <View style={styles.row}>
              <Pressable onPress={() => navigation.navigate('ChatList')} style={getPressableStyle} hitSlop={20}>
                <Ionicons name="arrow-back" size={20} color={Colors.white} />
              </Pressable>
              <Text style={[Typography.H3, { color: Colors.white }]}>{Strings.chatBox.title}</Text>
            </View>

            <View style={styles.headerRight}>
              <Pressable style={getPressableStyle} onPress={() => actionSheetRef.current?.show()} hitSlop={20}>
                <Feather name="more-vertical" size={20} color={Colors.white} />
              </Pressable>
            </View>
          </>) : (
          <>
            <Pressable onPress={() => setIsSearchBarVisible(false)} style={getPressableStyle} hitSlop={20}>
              <Ionicons name="arrow-back" size={20} color={Colors.white} />
            </Pressable>
            <View style={styles.searchContainer}>
              <TextInput
                autoFocus
                style={[Typography.body, { flex: 1, color: Colors.white }]}
                placeholder={Strings.chatList.searchPlaceholder}
                placeholderTextColor={Colors.white}
                onChangeText={setSearchText}
                value={searchText}
              />
              <Pressable onPress={() => {
                setIsSearchBarVisible(false);
                handleSearchInChatBox(searchText);
              }}
                style={getPressableStyle}
                hitSlop={20}
              >
                <Ionicons name="search" size={20} color={Colors.white} />
              </Pressable>
            </View>
          </>
        )}
      </View>
      <View style={styles.container}>
        <FlashList
          inverted
          data={messages}
          renderItem={({ item }: { item: IMessage }) => <Message item={item} onLongPress={() => handleShowMessageOption(item.id, item.content)} />}
          keyExtractor={(item, index) => index.toString()}
          // @ts-ignore
          contentContainerStyle={styles.messagesContentContainer}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={100}
          onEndReached={handleFetchMore}
          onEndReachedThreshold={0}
          ListFooterComponent={isFetchingHistory ? <ProgressCircle size={20} color={Colors.primary} thickness={2} /> : null}
        />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={[styles.messageInputContainer, { paddingBottom: isKeyboardVisible ? Spacing.S : Spacing.SAFE_BOTTOM }]}>
          <TextInput
            style={styles.messageInput}
            placeholder={Strings.chatBox.placeholder}
            placeholderTextColor={Colors.hint}
            value={inputMessage}
            onChangeText={setInputMessage}
            onSubmitEditing={() => sendMessage(inputMessage)}
          />
          <Pressable onPress={() => sendMessage(inputMessage)} style={({ pressed }) => [styles.sendIcon, getPressableStyle({ pressed })]} hitSlop={20}>
            <Feather name="send" size={28} color={Colors.primary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      {/* <Toast
        position='top'
        bottomOffset={20}
      /> */}

      <BottomActionSheet actionRef={actionSheetRef} actions={actionItem} />
      <BottomActionSheet actionRef={messageActionSheetRef} actions={messageActionItem} />

      <Modal
        animationType="fade"
        transparent={true}
        visible={isNotFoundKeyModalVisible}
        onRequestClose={() => {
          setIsNotFoundKeyModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={Typography.title}>{Strings.chatBox.notFoundKeyModalTitle}</Text>
            <Text style={[Typography.description, { textAlign: 'center' }]}>{Strings.chatBox.notFoundKeyModalDescription}</Text>
            <Pressable onPress={() => { setIsNotFoundKeyModalVisible(false); navigation.navigate('Settings') }} style={getPressableStyle}>
              <Text style={[Typography.body, { color: Colors.primary, fontWeight: 'bold' }]}>{Strings.chatBox.notFoundKeyModalAction}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View >
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    ...Layout.content,
    backgroundColor: Colors.background,
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
    borderTopWidth: 0.5,
    borderTopColor: Colors.borders,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.horizontalPadding,
    ...Layout.shadow
  },
  messageInput: {
    ...Typography.body,
    flex: 1,
    backgroundColor: Colors.white_two,
    paddingVertical: Spacing.M,
    paddingHorizontal: Spacing.M,
    borderRadius: Spacing.M,
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
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.S,
  },
  searchBar: {
    ...Typography.body,
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    gap: Spacing.S,
  },
});

export default ChatBox;