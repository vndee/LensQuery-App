import React, { useState, useRef } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Spacing, Layout, Typography } from '../../styles';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const TextInputWithIcon = ({ icon, placeholder, value, onChangeText, secureTextEntry, keyboardType, ...props }: {
  icon: string,
  placeholder: string,
  value: string,
  onChangeText: (text: string) => void,
  secureTextEntry?: boolean,
  keyboardType?: string,
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
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        // @ts-ignore
        keyboardType={keyboardType}
        style={styles.textInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <Ionicons
        name={"mail-outline"}
        size={24}
        color={isFocus ? Colors.borders : Colors.disabled}
        style={styles.icon}
      />
    </View>
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Spacing.XS,
  },
  textInput: {
    ...Typography.body,
    paddingVertical: Spacing.M,
    paddingHorizontal: Spacing.XS,
    flex: 13
  },
  icon: {
    flex: 1,
    marginHorizontal: Spacing.XS,
  }
});

export default TextInputWithIcon;