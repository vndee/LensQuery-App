import React from 'react';
import { isEmpty } from 'lodash';
import { Colors, Spacing, Typography } from '../../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, StyleSheet, TextInput } from 'react-native';

type Props = {
  label?: string;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  errorText?: string;
  isEdit?: boolean;
  icon?: string;
  onSubmit?: () => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const TextEdit = ({ label, value, onChange, placeholder, errorText, isEdit, icon, onSubmit, autoCapitalize }: Props) => {
  return (
    <View>
      {label && <Text style={{ ...Typography.body, fontWeight: '500', marginBottom: Spacing.XS }}>{label}</Text>}
      <View style={[styles.container, !isEmpty(errorText) && { borderColor: Colors.danger }]}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder || ''}
          placeholderTextColor={Colors.hint}
          onChangeText={onChange}
          value={value}
          editable={isEdit}
          onSubmitEditing={onSubmit}
          autoCapitalize={autoCapitalize || 'none'}
        />

        {icon && <Ionicons
          // @ts-ignore
          name={icon}
          size={24}
          color={!isEmpty(errorText) ? Colors.danger : Colors.hint}
          style={styles.icon}
        />}
      </View>
      <View style={{ height: Spacing.XL, justifyContent: 'center' }}>
        {!isEmpty(errorText) && !isEmpty(errorText) && <Text style={{ ...Typography.description, color: Colors.danger }}>{errorText}</Text>}
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
    borderRadius: Spacing.M,
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