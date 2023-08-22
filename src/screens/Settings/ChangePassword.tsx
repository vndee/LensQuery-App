import React, { useEffect, useState } from 'react';
import { Routes } from '../../types/navigation';
import Strings from '../../localization';
import { isEmpty } from 'lodash';
import Button from '../../components/Button';
import LabelInput from '../../components/Input/LabelInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebaseAuth from '../../services/firebase';
import { firebase } from "@react-native-firebase/auth";
import { FirebaseSignInResponse } from '../../types/firebase';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import { StackScreenProps } from '@react-navigation/stack';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';

const ChangePassword = ({ navigation, route }: StackScreenProps<Routes, 'ChangePassword'>): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [currentPasswordErrorText, setCurrentPasswordErrorText] = useState<string>('');
  const [newPasswordErrorText, setNewPasswordErrorText] = useState<string>('');
  const [confirmNewPasswordErrorText, setConfirmNewPasswordErrorText] = useState<string>('');
  const [erorText, setErrorText] = useState<string>(Strings.common.unknownError);

  const handleSavePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setConfirmNewPasswordErrorText(Strings.changePassword.passwordNotMatchError);
      return;
    }
    try {
      setIsLoading(true);
      const user = firebaseAuth.currentUser;
      if (user) {
        const credentials = firebase.auth.EmailAuthProvider.credential(
          user.email || '',
          currentPassword
        );
        // Sign in the user with the credentials to verify the current password
        user.reauthenticateWithCredential(credentials).then(() => {
          // If the reauthentication is successful, update the password
          user.updatePassword(newPassword).then(() => {
            setIsLoading(false);
            console.log('Password updated!')
            navigation.goBack();
          }).catch((error) => {
            setIsLoading(false);
            setErrorText(Strings.common.unknownError);
          });
        }).catch((error) => {
          setIsLoading(false);
          const errorCode = error?.code || '';
          if (errorCode === FirebaseSignInResponse.WRONG_PASSWORD) {
            setCurrentPasswordErrorText(Strings.login.wrongPassword);
          }
        });
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={[Layout.header, { paddingHorizontal: Spacing.XS }]}>
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
              if (!isEmpty(erorText)) {
                setErrorText('')
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
              if (!isEmpty(erorText)) {
                setErrorText('')
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
              if (!isEmpty(erorText)) {
                setErrorText('')
              }
            }}
            secureTextEntry={true}
            icon="lock-open-outline"
            iconView="lock-closed-outline"
            errorText={confirmNewPasswordErrorText}
          />
        </View>
      </ScrollView>
      <View style={[styles.btnBottom, { paddingHorizontal: Spacing.horizontalPadding }]}>
        {erorText !== '' && <Text style={[Typography.error, { alignSelf: 'center', marginBottom: Spacing.S }]}>{erorText}</Text>}
        <Button label={Strings.changePassword.saveBtn} onPress={handleSavePassword} />
      </View>
    </View>
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    ...Layout.content,
  },
  backIcon: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  btnBottom: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    marginBottom: Spacing.SAFE_BOTTOM,
    marginHorizontal: Spacing.horizontalPadding,
  },
});

export default ChangePassword;