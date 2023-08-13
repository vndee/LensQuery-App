import React, { useEffect, useState } from 'react';
import { Routes } from '../../types/navigation';
import Strings from '../../localization';
import { isEmpty } from 'lodash';
import Button from '../../components/Button';
import LabelInput from '../../components/Input/LabelInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';

const ChangePassword = ({ navigation, route }: NativeStackScreenProps<Routes, 'ChangePassword'>): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [currentPasswordErrorText, setCurrentPasswordErrorText] = useState<string>('');
  const [newPasswordErrorText, setNewPasswordErrorText] = useState<string>('');
  const [confirmNewPasswordErrorText, setConfirmNewPasswordErrorText] = useState<string>('');

  const handleSavePassword = () => {
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={Layout.header}>
        <View style={Layout.row}>
          <TouchableOpacity onPress={navigation.goBack} style={styles.backIcon}>
            <Ionicons name="chevron-back" size={20} color={Colors.text_color} />
          </TouchableOpacity>
          <Text style={Typography.H3}>{Strings.changePassword.title}</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View style={[styles.container, { marginTop: Spacing.L }]}>
          <LabelInput
            label={Strings.changePassword.currentPassword}
            value={currentPassword}
            placeholder={Strings.changePassword.currentPasswordPlaceholder}
            onChangeText={(text) => {
              setCurrentPassword(text)
              if (currentPassword.length < 6 && currentPassword === Strings.changePassword.weakPassword) {
                return;
              };
              if (!isEmpty(currentPassword) && !isEmpty(text)) {
                setCurrentPasswordErrorText('')
              }
            }}
            secureTextEntry={true}
            icon="lock-open-outline"
            iconView="lock-closed-outline"
            errorText={currentPasswordErrorText}
          />
          <LabelInput
            label={Strings.changePassword.newPassword}
            value={newPassword}
            placeholder={Strings.changePassword.newPasswordPlaceholder}
            onChangeText={(text) => {
              setNewPassword(text)
              if (newPassword.length < 6 && newPassword === Strings.changePassword.weakPassword) {
                return;
              };
              if (!isEmpty(newPassword) && !isEmpty(text)) {
                setNewPasswordErrorText('')
              }
            }}
            secureTextEntry={true}
            icon="lock-open-outline"
            iconView="lock-closed-outline"
            errorText={newPasswordErrorText}
          />
          <LabelInput
            label={Strings.changePassword.confirmPassword}
            value={confirmNewPassword}
            placeholder={Strings.changePassword.confirmPasswordPlaceholder}
            onChangeText={(text) => {
              setConfirmNewPassword(text)
              if (confirmNewPassword.length < 6 && confirmNewPassword === Strings.changePassword.weakPassword) {
                return;
              };
              if (!isEmpty(confirmNewPassword) && !isEmpty(text)) {
                setConfirmNewPasswordErrorText('')
              }
            }}
            secureTextEntry={true}
            icon="lock-open-outline"
            iconView="lock-closed-outline"
            errorText={confirmNewPasswordErrorText}
          />
        </View>
      </ScrollView>
      <Button style={styles.btnBottom} label={Strings.changePassword.saveBtn} onPress={handleSavePassword} />
    </View>
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    ...Layout.content,
  },
  btnBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignSelf: 'center',
    marginBottom: Spacing.SAFE_BOTTOM,
    marginHorizontal: Spacing.horizontalPadding,
  },
});

export default ChangePassword;