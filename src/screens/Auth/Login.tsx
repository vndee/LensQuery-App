import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Colors, Spacing, Typography, Layout } from '../../styles/index';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import Storage from '../../storage';
import Strings from '../../localization';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';
import TextInputWithIcon from '../../components/Input/TextInputWithIcon';
import { clearAuthInformation } from '../../storage';
import { setLogin, setLanguage } from '../../redux/slice/auth';
import firebaseAuth from '../../services/firebase'
import { FirebaseSignInResponse } from '../../types/firebase';
import { isEmpty } from 'lodash';
import { checkEmailValid } from '../../utils/Helper';
import { ScreenProps } from '../../types/navigation';

const Login = ({ navigation, route }: ScreenProps): JSX.Element => {
  const dispatch = useDispatch();
  const { isLogin, language } = useSelector((state: any) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

    if (isRememberMe) {
      Storage.set('auth.email', email);
      Storage.set('auth.password', password);
    } else {
      clearAuthInformation();
    }

    firebaseAuth.signInWithEmailAndPassword(email, password).then((userCredential) => {
      console.debug(userCredential);
      // dispatch(setLogin(true));
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
    if (Storage.contains('auth.email') && Storage.contains('auth.password')) {
      const email = Storage.getString('auth.email')
      const password = Storage.getString('auth.password')

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
        <Text style={styles.appTitle}>LensQuery</Text>
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
            icon="lock-closed-outline"
            iconView="lock-open-outline"
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
          <Text style={{ ...Typography.body, color: Colors.disabled }}>{Strings.login.dontHaveAccount} </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{ ...Typography.body, color: Colors.primary }}>{Strings.login.register}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.changeLanguageContainer}>
          <TouchableOpacity onPress={() => handleLanguageChange('en')} style={styles.language}>
            <Text style={[Typography.body, language === 'en' ? styles.languageChoice : styles.languageOption]}>English</Text>
          </TouchableOpacity>
          <Text style={{ ...Typography.body, color: Colors.disabled }}> | </Text>
          <TouchableOpacity onPress={() => handleLanguageChange('vi')} style={styles.language}>
            <Text style={[Typography.body, language === 'vi' ? styles.languageChoice : styles.languageOption]}>Tiếng Việt</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Layout.content,
    justifyContent: 'center',
    gap: Spacing.XL
  },
  appTitle: {
    ...Typography.H1,
    alignSelf: 'center',
    color: Colors.primary
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
    color: Colors.disabled
  },
  languageChoice: {
    color: Colors.primary,
    fontWeight: '600'
  }
});

export default Login;