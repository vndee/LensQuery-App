import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

type Props = {
  title: string,
};

const Header = ({ title }: Props): JSX.Element => {
  const navigation = useNavigation();

  return (
    <View style={Layout.header}>
      <View style={styles.row}>
        <Pressable onPress={navigation.goBack} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]} hitSlop={20}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </Pressable>
        <Text style={[Typography.H3, { marginLeft: Spacing.XS, color: Colors.white }]}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    gap: Spacing.XS,
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default Header;  