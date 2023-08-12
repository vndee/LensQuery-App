import Realm from 'realm';
import Strings from '../../localization';
import { Routes } from '../../types/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, LayoutAnimation, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FlashList } from '@shopify/flash-list';
import BoxCard from '../../components/Chat/BoxCard';
import { useRealm, useQuery, useObject } from '../../storage/realm';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IChatBox } from '../../types/chat';

const ChatList = ({ navigation, route }: NativeStackScreenProps<Routes, 'ChatList'>) => {
  const realm = useRealm();
  const listOfChats = useQuery('ChatBox').sorted('lastMessageAt', true);

  useEffect(() => {
    console.debug('ChatList', listOfChats);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={Layout.header}>
        <Text style={Typography.H3}>{Strings.chatList.title}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <FlashList
          data={listOfChats}
          // @ts-expect-error
          renderItem={({ item }) => <BoxCard item={item} onPress={() => navigation.navigate('ChatBox', { chatBoxId: item._id.toHexString() })} onLongPress={() => { }} />}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={100}
        />
      </View>
    </View>
  )
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.XS
  },
});

export default ChatList;
