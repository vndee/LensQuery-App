import React, { useState } from 'react';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import { Spacing, Typography, Layout } from '../../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { isEmpty } from 'lodash';
import { getPressableStyle } from '../../styles/Touchable';

type ActionItemProps = {
  label: string;
  icon?: string;
  color: string;
  onPress: () => void;
};

type Props = {
  actionRef: React.RefObject<ActionSheetRef>;
  actions: Array<ActionItemProps>;
}

const BottomActionSheet = ({ actionRef, actions }: Props) => {
  return (
    <ActionSheet ref={actionRef} containerStyle={{}}>
      <View style={styles.draggleBar} />
      <FlatList
        data={actions}
        renderItem={({ item }: { item: any }) => (
          <Pressable onPress={item.onPress} style={(pressed) => [styles.actionItem, getPressableStyle(pressed)]}>
            {!isEmpty(item.icon) && <Ionicons name={item.icon} size={20} color={item.color} />}
            <Text style={[Typography.body, { color: item.color }]}>{item.label}</Text>
          </Pressable>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: Spacing.SAFE_BOTTOM - Spacing.S }}
      />
    </ActionSheet>
  )
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  actionItem: {
    ...Layout.row,
    gap: Spacing.S,
    paddingVertical: Spacing.S,
    paddingHorizontal: Spacing.horizontalPadding,
  },
  draggleBar: {
    height: Spacing.XS,
    borderRadius: Spacing.XXS,
    marginVertical: Spacing.XS,
  },
});

export type { ActionItemProps, ActionSheetRef };
export default BottomActionSheet;