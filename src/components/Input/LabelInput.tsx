import React, { useState, useRef } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Spacing, Layout, Typography } from '../../styles';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { isEmpty } from 'lodash';

const LabelInput = ({ label, icon, placeholder, value, onChangeText, secureTextEntry, keyboardType, iconView, errorText, ...props }: {
  label: string,
  placeholder: string,
  value: string,
  onChangeText: (text: string) => void,
  icon?: string,
  secureTextEntry?: boolean,
  keyboardType?: string,
  iconView?: string,
  errorText?: string,
  [key: string]: any,
}): JSX.Element => {
  const inputRef = useRef(null);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(secureTextEntry ? secureTextEntry : false); // for password

  const handleFocus = () => {
    setIsFocus(true);
    // @ts-ignore
    inputRef?.current?.focus();
  };

  const handleBlur = () => {
    setIsFocus(false);
  };

  return (
    <View>
      <Text style={{ ...Typography.body, fontWeight: '500', marginBottom: Spacing.XS }}>{label}</Text>
      <View style={[styles.container, !isEmpty(errorText) && { borderColor: Colors.primary }]}>
        <TextInput
          value={value}
          ref={inputRef}
          placeholder={placeholder}
          placeholderTextColor={!isEmpty(errorText) ? Colors.primary : Colors.hint}
          onChangeText={onChangeText}
          secureTextEntry={isVisible}
          // @ts-ignore
          keyboardType={keyboardType}
          style={styles.textInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize='none'
        />
        {icon && <Ionicons
          // @ts-ignore
          name={secureTextEntry ? (isVisible ? iconView : icon) : icon}
          size={24}
          color={!isEmpty(errorText) ? Colors.primary : Colors.hint}
          style={styles.icon}
          onPress={secureTextEntry ? () => setIsVisible(!isVisible) : undefined}
        />}
      </View>
      <View style={{ height: Spacing.XL, justifyContent: 'center' }}>
        {!isEmpty(errorText) && !isEmpty(errorText) && <Text style={{ ...Typography.description, color: Colors.primary }}>{errorText}</Text>}
      </View>
    </View>
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Spacing.XS,
    borderColor: Colors.borders,
    paddingHorizontal: Spacing.XS,
  },
  textInput: {
    ...Typography.body,
    paddingVertical: Spacing.inputVerticalPadding,
    paddingHorizontal: Spacing.XS,
    flex: 13
  },
  icon: {
    flex: 1,
    marginHorizontal: Spacing.XS,
  }
});

export default LabelInput;