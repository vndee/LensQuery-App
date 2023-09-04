import React, { useCallback, useState } from 'react';
import Strings from '../../localization';
import { getPressableStyle } from '../../styles/Touchable';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import { TGetModelPropertiesResponse } from '../../types/openrouter';

const ModelRow = ({ data }: { data: TGetModelPropertiesResponse }): JSX.Element => {
  console.log('data row:', data);

  const LineData = ({ label, value }: { label: any, value: any }): JSX.Element => {
    return (
      <View style={styles.row}>
        <Text style={[Typography.description, { fontWeight: '500' }]}>{label}:</Text>
        <Text style={[Typography.description, { marginLeft: Spacing.S }]}>{value}</Text>
      </View>
    );
  };

  const getPrice = useCallback((price: number): string => {
    return (price * 1000).toFixed(4);
  }, []);

  return (
    <Pressable style={(pressed) => [styles.card, getPressableStyle(pressed)]}>
      <View style={styles.row}>
        <View style={styles.modelID}>
          <Text style={[Typography.description]}>{data.id}</Text>
        </View>
      </View>
      <LineData label={Strings.modelSelection.promptCost} value={getPrice(data.pricing.prompt)} />
      <LineData label={Strings.modelSelection.completionCost} value={getPrice(data.pricing.completion)} />
      <LineData label={Strings.modelSelection.contextLength} value={data.context_length} />
    </Pressable>
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  card: {
    gap: Spacing.XS,
    padding: Spacing.S,
    borderRadius: Spacing.S + Spacing.XXS,
    backgroundColor: Colors.very_light_green,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between'
  },
  modelID: {
    borderRadius: 5,
    padding: Spacing.XS,
    backgroundColor: Colors.light_grey_green
  }
});

export default ModelRow;

