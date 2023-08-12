import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, LayoutAnimation } from 'react-native';
import { Layout, Typography, Spacing, Colors } from '../../styles';
import { IChatBox } from '../../types/chat';
import { formatTimeDiff } from '../../utils/Helper';

type IChatBoxProps = {
  item: IChatBox,
  onPress: () => void,
  onLongPress: () => void,
};

const BoxCard = ({ item, onPress, onLongPress }: IChatBoxProps) => {
  const { _id, name, engineId, lastMessageAt, lastMessage, createAt, updateAt } = item;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.col}>
        <View style={styles.row}>
          <Text style={[Typography.title, { flex: 1 }]}>This is the chat name</Text>
          <View style={{ alignSelf: 'center' }}>
            <Text style={styles.timePassed}>{formatTimeDiff(lastMessageAt)}</Text>
          </View>
        </View>
        <Text style={Typography.body} numberOfLines={1} ellipsizeMode='tail'>
          This is a very long long long long and long long long long message
        </Text>
      </View>
    </TouchableOpacity>
  )
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.horizontalPadding,
    paddingVertical: Spacing.M,
    borderBottomWidth: 0.25,
    borderBottomColor: Colors.borders,
  },
  col: {
    gap: Spacing.M,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timePassed: {
    ...Typography.body,
    color: Colors.second_text_color,
  }
});

export default BoxCard;