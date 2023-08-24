import React from 'react';
import { Colors, Spacing, Typography, Layout, Touchable } from '../../styles/index';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Button = ({ label, onPress, disabled, style, outline }: {
  label: string,
  onPress: () => void,
  disabled?: boolean,
  style?: object,
  outline?: boolean
}): JSX.Element => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.touchable, Layout.shadow, style || {}, outline && styles.outline]}
      disabled={disabled}
    >
      <Text style={[styles.label, outline && { color: Colors.primary }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    ...Touchable.dark
  },
  label: {
    ...Typography.title,
    color: Colors.white_two,
  },
  outline: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
});

export default Button;