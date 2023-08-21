import Realm from 'realm';
import Strings from '../../localization';
import { Routes } from '../../types/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, LayoutAnimation, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, NativeSyntheticEvent, TextInputChangeEventData, Alert } from 'react-native';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FlashList } from '@shopify/flash-list';
import BoxCard from '../../components/Chat/BoxCard';
import { useRealm, useQuery, useObject } from '../../storage/realm';
import { healthCheck, getOCRAccessToken } from '../../services/api'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BottomActionSheet, { ActionItemProps, ActionSheetRef } from '../../components/ActionSheet/BottomSheet';

const ChatList = ({ navigation, route }: NativeStackScreenProps<Routes, 'ChatList'>) => {
  const realm = useRealm();
  const listRef = useRef<FlashList<number> | null>(null);
  const listOfChats = useQuery('ChatBox').sorted('lastMessageAt', true);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [selectedChatBoxId, setSelectedChatBoxId] = useState<string>('');
  const selectedChatBox = useObject('ChatBox', selectedChatBoxId);
  const selectedMessageCollection = useObject('MessageCollection', selectedChatBox?.collectionId || '');

  const handleGetOCRAccessToken = async () => {
    const resp = await getOCRAccessToken();
    console.log('resp', resp);
  }

  const handleHealthCheck = async () => {
    const resp = await healthCheck();
    console.log('resp', resp);
  }

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

  const actionItem: Array<ActionItemProps> = [
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
      color: Colors.text_color,
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

  useEffect(() => {
    console.debug('ChatList', listOfChats);
    handleHealthCheck();
    handleGetOCRAccessToken();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={Layout.header}>
        <View style={{ flex: 1 }}>
          <Text style={Typography.H3}>{Strings.chatList.title}</Text>
        </View>
        <TouchableOpacity style={styles.settingIcon} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name='settings-outline' size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <FlashList
          ref={listRef}
          data={listOfChats}
          // @ts-expect-error
          renderItem={({ item }) => <BoxCard item={item} onPress={() => navigation.navigate('ChatBox', { chatBoxId: item.id })} onLongPress={() => { setSelectedChatBoxId(item?.id); actionSheetRef?.current?.show(); }} />}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={100}
        />
      </View>
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('ChatBox', { chatBoxId: undefined, imageUri: undefined })}>
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

});

export default ChatList;
