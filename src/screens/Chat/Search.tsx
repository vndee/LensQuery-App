import React, { useEffect, useState, useCallback } from 'react';
import { Routes } from '../../types/navigation';
import Strings from '../../localization';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard, TextInput } from 'react-native';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import { StackScreenProps } from '@react-navigation/stack';


const ChatSearch = ({ navigation, route }: StackScreenProps<Routes, 'ChatSearch'>) => {
  const [searchText, setSearchText] = useState<string>('');

  const renderSearchHeader = useCallback(() => {
    return (
      <View style={styles.row}>
        <TouchableOpacity onPress={() => { setSearchText(''); Keyboard.dismiss(); }}>
          <Ionicons name='arrow-back-outline' size={24} color={Colors.primary} />
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
    <View style={styles.container}>
      <View style={Layout.header}>
        {renderSearchHeader()}
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
