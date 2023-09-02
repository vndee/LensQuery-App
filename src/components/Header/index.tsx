import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
        <Ionicons name="arrow-back" size={20} color={Colors.white} onPress={navigation.goBack} />
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