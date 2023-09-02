import React from 'react';
import ProgressCircle from 'react-native-progress/CircleSnail';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography, Layout, Touchable } from '../../styles/index';

const Button = ({ label, onPress, disabled, style, outline, isLoading }: {
  label: string,
  onPress: () => void,
  disabled?: boolean,
  style?: object,
  outline?: boolean,
  isLoading?: boolean,
}): JSX.Element => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.touchable, Layout.shadow, style || {}, outline && styles.outline]}
      disabled={disabled}
    >
      <Text style={[styles.label, outline && { color: Colors.primary }]}>{label}</Text>
      {
        isLoading &&
        <View style={{ marginLeft: Spacing.S }}>
          <ProgressCircle size={20} color={Colors.white} thickness={2} />
        </View>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    ...Touchable.dark,
    flexDirection: 'row'
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