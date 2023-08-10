import React, { useState, useRef } from 'react';
import Strings from '../../localization';
import Header from '../../components/Header';
import { ScreenProps } from '../../types/navigation';
import { Colors, Spacing, Layout, Typography, Touchable } from '../../styles';
import Button from '../../components/Button';
import { Routes } from '../../types/navigation';
import { isEmpty } from 'lodash';
import { checkEmailValid } from '../../utils/Helper';
import LabelInput from '../../components/Input/LabelInput';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, ScrollView, TouchableOpacity } from 'react-native';

const Register = ({ navigation, route }: NativeStackScreenProps<Routes, 'Register'>): JSX.Element => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');

  const isFormValid = () => {
    let isValid = true;
    if (isEmpty(name)) {
      setNameError(Strings.register.nameEmptyError);
      isValid = false;
    }
    if (isEmpty(email)) {
      setEmailError(Strings.register.emailEmptyError);
      isValid = false;
    }
    if (isEmpty(password)) {
      setPasswordError(Strings.register.passwordEmptyError);
      isValid = false;
    }
    if (isEmpty(confirmPassword)) {
      setConfirmPasswordError(Strings.register.confirmPasswordEmptyError);
      isValid = false;
    }

    if (!isValid) {
      return false;
    }

    if (!checkEmailValid(email)) {
      setEmailError(Strings.register.emailInvalidError);
      isValid = false;
    }

    if (password.length < 6) {
      setPasswordError(Strings.register.weakPassword);
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(Strings.register.passwordNotMatchError);
      isValid = false;
    }

    if (!isValid) {
      return false;
    }

    return true;
  };

  const handleRegister = () => {
    Keyboard.dismiss();
    if (!isFormValid()) {
      return;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Header title={Strings.register.title} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS == 'ios' ? 'padding' : undefined}
      >
        <ScrollView>
          <View>
            <View style={styles.form}>
              <LabelInput
                label={Strings.register.name}
                value={name}
                placeholder={Strings.register.namePlaceholder}
                onChangeText={(text) => {
                  setName(text)
                  if (!isEmpty(nameError) && !isEmpty(text)) {
                    setNameError('')
                  }
                }}
                errorText={nameError}
              />
              <LabelInput
                label={Strings.register.email}
                value={email}
                placeholder={Strings.register.emailPlaceholder}
                onChangeText={(text) => {
                  setEmail(text)
                  if (!isEmpty(emailError) && !isEmpty(text)) {
                    setEmailError('')
                  }
                }}
                errorText={emailError}
              />
              <LabelInput
                label={Strings.register.password}
                value={password}
                placeholder={Strings.register.passwordPlaceholder}
                onChangeText={(text) => {
                  setPassword(text)
                  if (password.length < 6 && passwordError === Strings.register.weakPassword) {
                    return;
                  };
                  if (!isEmpty(passwordError) && !isEmpty(text)) {
                    setPasswordError('')
                  }
                }}
                secureTextEntry={true}
                icon="lock-open-outline"
                iconView="lock-closed-outline"
                errorText={passwordError}
              />
              <LabelInput
                label={Strings.register.confirmPassword}
                value={confirmPassword}
                placeholder={Strings.register.confirmPasswordPlaceholder}
                onChangeText={(text) => {
                  setConfirmPassword(text)
                  if (!isEmpty(confirmPasswordError) && !isEmpty(text)) {
                    setConfirmPasswordError('')
                  }
                }}
                secureTextEntry={true}
                icon="lock-open-outline"
                iconView="lock-closed-outline"
                errorText={confirmPasswordError}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.disclaimer}>
        <Text style={{ ...Typography.description, textAlign: 'center' }}>{Strings.register.disclaimer}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => { }}>
            <Text style={{ ...Typography.description, textAlign: 'center', color: Colors.primary }}>{Strings.register.terms}</Text>
          </TouchableOpacity>
          <Text style={{ ...Typography.description, textAlign: 'center' }}> {Strings.register.and} </Text>
          <TouchableOpacity onPress={() => { }}>
            <Text style={{ ...Typography.description, textAlign: 'center', color: Colors.primary }}>{Strings.register.privacy}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Button label={Strings.register.registerBtn} onPress={handleRegister} style={styles.btn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Layout.content,
    justifyContent: 'center',
    gap: Spacing.XL
  },
  content: {
    width: '100%',
    paddingHorizontal: Spacing.S,
  },
  form: {
    width: '100%',
  },
  btn: {
    marginHorizontal: Spacing.horizontalPadding,
    marginBottom: Spacing.XL
  },
  disclaimer: {
    justifyContent: 'center',
    marginBottom: Spacing.M
  }
});

export default Register;