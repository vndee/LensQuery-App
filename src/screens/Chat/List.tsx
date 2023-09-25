import { isEmpty } from 'lodash';
import Modal from 'react-native-modal';
import Strings from '../../localization';
import { useSelector } from 'react-redux';
import { SvgXml } from 'react-native-svg';
import { Routes } from '../../types/navigation';
import { FlashList } from '@shopify/flash-list';
import BoxCard from '../../components/Chat/BoxCard';
import TextEdit from '../../components/Input/TextEdit';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getPressableStyle } from '../../styles/Touchable';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useRef, useCallback } from 'react';
import { IChatBox, IMessageCollection } from '../../types/chat';
import { NotFoundXML } from '../../components/Illustrations/NotFound';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import { useRealm, useQuery, useObject } from '../../storage/realm';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../styles/Spacing';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomActionSheet, { ActionItemProps, ActionSheetRef } from '../../components/ActionSheet/BottomSheet';
import { LayoutAnimation, View, Text, StyleSheet, Alert, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const ChatList = ({ navigation, route }: StackScreenProps<Routes, 'ChatList'>) => {
  const realm = useRealm();
  const { language } = useSelector((state: any) => state.auth);
  const { userToken } = useSelector((state: any) => state.auth);
  const listRef = useRef<FlashList<IChatBox> | null>(null);
  const listOfChats = useQuery<IChatBox>('ChatBox').filtered('userToken == $0', userToken).sorted('lastMessageAt', true);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [isSelectedMode, setIsSelectedMode] = useState<boolean>(false);
  const [selectedBox, setSelectedBox] = useState<Set<string>>(new Set());
  const [isSelectedAll, setIsSelectedAll] = useState<boolean>(false);
  const [selectedChatBoxId, setSelectedChatBoxId] = useState<string>('');
  const selectedChatBox = useObject<IChatBox>('ChatBox', selectedChatBoxId);
  const selectedMessageCollection = useObject<IMessageCollection>('MessageCollection', selectedChatBox?.collectionId || '');

  const [isEditNameModalVisible, setIsEditNameModalVisible] = useState<boolean>(false);
  const [selectedNewName, setSelectedNewName] = useState<string>('');
  const [newNameError, setNewNameError] = useState<string>('');

  const { subscriptionPlan } = useSelector((state: any) => state.auth);

  const handleDeleteChatBox = () => {
    actionSheetRef.current?.hide();
    realm.write(() => {
      realm.delete(selectedChatBox);
      realm.delete(selectedMessageCollection);
    });

    listRef.current?.prepareForLayoutAnimationRender();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    console.log(`Delete chatbox ${selectedChatBoxId} successfully!`);
  }

  const handleDeleteBactch = () => {
    if (isSelectedAll) {
      realm.write(() => {
        realm.delete(listOfChats);
      });

      return;
    }

    if (selectedBox.size === 0) {
      return;
    }

    realm.write(() => {
      for (const id of selectedBox) {
        const chatBox = realm.objectForPrimaryKey<IChatBox>('ChatBox', id);
        const messageCollection = realm.objectForPrimaryKey<IMessageCollection>('MessageCollection', chatBox?.collectionId || '');
        realm.delete(chatBox);
        realm.delete(messageCollection);
      }
      setSelectedBox(new Set());
    });
  };

  const handleSaveName = () => {
    if (isEmpty(selectedNewName)) {
      setNewNameError(Strings.chatList.newNameError);
      return;
    }

    realm.write(() => {
      const chatBox = realm.objectForPrimaryKey<IChatBox>('ChatBox', selectedChatBoxId);
      if (chatBox) {
        chatBox.name = selectedNewName;
      }
      setTimeout(() => {
        setIsEditNameModalVisible(false);
        setSelectedNewName('');
      }, 300);
    })
  };

  const alertDeleteBactch = () => {
    Alert.alert(
      Strings.common.alertTitle,
      // @ts-ignore
      Strings.formatString(Strings.chatList.deleteBatchMessageWarning, isSelectedAll ? listOfChats.length.toString() : selectedBox.size.toString()),
      [
        { text: Strings.common.cancel, onPress: () => { }, style: 'cancel' },
        { text: Strings.common.ok, onPress: () => handleDeleteBactch(), style: 'destructive' }
      ],
    )
  }

  const actionItem: Array<ActionItemProps> = [
    {
      icon: 'copy-outline',
      label: Strings.chatList.selectedOption,
      color: Colors.text_color,
      onPress: () => { actionSheetRef.current?.hide(); setIsSelectedMode(true); }
    },
    {
      icon: 'create-outline',
      label: Strings.chatList.editNameOption,
      color: Colors.text_color,
      onPress: () => {
        actionSheetRef.current?.hide();
        setTimeout(() => {
          setIsEditNameModalVisible(true)
        }, 400);
        console.log('Edit chatbox name');
      }
    },
    {
      icon: 'trash-outline',
      label: Strings.chatList.deleteOption,
      color: Colors.danger,
      onPress: () => {
        Alert.alert(
          Strings.common.alertTitle,
          Strings.chatList.deleteConfirmationMessage,
          [
            { text: Strings.common.cancel, onPress: () => { }, style: 'cancel' },
            { text: Strings.common.ok, onPress: () => handleDeleteChatBox(), style: 'destructive' }
          ],
        );
      }
    }
  ];

  const renderDefaultHeader = useCallback(() => {
    return (
      <>
        <Pressable onPress={() => navigation.navigate('ChatSearch')} style={getPressableStyle} hitSlop={20}>
          <Ionicons name='search-outline' size={24} color={Colors.white} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: Spacing.S }}>
          <Text style={[Typography.H3, { color: Colors.white }]}>{Strings.chatList.title}</Text>
        </View>
        <Pressable style={getPressableStyle} onPress={() => navigation.navigate('Settings')} hitSlop={20}>
          <Ionicons name='settings-outline' size={24} color={Colors.white} />
        </Pressable>
      </>
    );
  }, [language]);

  const renderSelectedHeader = useCallback(() => {
    return (
      <View style={styles.row}>
        <Pressable onPress={() => { setIsSelectedAll(!isSelectedAll); setSelectedBox(new Set()) }} style={getPressableStyle} hitSlop={20}>
          <View style={[styles.checkBox]}>
            {isSelectedAll && <View style={styles.innerBox} />}
          </View>
        </Pressable>
        <Text style={[Typography.title, { flex: 1, color: Colors.white }]}>{isSelectedAll ? listOfChats.length : selectedBox.size} {Strings.chatList.selected}</Text>
        <View style={{ flexDirection: 'row', gap: Spacing.M, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
          <Pressable style={getPressableStyle} hitSlop={5} onPress={alertDeleteBactch}>
            <Ionicons name='trash-outline' size={20} color={Colors.white} />
          </Pressable>
          <Pressable style={getPressableStyle} hitSlop={5} onPress={() => { setIsSelectedMode(false); setSelectedBox(new Set()); }}>
            <Ionicons name='close-outline' size={24} color={Colors.white} />
          </Pressable>
        </View>
      </View>
    );
  }, [isSelectedAll, selectedBox, language]);

  const renderEmptyComponent = useCallback(() => {
    return (
      <View style={styles.svgIllus}>
        <SvgXml xml={NotFoundXML} width="100%" height="100%" />
        <Text style={[styles.body, { marginTop: Spacing.L }]}>{Strings.chatList.notFound}</Text>
      </View>
    );
  }, [language]);

  let header = renderDefaultHeader();
  if (isSelectedMode) {
    header = renderSelectedHeader();
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={Layout.header}>
        {header}
      </View>
      <View style={[{ flex: 1 }, listOfChats.length === 0 && { justifyContent: 'center' }]}>
        {
          listOfChats.length > 0 ?
            <FlashList
              ref={listRef}
              data={listOfChats}
              renderItem={({ item }: { item: IChatBox }) =>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                  <BoxCard
                    item={item}
                    isSelected={selectedBox.has(item?.id) || isSelectedAll}
                    selectedMode={isSelectedMode}
                    onPress={() => !isSelectedMode ? navigation.navigate('ChatBox', { chatBoxId: item.id, imageUri: undefined, type: 'FREE_TEXT' }) : setSelectedBox((prev) => { prev.has(item?.id) ? prev.delete(item?.id) : prev.add(item?.id); return new Set(prev); })}
                    onLongPress={() => { setSelectedChatBoxId(item?.id); actionSheetRef?.current?.show(); }}
                  />
                </KeyboardAvoidingView>}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              estimatedItemSize={100}
              ItemSeparatorComponent={() => <View style={{ height: 0.5, backgroundColor: Colors.borders }} />}
            /> :
            renderEmptyComponent()
        }
      </View>

      <View style={styles.fab}>
        <Pressable style={({ pressed }) => [styles.fabBtn01, { opacity: pressed ? 0.4 : 1 }]} onPress={() => navigation.navigate('ChatBox', { chatBoxId: undefined, imageUri: undefined, type: 'FREE_TEXT' })} hitSlop={20}>
          <MaterialCommunityIcons name='chat-plus-outline' size={18} color={Colors.white} />
        </Pressable>

        <Pressable
          hitSlop={20}
          onPress={() => {
            if (!isEmpty(subscriptionPlan)) {
              navigation.navigate('Lens');
            } else {
              navigation.navigate('Paywall');
            }
          }}
          style={({ pressed }) => [styles.fabBtn02, { opacity: pressed ? 0.4 : 1 }]}
        >
          <Ionicons name='camera' size={20} color={Colors.white} />
        </Pressable>
      </View>

      <BottomActionSheet actionRef={actionSheetRef} actions={actionItem} />

      <Modal
        isVisible={isEditNameModalVisible}
        animationInTiming={300}
        onBackdropPress={() => setIsEditNameModalVisible(false)}
        style={styles.modalView}
      >
        <View style={styles.modalContent}>
          <Text>{Strings.chatList.newName}</Text>
          <TextInput
            value={selectedNewName}
            onChangeText={setSelectedNewName}
            style={[styles.inputNewName, !isEmpty(newNameError) && { borderColor: Colors.danger }]}
          />
          <View style={{ flexDirection: 'row', gap: Spacing.M }}>
            <Pressable style={(pressed) => [getPressableStyle(pressed), styles.saveNameBtn, { backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.primary }]}
              onPress={() => {
                setSelectedNewName('');
                setIsEditNameModalVisible(false);
              }}>
              <Text style={[Typography.body, { fontWeight: 'bold', color: Colors.primary }]}>{Strings.chatList.cancelName}</Text>
            </Pressable>

            <Pressable style={(pressed) => [getPressableStyle(pressed), styles.saveNameBtn, { borderWidth: 1, borderColor: Colors.primary }]} onPress={handleSaveName}>
              <Text style={[Typography.body, { fontWeight: 'bold', color: Colors.white }]}>{Strings.chatList.saveName}</Text>
            </Pressable>
          </View>
        </View>
      </Modal >
    </View >
  )
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.XS
  },
  svgIllus: {
    width: '50%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  fab: {
    width: 44,
    height: 84,
    position: 'absolute',
    bottom: Spacing.safePaddingBottom,
    right: Spacing.XL,
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
  },
  fabBtn01: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,

    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
  },
  fabBtn02: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,

    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
  },
  checkBox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borders,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.S,
  },
  innerBox: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.white,
  },
  modalView: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.S,
  },
  modalContent: {
    gap: Spacing.M,
    padding: Spacing.M,
    justifyContent: 'center',
    borderRadius: Spacing.M,
    width: SCREEN_WIDTH - Spacing.XL * 2,
    backgroundColor: Colors.background
  },
  inputNewName: {
    borderWidth: 1,
    borderRadius: Spacing.S,
    borderColor: Colors.borders,
    padding: Spacing.S,
    width: '100%',
  },
  saveNameBtn: {
    flex: 1,
    padding: Spacing.S,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Spacing.S,
  }
});

export default ChatList;
