import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Colors, Spacing, Typography, Layout } from '../../styles/index';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Storage from '../../storage';
import Button from '../../components/Button';
import { setLogin } from '../../redux/slice/auth';
import Checkbox from '../../components/Checkbox';
import TextInputWithIcon from '../../components/Input';
import { clearAuthInformation } from '../../storage';

const Login = (): JSX.Element => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state: any) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isRememberMe, setIsRememberMe] = useState<boolean>(false);

  console.log('~ isLogin:', isLogin);

  const handleLogin = () => {
    setIsLoading(true);
    Storage.set('isLogin', true);

    if (isRememberMe) {
      Storage.set('auth.email', email);
      Storage.set('auth.password', password);
    } else {
      clearAuthInformation();
    }

    dispatch(setLogin(true));
    setIsLoading(false);
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.appTitle}>LensQuery</Text>
      <TextInputWithIcon
        icon="mail-outline"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInputWithIcon
        icon="lock-closed-outline"
        iconView="lock-open-outline"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Checkbox label="Remember me" value={isRememberMe} onPress={() => setIsRememberMe(!isRememberMe)} />
        <TouchableOpacity>
          <Text style={{ ...Typography.body, color: Colors.primary }}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
      <Button label={isLoading ? "Login..." : "Login"} onPress={handleLogin} />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ ...Typography.body, color: Colors.disabled }}>Don't have an account? </Text>
        <TouchableOpacity>
          <Text style={{ ...Typography.body, color: Colors.primary }}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  }
});

export default Login;