import React, { useState, useRef } from 'react';
import { Spacing, Colors, Typography } from '../../styles';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, AppState } from 'react-native';


const Checkbox = ({ label, value, onPress, ...props }: {
  label: string,
  value: boolean,
  onPress: () => void,
  [key: string]: any,
}): JSX.Element => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const inputRef = useRef(null);

  const handleFocus = () => {
    setIsFocus(true);
    // @ts-ignore
    inputRef?.current?.focus();
  };

  const handleBlur = () => {
    setIsFocus(false);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.checkbox}>
        {value && <View style={styles.checkboxInner} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.XS,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.borders,
    borderRadius: Spacing.XS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 16,
    height: 16,
    backgroundColor: Colors.primary,
    borderRadius: Spacing.XS,
  },
  label: {
    ...Typography.body,
  },
});

export default Checkbox;