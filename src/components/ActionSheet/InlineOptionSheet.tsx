import React, { useCallback, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { Colors, Spacing, Typography } from '../../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getPressableStyle } from '../../styles/Touchable';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type InlineOptionSheetProps = {
  label: string;
  value: string;
  onPress: () => void;
};

type Props = {
  title: string;
  options: Array<InlineOptionSheetProps>;
  activeColor?: string;
  selectedValue: string;
};

const InlineOptionSheet = ({ title, options, selectedValue, activeColor = Colors.primary }: Props) => {
  const RenderOption = useCallback(({ item }: { item: InlineOptionSheetProps }) => {
    return (
      <Pressable onPress={item.onPress} style={(pressed) => [styles.optionContainer, getPressableStyle(pressed)]}>
        <Ionicons name={selectedValue === item.value ? 'radio-button-on' : 'radio-button-off'} size={16} color={activeColor} />
        <Text style={Typography.body}>{item.label}</Text>
      </Pressable>
    )
  }, [options]);

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={options}
        keyExtractor={(item) => item.value}
        renderItem={RenderOption}
        contentContainerStyle={{ marginTop: Spacing.S, gap: Spacing.S }}
      />
    </View>
  )
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  title: {
    ...Typography.body,
    fontWeight: '500',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.S,
  }
});

export type { InlineOptionSheetProps };
export default InlineOptionSheet;