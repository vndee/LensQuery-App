import React, { useCallback, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';

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
      <TouchableOpacity onPress={item.onPress} style={styles.optionContainer}>
        <Ionicons name={selectedValue === item.value ? 'radio-button-on' : 'radio-button-off'} size={16} color={activeColor} />
        <Text style={Typography.body}>{item.label}</Text>
      </TouchableOpacity>
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