import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Colors, Spacing, Typography, Layout } from '../../styles/index';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Storage from '../../storage';
import Strings from '../../localization';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';
import TextInputWithIcon from '../../components/Input';
import { clearAuthInformation } from '../../storage';
import { setLogin, setLanguage } from '../../redux/slice/auth';

const Login = (): JSX.Element => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state: any) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isRememberMe, setIsRememberMe] = useState<boolean>(false);

  const handleLogin = () => {
    setIsLoading(true);

    if (isRememberMe) {
      Storage.set('auth.email', email);
      Storage.set('auth.password', password);
    } else {
      clearAuthInformation();
    }

    dispatch(setLogin(true));
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
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.appTitle}>LensQuery</Text>
        <TextInputWithIcon
          icon="mail-outline"
          placeholder={Strings.login.email}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInputWithIcon
          icon="lock-closed-outline"
          iconView="lock-open-outline"
          placeholder={Strings.login.password}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Checkbox label={Strings.login.rememberMe} value={isRememberMe} onPress={() => setIsRememberMe(!isRememberMe)} />
          <TouchableOpacity>
            <Text style={{ ...Typography.body, color: Colors.primary }}>{Strings.login.forgotPassword}</Text>
          </TouchableOpacity>
        </View>
        <Button label={isLoading ? `${Strings.login.loginBtn}...` : Strings.login.loginBtn} onPress={handleLogin} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ ...Typography.body, color: Colors.disabled }}>{Strings.login.dontHaveAccount} </Text>
          <TouchableOpacity>
            <Text style={{ ...Typography.body, color: Colors.primary }}>{Strings.login.register}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.changeLanguageContainer}>
          <TouchableOpacity onPress={() => handleLanguageChange('en')} style={styles.language}>
            <Text style={{ ...Typography.body, color: Colors.primary }}>English</Text>
          </TouchableOpacity>
          <Text style={{ ...Typography.body, color: Colors.disabled }}> | </Text>
          <TouchableOpacity onPress={() => handleLanguageChange('vi')} style={styles.language}>
            <Text style={{ ...Typography.body, color: Colors.primary }}>Tiếng Việt</Text>
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
    bottom: Spacing.XL, // Adjust this value as needed
    width: '100%',
  },
  language: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.XS
  }
});

export default Login;