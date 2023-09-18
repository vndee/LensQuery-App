import Strings from '../../localization';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import React, { useState, useCallback, useEffect } from 'react';
import ReactNative, { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Colors, Layout, Spacing, Typography } from '../../styles';
import { getPressableStyle } from '../../styles/Touchable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Animated, { LinearTransition } from 'react-native-reanimated';

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
        onPress={() => callback(item)}
        style={(pressed) => [getPressableStyle(pressed), { width: '100%' }]}
      >
        <Animated.View
          style={[styles.card, isSelected ? styles.selected : styles.row]}
          layout={LinearTransition}
        >
          <Animated.View style={[styles.row]}>
            <View style={styles.header}>
              {isSelected ?
                <Ionicons name={"checkmark-circle"} size={20} color={isSelected ? Colors.white : Colors.primary} />
                : <Entypo name={"circle"} size={20} color={isSelected ? Colors.primary : Colors.border_light} />}
              <Text style={[styles.headerText, isSelected && { color: Colors.white }]}>{title}</Text>
            </View>
            <Text style={[Typography.body, isSelected && { color: Colors.white }]}>{priceString}{' '}{Strings.paywall.perMonth}</Text>
          </Animated.View>
          {isSelected && <Text style={[Typography.body, isSelected && { color: Colors.white }]}>{description}</Text>}
        </Animated.View>
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
  selected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});

export default SubcriptionCard;