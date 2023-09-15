import React, { useState, useCallback, useEffect } from 'react';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Colors, Layout, Spacing, Typography } from '../../styles';
import { getPressableStyle } from '../../styles/Touchable';


const SubcriptionCard = ({ item, isSelected, callback }:
  {
    item: PurchasesPackage,
    isSelected: boolean,
    callback: (state: PurchasesPackage) => void
  }): JSX.Element => {
  const { product: { title, description, priceString } } = item;

  return (
    <View style={styles.container}>
      <Pressable
        hitSlop={10}
        style={(pressed) => [styles.card, getPressableStyle(pressed)]}
      >
        <Text>{title}</Text>
        <Text>{description}</Text>
        <Text>{priceString}</Text>
      </Pressable>
    </View>
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.L
  },
  card: {
    gap: Spacing.XXS,
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 2,
    paddingVertical: Spacing.M,
    paddingHorizontal: Spacing.M,
    borderColor: Colors.border_light,
    ...Layout.shadow,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    ...Typography.title,
  },
  body: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyText: {
    ...Typography.body
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: Spacing.SCREEN_WIDTH * 0.8,
    height: Spacing.SCREEN_HEIGHT * 0.06,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    ...Typography.body
  },
});

export default SubcriptionCard;