import React, { useState } from 'react';
import Strings from '../../localization';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { Routes } from '../../types/navigation';
import firebaseAuth from '../../services/firebase'
import { isEmpty } from 'lodash';
import { checkEmailValid } from '../../utils/Helper';
import LabelInput from '../../components/Input/LabelInput';
import { StackScreenProps } from '@react-navigation/stack';
import { FirebaseSignUpResponse } from '../../types/firebase';
import { getPressableStyle } from '../../styles/Touchable';
import { Colors, Spacing, Layout, Typography } from '../../styles';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, ScrollView, Pressable } from 'react-native';

const Register = ({ navigation, route }: StackScreenProps<Routes, 'Register'>): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    setIsLoading(true);

    if (!isFormValid()) {
      setIsLoading(false);
      return;
    }

    firebaseAuth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        setIsLoading(false);
        firebaseAuth.currentUser?.updateProfile({ displayName: name });
        console.debug('Created user successfully and login!', firebaseAuth.currentUser);
      }).catch((error) => {
        setIsLoading(false);
        switch (error.code) {
          case FirebaseSignUpResponse.EMAIL_ALREADY_IN_USE:
            setEmailError(Strings.register.emailAlreadyInUseError);
            break;
          case FirebaseSignUpResponse.INVALID_EMAIL:
            setEmailError(Strings.register.emailInvalidError);
            break;
          case FirebaseSignUpResponse.WEAK_PASSWORD:
            setPasswordError(Strings.register.weakPassword);
            break;
          default:
            setEmailError(Strings.register.unknownError);
            break;
        }

        console.debug('error', error);
      }).finally(() => {
        setIsLoading(false);
        navigation.navigate('OnboardingSetup', { email, password });
      });
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
          <Pressable onPress={() => navigation.navigate('Agreement', { type: 'terms' })} style={getPressableStyle} hitSlop={20}>
            <Text style={{ ...Typography.description, textAlign: 'center', color: Colors.primary }}>{Strings.register.terms}</Text>
          </Pressable>
          <Text style={{ ...Typography.description, textAlign: 'center' }}> {Strings.register.and} </Text>
          <Pressable onPress={() => navigation.navigate('Agreement', { type: 'privacy' })} style={getPressableStyle} hitSlop={20}>
            <Text style={{ ...Typography.description, textAlign: 'center', color: Colors.primary }}>{Strings.register.privacy}</Text>
          </Pressable>
        </View>
      </View>
      <Button label={Strings.register.registerBtn} onPress={handleRegister} style={styles.btn} isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Layout.content,
    gap: Spacing.XL,
    marginTop: Spacing.XL,
    justifyContent: 'center',
    backgroundColor: Colors.background
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