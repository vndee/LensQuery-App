import Strings from '../../localization';
import React, { useState, useCallback, useEffect } from 'react';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Colors, Layout, Spacing, Typography } from '../../styles';
import { getPressableStyle } from '../../styles/Touchable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

const SubcriptionCard = ({ item, isSelected, callback }:
  {
    item: PurchasesPackage,
    isSelected: boolean,
    callback: (state: PurchasesPackage) => void
  }): JSX.Element => {
  const { product: { title, description, priceString } } = item;
  console.log('item:', title);
  return (
    <View style={styles.container}>
      <Pressable
        hitSlop={10}
        onPress={() => callback(item)}
        style={(pressed) => [styles.card, getPressableStyle(pressed)]}
      >
        <View style={styles.header}>
          {isSelected ?
            <Ionicons name={"checkmark-circle"} size={20} color={Colors.primary} />
            : <Entypo name={"circle"} size={20} color={Colors.border_light} />}
          <Text style={styles.headerText}>{title}</Text>
        </View>
        <Text>{description}</Text>
        <Text>{priceString}{' '}{Strings.paywall.perMonth}</Text>
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
    gap: Spacing.S,
    flexDirection: 'row',
    justifyContent: 'flex-start',
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