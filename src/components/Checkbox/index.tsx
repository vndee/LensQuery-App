import React, { useState, useRef } from 'react';
import { Spacing, Colors, Typography } from '../../styles';
import { getPressableStyle } from '../../styles/Touchable';
import { View, Text, StyleSheet, Pressable } from 'react-native';


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
    <Pressable style={(pressed) => [styles.container, getPressableStyle(pressed)]} onPress={onPress}>
      <View style={styles.checkbox}>
        {value && <View style={styles.checkboxInner} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.XS,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: Colors.borders,
    borderRadius: Spacing.S,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: Colors.primary,
    borderRadius: Spacing.S,
  },
  label: {
    ...Typography.body,
  },
});

export default Checkbox;