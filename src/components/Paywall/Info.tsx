import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Typography, Colors, Spacing, Layout } from '../../styles';
import { ISubscriptionConfig } from '../../types/config';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SubscriptionInfo = ({ item }: { item: ISubscriptionConfig }): JSX.Element => {
  console.log('Items:', item);

  const CheckField = ({ value, label }: { value: boolean, label: string }): JSX.Element => (
    <View style={styles.checkField}>
      {value ?
        <Ionicons name={"checkmark-circle"} size={20} color={Colors.primary} />
        : null}

      <Text style={styles.checkFieldText}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.infoView}>
      <CheckField value={true} label={`${item.TextOCRSnap} Text OCR Snap`} />
      <CheckField value={true} label={`${item.EquationOCRSnap} Equation OCR Snap`} />
      <CheckField value={true} label={"Full Chat Experience"} />
      <CheckField value={true} label={"Custom LLM Provider"} />
    </View>
  )
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  checkField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.XS
  },
  checkFieldText: {
    ...Typography.title,
  },
  infoView: {
    flex: 1,
    gap: Spacing.S,
    justifyContent: 'center',
  }
});

export default SubscriptionInfo;