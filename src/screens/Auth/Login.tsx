import { isEmpty } from 'lodash';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, Image } from 'react-native';
import Strings from '../../localization';
import appStorage from '../../storage';
import Button from '../../components/Button';
import { Routes } from '../../types/navigation'
import Checkbox from '../../components/Checkbox';
import firebaseAuth from '../../services/firebase'
import { setLanguage } from '../../redux/slice/auth';
import { checkEmailValid } from '../../utils/Helper';
import { useDispatch, useSelector } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';
import { FirebaseSignInResponse } from '../../types/firebase';
import TextInputWithIcon from '../../components/Input/TextInputWithIcon';
import { Colors, Spacing, Typography, Layout } from '../../styles/index';

const Login = ({ navigation, route }: StackScreenProps<Routes, 'Login'>): JSX.Element => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { language } = useSelector((state: any) => state.auth);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isRememberMe, setIsRememberMe] = useState<boolean>(false);

  const [emailErrorText, setEmailErrorText] = useState<string>('');
  const [passwordErrorText, setPasswordErrorText] = useState<string>('');

  const handleLogin = async () => {
    if (emailErrorText && !isEmpty(email)) {
      setEmailErrorText('');
    }

    if (passwordErrorText && !isEmpty(password)) {
      setPasswordErrorText('');
    }

    if (isEmpty(email) || isEmpty(password)) {
      if (isEmpty(email)) {
        setEmailErrorText(Strings.login.emailEmptyError);
      }

      if (isEmpty(password)) {
        setPasswordErrorText(Strings.login.passwordEmptyError);
      }

      setIsLoading(false);
      return;
    }

    if (!checkEmailValid(email)) {
      setEmailErrorText(Strings.login.emailInvalidError);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    firebaseAuth.signInWithEmailAndPassword(email, password).then((userCredential) => {
      console.log('creds', userCredential);
      if (isRememberMe) {
        appStorage.set('auth.email', email);
        appStorage.set('auth.password', password);
      } else {
        appStorage.delete('auth.email');
        appStorage.delete('auth.password');
      }
    }).catch((error) => {
      switch (error.code) {
        case FirebaseSignInResponse.WRONG_PASSWORD:
          setPasswordErrorText(Strings.login.wrongPassword);
          break;
        case FirebaseSignInResponse.USER_NOT_FOUND:
          setEmailErrorText(Strings.login.emailNotFound);
          break;
        case FirebaseSignInResponse.USER_DISABLED:
          setEmailErrorText(Strings.login.userDisabled);
          break;
        case FirebaseSignInResponse.TOO_MANY_REQUESTS:
          setEmailErrorText(Strings.login.tooManyRequests);
          break;
        default:
          setEmailErrorText(Strings.login.unknownError);
          break;
      }
    });

    setIsLoading(false);
  };

  const handleLanguageChange = (language: string) => {
    Strings.setLanguage(language);
    dispatch(setLanguage(language));
    console.debug('~ language:', language);
  };

  useEffect(() => {
    if (appStorage.contains('auth.email') && appStorage.contains('auth.password')) {
      const email = appStorage.getString('auth.email')
      const password = appStorage.getString('auth.password')

      if (email && password) {
        setEmail(email);
        setPassword(password);
        setIsRememberMe(true);
      }
    }
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS == 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Image source={require('../../assets/logo.png')} style={styles.logoBtn} />
          <Text style={[styles.appTitle, { marginTop: Spacing.M }]}>LensQuery</Text>
        </View>

        <View>
          <TextInputWithIcon
            icon="mail-outline"
            placeholder={Strings.login.email}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (!isEmpty(emailErrorText) && !isEmpty(text)) setEmailErrorText('');
            }}
            keyboardType="email-address"
            errorText={emailErrorText}
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          <TextInputWithIcon
            icon="lock-open-outline"
            iconView="lock-closed-outline"
            placeholder={Strings.login.password}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (!isEmpty(passwordErrorText) && !isEmpty(text)) setPasswordErrorText('');
            }}
            secureTextEntry={true}
            errorText={passwordErrorText}
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Checkbox label={Strings.login.rememberMe} value={isRememberMe} onPress={() => setIsRememberMe(!isRememberMe)} />
            <TouchableOpacity>
              <Text style={{ ...Typography.body, color: Colors.primary }}>{Strings.login.forgotPassword}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Button label={isLoading ? `${Strings.login.loginBtn}...` : Strings.login.loginBtn} onPress={handleLogin} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ ...Typography.body, color: Colors.hint }}>{Strings.login.dontHaveAccount} </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{ ...Typography.body, color: Colors.primary }}>{Strings.login.register}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.changeLanguageContainer}>
          <TouchableOpacity onPress={() => handleLanguageChange('en')} style={styles.language}>
            <Text style={[Typography.body, language === 'en' ? styles.languageChoice : styles.languageOption]}>English</Text>
          </TouchableOpacity>
          <Text style={{ ...Typography.body, color: Colors.hint }}> | </Text>
          <TouchableOpacity onPress={() => handleLanguageChange('vi')} style={styles.language}>
            <Text style={[Typography.body, language === 'vi' ? styles.languageChoice : styles.languageOption]}>Tiếng Việt</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  logoBtn: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    borderRadius: Spacing.M,
  },
  container: {
    ...Layout.content,
    justifyContent: 'center',
    gap: Spacing.XL,
    backgroundColor: Colors.background
  },
  appTitle: {
    ...Typography.H1,
    alignSelf: 'center',
    color: Colors.btnColor
  },
  changeLanguageContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: Spacing.L, // Adjust this value as needed
    width: '100%',
  },
  language: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.XS
  },
  languageOption: {
    color: Colors.hint
  },
  languageChoice: {
    color: Colors.primary,
    fontWeight: '600'
  }
});

export default Login;