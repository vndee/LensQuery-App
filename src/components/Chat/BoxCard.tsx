import React from 'react';
import { getPressableStyle } from '../../styles/Touchable';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { Typography, Spacing, Colors } from '../../styles';
import { IChatBox } from '../../types/chat';
import Strings from '../../localization';
import { formatTimeDiff } from '../../utils/Helper';
import { isEmpty } from 'lodash';

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
    <Pressable
      style={(pressed) => [styles.container, getPressableStyle(pressed)]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {selectedMode && <View style={[styles.checkBox]}>
        {isSelected && <View style={styles.innerBox} />}
      </View>}
      <View style={styles.col}>
        <View style={styles.row}>
          <Text style={[Typography.title, { flex: 1 }]} numberOfLines={1} ellipsizeMode='tail'>{!isEmpty(name) ? name : Strings.chatList.untitle}</Text>
          <View style={{ alignSelf: 'center', marginLeft: Spacing.L }}>
            <Text style={styles.timePassed}>{formatTimeDiff(lastMessageAt)}</Text>
          </View>
        </View>
        <Text style={Typography.body} numberOfLines={1} ellipsizeMode='tail'>
          {lastMessage.replace(/\n/g, ' ')}
        </Text>
      </View>
    </Pressable>
  )
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.XL,
    paddingVertical: Spacing.M,
    // borderBottomWidth: 0.25,
    // borderBottomColor: Colors.borders,
  },
  checkBox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 0.4,
    borderColor: Colors.primary,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.M,
  },
  innerBox: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
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