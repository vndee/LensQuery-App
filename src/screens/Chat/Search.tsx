import React, { useState, useCallback, useRef } from 'react';
import { Routes } from '../../types/navigation';
import Strings from '../../localization';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '../../storage/realm';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IChatBox } from '../../types/chat';
import BoxCard from '../../components/Chat/BoxCard';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard, TextInput } from 'react-native';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import { StackScreenProps } from '@react-navigation/stack';


const ChatSearch = ({ navigation, route }: StackScreenProps<Routes, 'ChatSearch'>) => {
  const [searchText, setSearchText] = useState<string>('');
  const listRef = useRef<FlashList<IChatBox> | null>(null);
  const listOfChats = useQuery<IChatBox>('ChatBox').sorted('lastMessageAt', true).filtered(`name CONTAINS[c] "${searchText}"`);

  const renderSearchHeader = useCallback(() => {
    return (
      <View style={styles.row}>
        <TouchableOpacity onPress={() => { setSearchText(''); Keyboard.dismiss(); navigation.goBack(); }}>
          <Ionicons name='close-outline' size={24} color={Colors.primary} />
        </TouchableOpacity>
        <TextInput
          style={[Typography.body, { flex: 1 }]}
          placeholder={Strings.chatList.searchPlaceholder}
          placeholderTextColor={Colors.text_color}
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
        />
      </View>
    );
  }, [searchText]);

  return (
    <View style={{ flex: 1 }}>
      <View style={Layout.header}>
        {renderSearchHeader()}
      </View>
      <View style={{ flex: 1 }}>
        <FlashList
          ref={listRef}
          data={listOfChats}
          renderItem={({ item }: { item: IChatBox }) => <BoxCard
            item={item}
            isSelected={false}
            selectedMode={false}
            onPress={() => navigation.navigate('ChatBox', { chatBoxId: item?.id, imageUri: undefined })}
            onLongPress={() => { }}
          />}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={100}
        />
      </View>
    </View>
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    ...Layout.content,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.XS
  },
});

export default ChatSearch;
