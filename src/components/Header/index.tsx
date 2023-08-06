import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Header = (): JSX.Element => {
  return (
    <View style={Layout.header}>
      <View style={styles.row}>
        <Ionicons name="arrow-back" size={20} color={Colors.text_color} />
        <Text style={Typography.title}>Header</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default Header;  