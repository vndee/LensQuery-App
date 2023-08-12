import Realm from 'realm';
import Strings from '../../localization';
import { Routes } from '../../types/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, LayoutAnimation, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FlashList } from '@shopify/flash-list';
import BoxCard from '../../components/Chat/BoxCard';
import { useQuery } from '../../storage/realm';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const ChatList = ({ navigation, route }: NativeStackScreenProps<Routes, 'ChatList'>) => {
  const listOfChats = useQuery('ChatBox').sorted('lastMessageAt', true);

  useEffect(() => {
    console.debug('ChatList', listOfChats);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={Layout.header}>
        <View style={{ flex: 1 }}>
          <Text style={Typography.H3}>{Strings.chatList.title}</Text>
        </View>
        <TouchableOpacity style={styles.settingIcon} onPress={() => navigation.goBack()}>
          <Ionicons name='settings-outline' size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <FlashList
          data={listOfChats}
          // @ts-expect-error
          renderItem={({ item }) => <BoxCard item={item} onPress={() => navigation.navigate('ChatBox', { chatBoxId: item.id })} onLongPress={() => { }} />}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={100}
        />
      </View>
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Lens')}>
        <Ionicons name='add' size={24} color={Colors.white} />
      </TouchableOpacity>
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
