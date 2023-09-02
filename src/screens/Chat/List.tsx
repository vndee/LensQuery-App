import Strings from '../../localization';
import { useSelector } from 'react-redux';
import { Routes } from '../../types/navigation';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Keyboard, LayoutAnimation, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FlashList } from '@shopify/flash-list';
import BoxCard from '../../components/Chat/BoxCard';
import { useRealm, useQuery, useObject } from '../../storage/realm';
import { StackScreenProps } from '@react-navigation/stack';
import BottomActionSheet, { ActionItemProps, ActionSheetRef } from '../../components/ActionSheet/BottomSheet';
import { IChatBox, IMessageCollection } from '../../types/chat';

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
        <TouchableOpacity onPress={() => navigation.navigate('ChatSearch')} style={{ marginRight: Spacing.S }}>
          <Ionicons name='search-outline' size={24} color={Colors.text_color} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={Typography.H3}>{Strings.chatList.title}</Text>
        </View>
        <TouchableOpacity style={styles.settingIcon} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name='settings-outline' size={24} color={Colors.primary} />
        </TouchableOpacity>
      </>
    );
  }, [language]);

  const renderSelectedHeader = useCallback(() => {
    return (
      <View style={styles.row}>
        <TouchableOpacity onPress={() => { setIsSelectedAll(!isSelectedAll); setSelectedBox(new Set()) }}>
          <View style={[styles.checkBox, isSelectedAll && { backgroundColor: Colors.primary, borderWidth: 0 }]} />
        </TouchableOpacity>
        <Text style={[Typography.title, { flex: 1 }]}>{isSelectedAll ? listOfChats.length : selectedBox.size} {Strings.chatList.selected}</Text>
        <TouchableOpacity style={{ marginLeft: 'auto', marginRight: Spacing.S }} onPress={alertDeleteBactch}>
          <Ionicons name='trash-outline' size={20} color={Colors.danger} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => { setIsSelectedMode(false); setSelectedBox(new Set()); }}>
          <Ionicons name='close-outline' size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    );
  }, [isSelectedAll, selectedBox, language]);

  let header = renderDefaultHeader();
  if (isSelectedMode) {
    header = renderSelectedHeader();
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={Layout.header}>
        {header}
      </View>
      <View style={{ flex: 1 }}>
        <FlashList
          ref={listRef}
          data={listOfChats}
          renderItem={({ item }: { item: IChatBox }) => <BoxCard
            item={item}
            isSelected={selectedBox.has(item?.id) || isSelectedAll}
            selectedMode={isSelectedMode}
            onPress={() => !isSelectedMode ? navigation.navigate('ChatBox', { chatBoxId: item.id, imageUri: undefined }) : setSelectedBox((prev) => { prev.has(item?.id) ? prev.delete(item?.id) : prev.add(item?.id); return new Set(prev); })}
            onLongPress={() => { setSelectedChatBoxId(item?.id); actionSheetRef?.current?.show(); }}
          />}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={100}
        />
      </View>
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Lens')}>
        <Ionicons name='add' size={24} color={Colors.white} />
      </TouchableOpacity>

      <BottomActionSheet actionRef={actionSheetRef} actions={actionItem} />
    </View>
  )
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.XS
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.XL,
    right: Spacing.XL,
    width: 44,
    height: 44,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',

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
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.borders,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.S,
  },
});

export default ChatList;
