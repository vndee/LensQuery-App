import { PurchasesPackage } from 'react-native-purchases';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Typography, Colors, Spacing, Layout } from '../../styles';


const SubcriptionPackage = ({ item }: { item: PurchasesPackage }): JSX.Element => {
  console.log('Items:', item);

  return (
    <View style={styles.card}>
      <Text>{item.identifier}</Text>
    </View>
  )
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  card: {
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: Colors.border_light,
    height: Spacing.SCREEN_HEIGHT * 0.6,
    width: Spacing.SCREEN_WIDTH - Spacing.XL * 2,
  }
});

export default SubcriptionPackage;