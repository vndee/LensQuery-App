import React from 'react';
import { Colors, Spacing, Typography, Layout, Touchable } from '../../styles/index';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Button = ({ label, onPress, disabled }: {
  label: string,
  onPress: () => void,
  disabled?: boolean,
}): JSX.Element => {
  return (
    <TouchableOpacity style={styles.touchable} disabled={disabled}>
      <Text style={styles.label}>{label}</Text>
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
  }
});

export default Button;