import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography, Spacing, Colors } from '../../styles';
import { IChatBox } from '../../types/chat';
import { formatTimeDiff } from '../../utils/Helper';

type IChatBoxProps = {
  item: IChatBox,
  isSelected: boolean,
  selectedMode: boolean,
  onPress: () => void,
  onLongPress: () => void,
};

const BoxCard = ({ item, isSelected, selectedMode, onPress, onLongPress }: IChatBoxProps) => {
  const { id, name, engineId, lastMessageAt, lastMessage, createAt, updateAt } = item;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {selectedMode && <View style={[styles.checkBox, isSelected && { backgroundColor: Colors.primary, borderWidth: 0 }]} />}
      <View style={styles.col}>
        <View style={styles.row}>
          <Text style={[Typography.title, { flex: 1 }]} numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
          <View style={{ alignSelf: 'center', marginLeft: Spacing.L }}>
            <Text style={styles.timePassed}>{formatTimeDiff(lastMessageAt)}</Text>
          </View>
        </View>
        <Text style={Typography.body} numberOfLines={1} ellipsizeMode='tail'>
          {lastMessage.replace(/\n/g, ' ')}
        </Text>
      </View>
    </TouchableOpacity>
  )
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.L,
    paddingVertical: Spacing.M,
    // borderBottomWidth: 0.25,
    // borderBottomColor: Colors.borders,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 0.4,
    borderColor: Colors.primary,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.M,
  },
  col: {
    flex: 1,
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