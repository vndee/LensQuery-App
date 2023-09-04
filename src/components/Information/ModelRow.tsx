import React, { useState } from 'react';
import { getPressableStyle } from '../../styles/Touchable';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import { TGetModelPropertiesResponse } from '../../types/openrouter';

const ModelRow = ({ data }: { data: TGetModelPropertiesResponse }): JSX.Element => {
  console.log('data row:', data)
  return (
    <Pressable style={styles.row}>
      <Pressable style={(pressed) => [styles.modelID, getPressableStyle(pressed)]}>
        <Text style={[Typography.description]}>{data.id}</Text>
      </Pressable>
    </Pressable>
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center'
  },
  modelID: {
    borderRadius: 5,
    padding: Spacing.XS,
    backgroundColor: Colors.light_grey_green
  }
});

export default ModelRow;

