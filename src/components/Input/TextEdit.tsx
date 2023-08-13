import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { withSpring, useSharedValue } from 'react-native-reanimated';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';

type Props = {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  errorText?: string;
  isEdit?: boolean;
  icon?: string;
}

const TextEdit = ({ label, value, onChange, placeholder, errorText, isEdit, icon }: Props) => {
  return (
    <View>
      <Text style={{ ...Typography.body, fontWeight: '500', marginBottom: Spacing.XS }}>{label}</Text>
      <View style={[styles.container, !isEmpty(errorText) && { borderColor: Colors.primary }]}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder || ''}
          onChangeText={onChange}
          value={value}
          editable={isEdit}
        />

        {icon && <Ionicons
          // @ts-ignore
          name={icon}
          size={24}
          color={!isEmpty(errorText) ? Colors.primary : Colors.borders}
          style={styles.icon}
        />}
      </View>
      <View style={{ height: Spacing.XL, justifyContent: 'center' }}>
        {!isEmpty(errorText) && !isEmpty(errorText) && <Text style={{ ...Typography.description, color: Colors.primary }}>{errorText}</Text>}
      </View>
    </View>
  )
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    borderWidth: 1,
    paddingHorizontal: Spacing.XS,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Spacing.XS,
    borderColor: Colors.borders
  },
  textInput: {
    ...Typography.body,
    paddingVertical: Spacing.inputVerticalPadding,
    paddingHorizontal: Spacing.XS,
    flex: 13
  },
});

export default TextEdit;