import React, { useState, useCallback, useRef } from 'react';
import { Routes } from '../../types/navigation';
import Strings from '../../localization';
import { useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '../../storage/realm';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IChatBox } from '../../types/chat';
import BoxCard from '../../components/Chat/BoxCard';
import { View, TouchableOpacity, StyleSheet, Keyboard, TextInput } from 'react-native';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import { StackScreenProps } from '@react-navigation/stack';


const ChatSearch = ({ navigation, route }: StackScreenProps<Routes, 'ChatSearch'>) => {
  const [searchText, setSearchText] = useState<string>('');
  const listRef = useRef<FlashList<IChatBox> | null>(null);
  const { userToken } = useSelector((state: any) => state.auth);
  const listOfChats = useQuery<IChatBox>('ChatBox').filtered('userToken == $0', userToken).sorted('lastMessageAt', true).filtered(`name CONTAINS[c] "${searchText}"`);

  const renderSearchHeader = useCallback(() => {
    return (
      <View style={styles.row}>
        <TouchableOpacity onPress={() => { setSearchText(''); Keyboard.dismiss(); navigation.goBack(); }}>
          <Ionicons name='close-outline' size={24} color={Colors.white} />
        </TouchableOpacity>
        <TextInput
          style={[Typography.body, { flex: 1, color: Colors.white }]}
          placeholder={Strings.chatList.searchPlaceholder}
          placeholderTextColor={Colors.white}
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
        />
      </View>
    );
  }, [searchText]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
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
          ItemSeparatorComponent={() => <View style={{ height: 0.5, backgroundColor: Colors.borders }} />}
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
