import Strings from '../../localization'
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Typography, Colors, Spacing, Layout } from '../../styles';
import { ISubscriptionConfig } from '../../types/config';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SubscriptionInfo = ({ item }: { item: ISubscriptionConfig }): JSX.Element => {
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
      <Text style={[Typography.H2, styles.title]}>{item.name}</Text>
      <CheckField value={true} label={`${item.TextOCRSnap} ${Strings.paywall.textOCRSnap}`} />
      <CheckField value={true} label={`${item.EquationOCRSnap} ${Strings.paywall.equationOCRSnap}`} />
      <CheckField value={true} label={Strings.paywall.fullChatExperience} />
      <CheckField value={true} label={Strings.paywall.customLLMProvider} />
      <CheckField value={true} label={Strings.paywall.customLLMModel} />
    </View>
  )
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  checkField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.S,
  },
  checkFieldText: {
    ...Typography.title,
    textAlign: 'center'
  },
  infoView: {
    flex: 1,
    gap: Spacing.S,
    justifyContent: 'center',
  },
  title: {
  }
});

export default SubscriptionInfo;